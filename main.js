"use strict";

/**
 * main
 * 
 * sudo node main.js config.js.example
 */


var logger = require("i-logger");
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
	led_1 : false,  // Глобальное состояние освещения

	isPi: function () {
		return ((require("os")).arch() === "arm");
	}
};


if (App.isPi()) {
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
		//fs.writeFileSync("/sys/class/gpio/gpio23/value", "1");


	  if (++iteration > 1) camera0.getImage(function (image) {
			if (App.image) App.image.release();
			App.image = image;
			//delete require.cache[require.resolve('./src/detector.js')];
			var detector = require("./src/detector.js");
			if (detector(image)) {
				logger.log("motion detected!");
			}
			//image.release();
		}); 

		setTimeout(function () {
			if (!App.led_1) GPIO.ledOff(pin);
			setTimeout(_blink, MINUTE);
		}, 5*SECOND);

	})();
}
else {
	logger.warning("Код выполняется не на малине. Камеры и GPIO работать не будут.");
}




/**
 * web server
 */

if ((require("os")).arch() === "arm") {
	var server = require("i-server").bind(8080, "../../assets/");
} else {
	var server = require("./src/i-server").bind(8080, "./../../assets/");
}

server.on("/camera-1", "GET", function (request, response) {
	server.reply(response, "response response ");
});

server.on("/camera-2", "GET", function (request, response) {
	server.reply(response, "response response ");
});

server.on("/check-sms-balance", "GET", function (request, response) {
	var smsc = require("./smsc-ru/main.js");
	smsc.balance(global.config.sms.login, global.config.sms.password, function (balance) {
		server.reply(response, "Баланс: " + balance + " руб");
	});
});

server.on("/info", "GET", function (request, response) {
	var info = {"led-1": "on", "led-2": "off"};
	server.reply(response, "var INFO = " + JSON.stringify(info));
});

server.on("/set-led", "POST", function (request, response) {
	if (request.json && request.json.name && request.json.name === "led_1") {
		var GPIO  = require("./src/GPIO.js");
		if (request.json.value === "on") {
			if (App.isPi()) GPIO.ledOn(pin);
			App.led_1 = true;
		} else {
			if (App.isPi()) GPIO.ledOff(pin);
			App.led_1 = false;
		}
	}
	server.reply(response, "/set-led");
});





/**
 * stop service
 */
process.on("SIGTERM", function () {
	console.log("SIGTERM");
});
