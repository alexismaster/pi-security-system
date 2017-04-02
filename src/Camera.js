"use strict";

// Camera.js

var cv = require("opencv");

module.exports = function Camera(cam) {
	var camera = new cv.VideoCapture(cam.index);
	camera.setWidth(cam.size[0]);
	camera.setHeight(cam.size[1]);

	var journal = new (require("./Journal.js"))(100);

	// https://01.org/developerjourney/problems-camera-lag
	this.getImage = function (callback) {
		var n = 0;

		journal.add({"time": (new Date).valueOf()});

		(function _read() {
			camera.read(function (error, image) {
				if (++n >= 5) {
					callback(image);
				} else {
					image.release();
					_read();
				}
			});
		})();
	};

	this.getJournal = function () {
		return journal.getAllJson();
	};
}

