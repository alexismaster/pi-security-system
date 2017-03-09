"use strict";


module.exports = function (request, response) {
	var server = this;
	
	if (!App.isPi() || typeof global.camera1 === "undefined") {
		server.reply(response, "image not found");
		return;
	}
	global.camera1.getImage(function (image) {
		response.writeHead(200, {"Content-Type": "image/jpeg", "Cache-Control": "must-revalidate, max-age=0"});
		response.end(image.toBuffer());
		//image.release();
	});
};
