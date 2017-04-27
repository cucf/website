/*
	*** PART 1 ***
	
	"express" is the web framework library we downloaded with npm install.
	all libraries are imported as an object using the require method, so now we have an object with a bunch of web tools.
*/

var express = require('express');

var app = express();

app.use(express.static('forge'));

/*
	*** Part 2 ***
	
	all languages require a 'driver' to communicate with a database. here, the mongodb driver is imported and we obtain a client.
	a 'client' is the actual object you use to talk with a database. here, we use the client to connect to the "data" database.
*/
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/data',function(err,db) {
	if(err) {
		console.log(err);
		process.exit();
	} else {
		app.set("db",db);
	}
});

/*
	*** Part 3 ***
	
	these are the functions we'll use to handle different requests. we store them in an object called "routes".
*/

var routes = {};

routes.index = function(request,response) {

	var db = request.app.get("db");
	var collection = db.collection('posts');
	
	var head = `<!DOCTYPE html>
					<html>
						<head>
							<meta charset='utf-8'>
							<script src='client.js'></script>
						</head>
						<body>
							<input id="content" type="text"><button onclick="postit();">Post</button><br>
				`;
	
	var foot = `</body></html>`;
	
	request.on('data', function(data) {}); // requests won't complete without this
	
	request.on('end',function() {

		collection.find().toArray(function(err, docs) {
			
			var body = '';			
			
			for(var i = 0; i < docs.length; i++) {
				var current = docs[i];
				body += `<p>${current._id} : ${current.post}</p>`;
			}
			
			response.end(head + body + foot);
			
		});

	});
};

routes.post = function(request,response) {

	var qs = require('querystring');
	
	var db = request.app.get("db");
	var collection = db.collection('posts');
	
	var body = '';
	request.on('data',function(data) {
        body += data;
    });
	
	request.on('end',function() {
		var POST = qs.parse(body);

		collection.insertOne({ post : POST.content });
		
		response.end('done');
	});
};

/*
	*** Part 4 ***
	
	here we set up routes and start the web server listening on port 2000.
*/

app.get('/',routes.index);
app.post('/post',routes.post);

app.listen(2000,function() {
	console.log("listening...");
});


