"use strict";


module.exports = function (request, response) {
	this.reply(response, App.http_journal.getAllJson());
};
