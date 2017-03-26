"use strict";

var logger = require("i-logger").factory("Sensor");


var Sensor = (function () {
	
	var Constructor = function Sensor(config) {
		this.config  = config;
		this.journal = new (require("./Journal.js"))(50);
	};

	Constructor.prototype = {
		getJournal: function () {
			return this.journal.getAllJson();
		},
		check: function () {
			if (this.config.pin > 0) {
				var GPIO  = App.getGPIO();
				var value = GPIO.pinGet(this.config.pin);
				logger.debug(this.config.name + ": " + value);
				if (value !== this.journal.last().value) {
					console.log(typeof value, typeof this.journal.last().value, value, this.journal.last().value)
					this.journal.add({"time": (new Date).valueOf(), "value": value});
				}
				return value;
			} else {
				logger.debug(this.config.name + " - disabled");
				return 0;
			}
		},
		getName: function () {
			return this.config.name;
		}
	};

	return Constructor;

})();



module.exports = Sensor;
