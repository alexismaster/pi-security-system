"use strict";

/**
 * Просмотр лога
 */

var fs       = require("fs");
var iProcess = require("i-process");


var getLog = function (name, callback) {
	var lines = [];
	var hash  = new iProcess("tail", ["-n", "100", name]);

	hash.on("line", function (line) {
		lines.push(line);
	});

	hash.on("error", function (data) {
		//throw new Error;
	});

	hash.on("close", function () {
		callback(lines.join("\n"));
	});
};


module.exports = function (req, res) {
	var filename = "/var/log/upstart/security-system.log";
	// tail -f /var/log/syslog | grep 'security-system'

	fs.exists(filename, function (exists) {
		if (exists) {
			getLog(filename, function (data) {
				res.status(200);
				res.set("Content-Type", "text/plain; charset=utf-8");
				res.end(data);
			});
		} else {
			res.status(500);
			res.end("FILE_NOT_FOUND: " + filename);
		}
	});
};