"use strict";


module.exports = function (request, response) {
	var server = this;
	
	server.reply(response, App.motionJournal.getAllJson());
};
