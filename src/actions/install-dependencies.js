"use strict";

/**
 * Установка зависимостей
 */

var fs       = require("fs");
var iProcess = require("i-process");


var npmInstall = function (callback) {
	var lines = [];
	//var process = new iProcess("npm", ["install"]);
	var process = new iProcess("sudo", ["-u", global.LINUX_USER, "npm", "install"]);

	process.on("line", function (line) {
		lines.push(line);
	});

	process.on("error", function (data) {
		lines.push(data);
	});

	process.on("close", function () {
		callback(lines.join("\n"));
	});
};


module.exports = function (req, res) {
	npmInstall(function (data) {
		res.set("Content-Type", "text/plain; charset=utf-8");
		res.end(data);
	});
};
