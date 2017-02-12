"use strict";

// GPIO.js

// echo "23" > /sys/class/gpio/export
// echo "out" > /sys/class/gpio/gpio23/direction

var fs = require("fs");


var ledOn = function (pin) {
	fs.writeFileSync("/sys/class/gpio/gpio"+pin+"/value", "1");
};

var ledOff = function (pin) {
	fs.writeFileSync("/sys/class/gpio/gpio"+pin+"/value", "0");
};



module.exports = {
	ledOn: ledOn,
	ledOff: ledOff
};
