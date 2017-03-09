"use strict";


module.exports = function (request, response) {
	var smsc   = require("smsc-ru");
	var server = this;
	smsc.balance(global.config.sms.login, global.config.sms.password, function (balance) {
		server.reply(response, "Баланс: " + balance + " руб");
	});
};
