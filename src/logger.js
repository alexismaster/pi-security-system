"use strict";


var sections = {};

const ON    = 1;
const DEBUG = 2;
const OFF   = 3;


if (!process.env.NODE_ENV || process.env.NODE_ENV !== "production") {
	require("colors");
	var blue  = function (str) { return str.toString().blue  };
	var green = function (str) { return str.toString().green };
	var red   = function (str) { return str.toString().red   };
} else {
	var blue  = function (str) { return str };
	var green = function (str) { return str };
	var red   = function (str) { return str };
}


/**
 * Преобразует массив аргументов ф-и в обычный массив
 */
function args2arr(args) {
	return Array.prototype.slice.call(args, 0);
}


/**
 * Возвращает текущую дату
 */
var date = (function () {
	var f = (n) => (n<10?"0"+n:n);

	return function date() {
		var D = new Date,
				d = f(D.getDate()),
				m = f(D.getMonth() + 1),
				y = D.getFullYear(),
				h = f(D.getHours()),
				i = f(D.getMinutes()),
				s = f(D.getSeconds());
		return d+"/"+m+"/"+y+" "+h+":"+i+":"+s;
	}
})();


/**
 * Выводит сообщение в консоль
 * 
 * @param {object} args - Список аргументов ф-и обёртки
 * @param {string} section - Имя модуля/секции
 */
function log(args, section) {
	var pref = [blue("[" + date() + "]")];

	if (section) {
		pref.push(green("["+section+"]"));
	}

	console.log.apply(console, pref.concat(args));

	// if (typeof _callback === "function") {
	// 	_callback.apply(this, pref.concat(args));
	// }
}


/**
 * Фабричный метод
 * 
 * @param {string} section - Модуль/раздел
 * @param {string} level - Уровень логирования
 */
function factory(section, level) {
	if (level === "on") {
		level = ON;
	} else if (level === "off") {
		level = OFF;
	} else if (level === "debug") {
		level = DEBUG;
	} else {
		level = ON;
	}

	if (!sections[section]) {
		sections[section] = level; // on(log,warning,error)|debug(log,debug,warning,error)|off(error)
	}

	var logger = {

		/**
		 * Обычное сообщение
		 */
		log: function () {
			if (sections[section] !== OFF) log(args2arr(arguments), section);
		},

		/**
		 * Ошибка
		 */
		error: function () {
			var args = args2arr(arguments);
			args = args.map(function (arg) {
				return (typeof arg === "string") ? red(arg) : arg; 
			});
			log([red("[ERROR]")].concat(args), section);
		},

		/**
		 * Предупреждение
		 */
		warning: function () {
			if (sections[section] !== OFF) {
				var args = args2arr(arguments);
				log([red("[WARNING]")].concat(args), section);
			}
		},

		/**
		 * Отладочное сообщение
		 */
		debug: function () {
			if (sections[section] === DEBUG) log(args2arr(arguments), section);
		},

		/**
		 * Информационное сообщение
		 */
		info: function () {
			if (sections[section] !== OFF) log(args2arr(arguments), section);
		},

		/**
		 * Возвращает секции используемые в приложении
		 */
		getSections: function () {
			return sections;
		},

		/**
		 * Устанавливает
		 * 
		 * @param {string} name - Модуль/раздел
		 * @param {string} value - Уровень логирования
		 */
		setSection: function (name, value) {
			if (name && typeof sections[name] !== "undefined") {
				sections[name] = value;
			}
		}
	};

	return logger;
}


// Логер по умолчанию (без секции)
var defaultLogger = factory();
defaultLogger.factory = factory;



module.exports = defaultLogger;
