function postit() {
	
	/* get the url for ajax request */
	var splitUrl = window.location.href.split("/");
	var url = splitUrl[0] + "//" + splitUrl[2] + "/post";
	
	
	/* get the parameters to send */
	var params = "content=" + document.getElementById("content").value;


	/* create and make ajax request */
	var ajax = new XMLHttpRequest();
	
	ajax.open("POST", url, true);
	
	ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	
	ajax.onreadystatechange = function() {
		
        if (ajax.readyState == XMLHttpRequest.DONE ) {
	        
			if(ajax.status == 200 && ajax.responseText == "done") {
	        	location.reload();
			}
			else {
				console.log([ajax.status,ajax.responseText]);
			}
			
        }
    }
	    
	ajax.send(params);
}