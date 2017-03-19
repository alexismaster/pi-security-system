"use strict";

/**
 */

var fs       = require("fs");
var iProcess = require("i-process");


var gitPull = function (callback) {
	var lines = [];
	//var git   = new iProcess("git", ["pull", "origin", "master"]);
	var git = new iProcess("sudo", ["-u", global.LINUX_USER, "git", "pull", "origin", "master"]);

	git.on("line", function (line) {
		lines.push(line);
	});

	git.on("error", function (data) {
		lines.push(data);
	});

	git.on("close", function () {
		callback(lines.join("\n"));
	});
};


module.exports = function (req, res) {
	gitPull(function (data) {
		res.set("Content-Type", "text/plain; charset=utf-8");
		res.end(data);
	});
};
