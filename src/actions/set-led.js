"use strict";


module.exports = function (request, response) {
	var server = this;
	
	if (request.json && request.json.name && request.json.name === "led_1") {
		var GPIO  = require("./../GPIO.js");

		if (request.json.value === "on") {
			if (App.isPi()) GPIO.ledOn(23);
			App.led_1 = true;
		} else {
			if (App.isPi()) GPIO.ledOff(23);
			App.led_1 = false;
		}
	}

  if (App.isPi()) {
    if (request.json && request.json.name && request.json.name === "led_2") {
    var GPIO  = require("./../GPIO.js");

      if (request.json.value === "on") {
        GPIO.ledOn(4);
        App.led_2 = true;
      } else {
        GPIO.ledOff(4);
       App.led_2 = false;
      }
    }
  }
	
	server.reply(response, "/set-led");
};
