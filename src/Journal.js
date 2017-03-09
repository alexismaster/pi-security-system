"use strict";

/**
 * Журнал фиксированного размера. Старые записи автоматически удаляются.
 */


var Journal = (function () {
	
	var Constructor = function Journal(size) {
		this._counter = 0;
		this._size = size || 25;
		this._data = [];
	};

	Constructor.prototype = {
		add: function (note) {
			this._data.push(note);

			if (this._data.length > this._size) {
				this._data.shift();
			}

			this._counter++;
		},

		getAll: function () {
			return this._data;
		},

		getAllJson: function () {
			return JSON.stringify(this.getAll());
		},

		// Размер журнала
		size: function () {
			return this._data.length;
		},

		// Число операций записи
		count: function () {
			return this._counter;
		}
	};

	return Constructor;

})();



module.exports = Journal;
