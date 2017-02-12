"use strict";

/**
 * main
 * 
 * sudo node main.js config.js.example
 */


var cv = require("opencv");
var logger = require("./src/logger.js");
var path = require("path");
var fs = require("fs");


const SECOND = 1000;
const MINUTE = 60*SECOND;


// Не укаазн конфиг
if (process.argv.length < 3) {
	logger.error("Не указан файл конфигураций");
	process.exit(1);
}


var configPath = path.join(__dirname, process.argv[2]);
logger.log("configPath:", configPath);


// Конфиг не существует
if (!fs.existsSync(configPath)) {
	logger.error("Конфиг не существует:", configPath);
	process.exit(1);
}


global.config = require(configPath);


var pin = 23;


global.App = {
	image : null,  // Картинка с первой камеры
	ledOn : false  // Глобальное состояние освещения
};



var Camera = require("./src/Camera.js");

if (global.config.cams) {
	global.config.cams.map(function (cam) {
		global["camera" + cam.index] = new Camera(cam);
	});
}



var iteration = 0;

(function _blink () {
	var GPIO  = require("./src/GPIO.js");
	var memMB = process.memoryUsage().rss / 1048576;
	logger.log("start capture... memory usege:", memMB.toFixed(3) + " Mb");  
	GPIO.ledOn(pin);
	fs.writeFileSync("/sys/class/gpio/gpio23/value", "1");


  if (++iteration > 1) camera0.getImage(function (image) {
		if (App.image) App.image.release();
		App.image = image;
		//delete require.cache[require.resolve('./detector.js')];
		var detector = require("./detector.js");
		if (detector(image, cv)) {
			logger.log("motion detected!");
		}
		//image.release();
	}); 

	setTimeout(function () {
		GPIO.ledOff(pin);
		setTimeout(_blink, MINUTE);
	}, 5*SECOND);

})();



/**
 * web server
 */
require("./src/WebServer.js")(80);



/**
 * stop service
 */
process.on("SIGTERM", function () {
	console.log("SIGTERM");
});
