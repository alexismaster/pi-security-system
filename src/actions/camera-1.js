"use strict";


module.exports = function (request, response) {
	if (App.image) {
		response.writeHead(200, {"Content-Type": "image/jpeg", "Cache-Control": "must-revalidate, max-age=0"});
		response.end(App.image.toBuffer());
		return;
	}
	response.writeHead(404, {"Content-Type": "text/plain"});
	response.end("image not found");
};
