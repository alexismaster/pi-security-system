"use strict";

// WebServer.js

var http = require("http");
var logger = require("./loggre.js")("web_server");


var server = http.createServer(function (request, response) {
	if (request.url.indexOf("jpg") === -1) {
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.end("not found");
		return;
	}

	if (App.image) {
		response.writeHead(200, {"Content-Type": "image/jpeg", "Cache-Control": "must-revalidate, max-age=0"});
		response.end(App.image.toBuffer());
		return;
	}

	var camera = (request.url.indexOf("image0") !== -1) ? camera0 : camera1;

	camera.getImage(function (image) {
		response.writeHead(200, {"Content-Type": "image/jpeg", "Cache-Control": "must-revalidate, max-age=0"});
		response.end(image.toBuffer());
		image.release();
	});
});

server.listen(80, function () {
	logger.log("WebServer is listening on port:", 80);
});



module.exports = function (port) {
	//
};
