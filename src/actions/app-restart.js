"use strict";

/**
 * Перезапуск приложения
 */

var fs       = require("fs");
var iProcess = require("i-process");


var gitPull = function (callback) {
	var lines = [];
	var sudo  = new iProcess("sudo", ["service", "security-system", "restart"]);

	sudo.on("line", function (line) {
		lines.push(line);
	});

	sudo.on("error", function (data) {
		lines.push(data);
	});

	sudo.on("close", function () {
		callback(lines.join("\n"));
	});
};


module.exports = function (req, res) {
	gitPull(function (data) {
		res.set("Content-Type", "text/plain; charset=utf-8");
		res.end(data);
	});
};