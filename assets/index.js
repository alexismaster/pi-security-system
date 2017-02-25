

var app = new Vue({
	el: '#app',
	data: {
		led_1: "off",
		led_2: "off",
		memory: 0,
		uptime: 0,
		freemem: 0,
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
		app[opt] = INFO[opt];
	}
}
