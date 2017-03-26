"use strict";


module.exports = function (request, response) {
	var server = this;
  var os = require("os");
  var info = {
      "led_1"  : (App.led_1 ? "on" : "off")
    , "led_2"  : "off"
    , "memory" : App.getMemory()
    , "uptime" : (new Date).valueOf() - START_TIME
    , "freemem": os.freemem()
    , "sensors": App.sensors
    , "security_mode": (global.App.security_mode) ? "on" : "off"
  };
  server.reply(response, "var INFO = " + JSON.stringify(info));
};
