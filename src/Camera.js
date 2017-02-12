"use strict";

// Camera.js

var cv = require("opencv");

module.exports = function Camera(cam) {
	var camera = new cv.VideoCapture(cam.index);
	camera.setWidth(cam.size[0]);
	camera.setHeight(cam.size[1]);

	// https://01.org/developerjourney/problems-camera-lag
	this.getImage = function (callback) {
		var n = 0;

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
}

