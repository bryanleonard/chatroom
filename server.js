var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};

var server = http.createServer(function(req, res) {
	var filePath = false;

	if (req.url == "/") {
		filePath = 'public/index.html';
	} else {
		filePath = 'public' + req.url;
	}

	var absPath = './' + filePath;
	serveStatic(res, cache, absPath);
});

function send404(res) {
	res.writeHead(404, {'content-type': 'text/plain'});
	res.write("404, sorry about your luck, dude.")
	res.end();
};

function sendFile(res, filePath, fileContents) {
	res.writeHead(
		200, 
		{"content-type": mime.lookup(path.basename(filePath))}
	);
	res.end(fileContents);
};

function serveStatic(res, cache, absPath) {
	if (cache[absPath]) {
		sendFile(res, absPath, cache[absPath]);
	} else {
		fs.exists(absPath, function(exists) {
			if (exists) {
				fs.readFile(absPath, function(err, data) {
					if (err) {
						send404(message);
					} else {
						cache[absPath] = data;
						sendFile(res, absPath, data);
					}
				});
			} else {
				send404(res);
			}
		});
	}
};

server.listen(3000, function() {
	console.log("Listening on 3000.");
});


var chatServer = require('./lib/chat_server');
chatServer.listen(server);
