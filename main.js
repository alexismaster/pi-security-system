"use strict";

/**
 * main
 * 
 * sudo node main.js config.js.example
 * sudo node main.js config.js
 * 
 * sudo service security-system restart
 * 
 * https://developers.google.com/drive/v3/web/quickstart/nodejs
 * 
 */


var path    = require("path");
var fs      = require("fs");
var logger  = require("i-logger");
var Journal = require("./src/Journal.js");
var Sensor  = require("./src/Sensor.js");


const SECOND     = 1000;
const MINUTE     = 60*SECOND;
const START_TIME = (new Date).valueOf();

global.START_TIME = START_TIME;


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



global.App = {
	image  : null,   // Картинка с первой камеры
	led_1  : false,  // Глобальное состояние освещения на первом этаже
	led_2  : false,  // Глобальное состояние освещения на втором этаже
	memory : null,
	security_mode: false,

	motionJournal: new Journal(100),
	sensors: [],

	isPi: (function () {
		var result = ((require("os")).arch() === "arm");
		return function () {
			return result;
		};
	})(),

	getMemory: function () {
		this.memory = (process.memoryUsage().rss / 1048576).toFixed(3);
		return this.memory;
	},

	getGPIO: function () {
		var mmodulePath = (this.isPi()) ? "./src/GPIO.js" : "./src/emulatorGPIO.js";
		return require(mmodulePath);
	},

	callPhone: function (message) {
		//
	},

	sendSms: function (message) {}
};


global.LINUX_USER = App.isPi() ? "pi" : "alexismaster";


/*// Инициализация порта
if (App.isPi()) {
	if (!fs.existsSync("/sys/class/gpio/gpio"+pin+"/direction")) {
		fs.writeFileSync("/sys/class/gpio/export", pin);
		fs.writeFileSync("/sys/class/gpio/gpio"+pin+"/direction", "out");
	} else {
		logger.log("pin already init");
	}
}
else {
	logger.warning("GPIO useg only ARM arch");
}*/




var pin = 23;


if (App.isPi()) {
	var Camera = require("./src/Camera.js");

	if (global.config.cams) {
		global.config.cams.map(function (cam) {
			global["camera" + cam.index] = new Camera(cam);
		});
	}

	// var iteration = 0;
	// var GPIO = App.getGPIO();

	// (function _blink () {
	// 	logger.log("start capture... memory usege:", App.getMemory() + " Mb");  
	// 	GPIO.pinOn(pin);

	// 	if (++iteration > 1) camera0.getImage(function (image) {
	// 		if (App.image) App.image.release();
	// 		App.image = image;
	// 		//delete require.cache[require.resolve('./src/detector.js')];
	// 		var detector = require("./src/detector.js");
	// 		if (detector(image)) {
	// 			logger.warning("motion detected!");

	// 			App.motionJournal.add({
	// 				  "time"      : (new Date).valueOf()
	// 				, "iteration" : iteration
	// 				, "camera_id" : "camera0"
	// 			});
	// 		}
	// 		//image.release();
	// 	});

	// 	setTimeout(function () {
	// 		if (!App.led_1) GPIO.pinOff(pin);
	// 		setTimeout(_blink, 5*MINUTE);
	// 	}, 5*SECOND);

	// })();
}
else {
	logger.warning("Код выполняется не на малине. Камеры и GPIO работать не будут.");
}



/**
 * web server
 */

App.http_journal = new Journal(100);

if (App.isPi()) {
	var server = require("i-server").bind(global.config.webServer.port, "../../assets/");
} else {
	var server = require("./src/i-server").bind(global.config.webServer.port, "./../../assets/");
}

function addRoute(name, method, callback) {
	if (typeof callback === "function") {
		var action = callback.bind(server);
	} else {
		var action = require("./src/actions/"+name+".js").bind(server);
	}
	server.on("/" + name, method, function (request, response) {
		var ip =  request.headers['x-forwarded-for'] || 
							request.connection.remoteAddress || 
							request.socket.remoteAddress ||
							request.connection.socket.remoteAddress;

		App.http_journal.add({"action": name, "date": (new Date).valueOf(), "ip": ip.replace("::ffff:", "")});
		
		if (/^camera-[0-9]/.test(name) || isAuthenticated(request, response)) {
			// это позволяет копировать кода написанный мной ранее для express
			response.set = function (headers) {
				response.writeHead(200, headers);
			};

			action(request, response);
		}
	});
}

addRoute("camera-1", "GET");
addRoute("camera-2", "GET");
addRoute("check-sms-balance", "GET");
addRoute("motion-journal", "GET");
addRoute("info", "GET");
addRoute("set-led", "POST");
addRoute("status", "POST");
addRoute("http_journal", "GET");

addRoute("git-pull", "GET");
addRoute("install-dependencies", "GET");
addRoute("app-restart", "GET");
addRoute("get-log", "GET");
addRoute("git-log", "GET");
addRoute("current-commit", "GET");


// Проверяет аутентификацию
var isAuthenticated = function (req, res) {
  var header   = req.headers['authorization'] || '',
      token    = header.split(/\s+/).pop() || '',
      auth     = new Buffer(token, 'base64').toString(),
      parts    = auth.split(/:/),
      username = parts[0],
      password = parts[1];

  if (username !== "admin" || password !== "admin") {
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="SERVER"');
    res.end('Unauthorized');
    return false;
  } else {
    return true;
  }
};



/**
 * Sensors
 */

if (global.config.sensors) {
	App.sensors = global.config.sensors.map(function (settings) {

		var sensor = new Sensor(settings);

		if (settings.pin > 0) {
			addRoute("sensors-journal/" + settings.pin, "GET", function (request, response) {
				this.reply(response, sensor.getJournal());
			});
		}

		return sensor;
	});
}


(function checkSensors() {
	var result = App.sensors.map(function (sensor) {
		if (sensor.check()) {
			logger.warning("Сработал " + sensor.getName() + " !")
		}
	});

	setTimeout(checkSensors, 5*SECOND);
})();



/**
 * stop service
 */
process.on("SIGTERM", function () {
	logger.warning("SIGTERM");
});
