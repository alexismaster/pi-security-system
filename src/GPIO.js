"use strict";

// GPIO.js

// echo "23" > /sys/class/gpio/export
// echo "out" > /sys/class/gpio/gpio23/direction

var fs = require("fs");


var pins = {};


var ledOn = function (pin) {
  if (pins[pin] === "1") return;
	fs.writeFileSync("/sys/class/gpio/gpio"+pin+"/value", "1");
  pins[pin] = "1";
};


var ledOff = function (pin) {
  if (pins[pin] === "0") return;
	fs.writeFileSync("/sys/class/gpio/gpio"+pin+"/value", "0");
  pins[pin] = "0";
};



module.exports = {
	ledOn: ledOn,
	ledOff: ledOff
};
