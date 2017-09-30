#!/bin/bash

MASTER_IP=
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

# join the nodes to the cluster
kubeadm join --token $TOKEN $MASTER_IP:6443

# clean up
unset MASTER_IP
unset TOKEN
