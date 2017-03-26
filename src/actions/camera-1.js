"use strict";

var pin = 23;

module.exports = function (request, response) {
	// if (App.image) {
	// 	response.writeHead(200, {"Content-Type": "image/jpeg", "Cache-Control": "must-revalidate, max-age=0"});
	// 	response.end(App.image.toBuffer());
	// 	return;
	// }
	// response.writeHead(404, {"Content-Type": "text/plain"});
	// response.end("image not found");

	var server = this;
	
	if (!App.isPi() || typeof global.camera0 === "undefined") {
		server.reply(response, "image not found");
		return;
	}

	var GPIO = App.getGPIO();
	GPIO.pinOn(pin);

	global.camera0.getImage(function (image) {
		response.writeHead(200, {"Content-Type": "image/jpeg", "Cache-Control": "must-revalidate, max-age=0"});
		response.end(image.toBuffer());
		//image.release();

		setTimeout(function () {
			if (!App.led_1) {
				GPIO.pinOff(pin);
			}
		}, 5000);
	});
};
