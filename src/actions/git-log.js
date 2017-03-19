"use strict";

/**
 * https://git-scm.com/book/ru/v1/Основы-Git-Просмотр-истории-коммитов
 */

var fs       = require("fs");
var iProcess = require("i-process");


var gitPull = function (callback) {
	var lines = [];
	//var git = new iProcess("sudo", ["-u", global.LINUX_USER, "git", "log", "-5"]);
	//var git = new iProcess("sudo", ["-u", global.LINUX_USER, "git", "log", "--pretty=oneline"]);
	var git = new iProcess("sudo", ["-u", global.LINUX_USER, "git", "log", "--pretty=format:\"%h - %an, %ar : %s\""]);

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
