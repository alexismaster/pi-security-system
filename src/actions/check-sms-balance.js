"use strict";


module.exports = function (request, response) {
	var smsc   = require("smsc-ru");
	var server = this;

	if (!App.isPi() || typeof global.camera1 === "undefined") {
		server.reply(response, "image not found");
		return;
	}

	smsc.balance(global.config.sms.login, global.config.sms.password, function (balance) {
		server.reply(response, "Баланс: " + balance + " руб");
	});
};
