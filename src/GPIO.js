"use strict";

// GPIO.js

// echo "23" > /sys/class/gpio/export
// echo "out" > /sys/class/gpio/gpio23/direction

// echo "24" > /sys/class/gpio/export
// echo "in" > /sys/class/gpio/gpio24/direction
// cat /sys/class/gpio/gpio24/value
// while true; do cat /sys/class/gpio/gpio24/value; sleep 3; done

var fs = require("fs");

var pins = {};


function pinInit(pin, type) {
	type = type || "out";
	// Инициализация порта
	if (typeof pins[pin] === "undefined" && !fs.existsSync("/sys/class/gpio/gpio"+pin+"/direction")) {
		fs.writeFileSync("/sys/class/gpio/export", pin);
		fs.writeFileSync("/sys/class/gpio/gpio"+pin+"/direction", type);
	}
}

function writeValue(pin, value) {
	if (typeof value === "number") {
		value = value.toString();
	}
	if (typeof value === "boolean") {
		value = (value) ? "1" : "0";
	}

	pinInit(pin);

	if (pins[pin] !== value) {
		fs.writeFileSync("/sys/class/gpio/gpio"+pin+"/value", value);
		pins[pin] = value;
	}
}

function readValue(pin) {
	pinInit(pin, "in");
	pins[pin] = fs.readFileSync("/sys/class/gpio/gpio"+pin+"/value");
	return parseInt(pins[pin], 10);
}


var ledOn = function (pin) {
	writeValue(pin, "1");
};

var ledOff = function (pin) {
	writeValue(pin, "0");
};


module.exports = {
	"pinOn"  : ledOn,
	"pinOff" : ledOff,
	"pinSet" : writeValue,
	"pinGet" : readValue,
	// deprecated
	"ledOn"  : ledOn,
	"ledOff" : ledOff
};
