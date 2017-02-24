

var app = new Vue({
	el: '#app',
	data: {
		led_1: "off",
		led_2: "off"
	},
	methods: {
		led: function (event) {
			var btn = event.target;
			if (btn.tagName === 'INPUT') {
				//console.log(btn.getAttribute("name"), btn.getAttribute("value"));
				var json = {name: btn.getAttribute("name"), value: btn.getAttribute("value")};
				Ajax.post("/set-led", json, function (data) {
					console.log(data);
				});
			}
		}
	}
});


var Ajax = {};


Ajax.post = function (url, json, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xhr.onreadystatechange = function () {
    if (this.readyState != 4) return;
    if (this.responseText.indexOf('{') === 0) {
      callback(JSON.parse(this.responseText));
    } else {
      callback(this.responseText);
    }
  };
  xhr.send(JSON.stringify(json));
};


Ajax.get = function () {
  //...
};
