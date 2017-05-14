#!/bin/bash

TOKEN=

apt-get update && apt-get upgrade -y

# download package key
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -

# add debian package info to sources list, look up "here document" if you don't understand this syntax
cat <<EOF > /etc/apt/sources.list.d/kubernetes.list
deb http://apt.kubernetes.io/ kubernetes-xenial main
EOF

# update will load the added debian package info
apt-get update -y

# install docker & kubernetes package
apt-get install -y docker.io
apt-get install -y --allow-unauthenticated kubelet kubeadm kubectl kubernetes-cni

# get the public IP from the metadata endpoint
export MASTER_IP=$(curl -s http://169.254.169.254/metadata/v1/interfaces/public/0/ipv4/address)

# install kubernetes, CIDR is for use with flannel networking software, IP & token is for connecting nodes to cluster
kubeadm init --pod-network-cidr=10.244.0.0/16  --apiserver-advertise-address $MASTER_IP --token $TOKEN

# admin.conf has configuration info on controlling the cluster, we'll move it here in order to download it to our local machine later
cp /etc/kubernetes/admin.conf $HOME/
chown $(id -u):$(id -g) $HOME/admin.conf
export KUBECONFIG=$HOME/admin.conf

# create flannel pod
kubectl create -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel-rbac.yml --namespace=kube-system
kubectl create -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml --namespace=kube-system

# create kubernetes dashboard pod
kubectl create -f https://rawgit.com/kubernetes/dashboard/master/src/deploy/kubernetes-dashboard.yaml --namespace=kube-system

# clean up
unset TOKEN
