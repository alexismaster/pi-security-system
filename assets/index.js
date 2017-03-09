

var app = new Vue({
	el: '#app',
	data: {
		led_1   : "off",
		led_2   : "off",
		memory  : 0,
		uptime  : 0,
		freemem : 0,
		sensors : [],
		security_mode: "on",
	},
	methods: {
		led: function (event) {
			var btn = event.target;
			if (btn.tagName === 'INPUT') {
				var json = {name: btn.getAttribute("name"), value: btn.getAttribute("value")};
				Ajax.post("/set-led", json, function (data) {
					console.log(data);
				});
			}
		}
	}
});


if (typeof INFO === "object") {
	for (var opt in INFO) if (typeof app[opt] !== "undefined") {
		if (opt === "uptime") {
			INFO[opt] = (INFO[opt]/1000/60).toFixed(0) + ' мин';
		} else if (opt === "freemem") {
			INFO[opt] = (INFO[opt]/1048576).toFixed(3) + ' Мб';
		} else {
		}

		app[opt] = INFO[opt];
	}
}
