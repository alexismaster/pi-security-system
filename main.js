
var cv = require('opencv');

//var gpio = require('rpi-gpio');
var pin = 23;


global.App = {
  image: null,  // Картинка с первой камеры
  ledOn: false  // Глобальное состояние освещения
};


// echo "23" > /sys/class/gpio/export
// echo "out" > /sys/class/gpio/gpio23/direction

var fs = require('fs');

var ledOn = function (pin) {
  fs.writeFileSync("/sys/class/gpio/gpio"+pin+"/value", "1");
};


var ledOff = function (pin) {
  fs.writeFileSync("/sys/class/gpio/gpio"+pin+"/value", "0");
};


var iteration = 0;

(function _blink () {
  var memMB = process.memoryUsage().rss / 1048576;
  console.log('start capture...', memMB);  
  ledOn(pin);
  fs.writeFileSync("/sys/class/gpio/gpio23/value", "1");
  
  
  if (++iteration > 1) getImage(camera1, function (image) {
    if (App.image) App.image.release();
    App.image = image;
    //delete require.cache[require.resolve('./detector.js')];
    var detector = require('./detector.js');
    if (detector(image, cv)) {
      console.log('motion detected!');
    }


    //image.release();
  }); 
  
  setTimeout(function () {
    ledOff(pin);
    setTimeout(_blink, 60*1000);
  }, 5000);

})();




/*gpio.setup(pin, gpio.DIR_OUT, function (err, res) {
  if (err) console.log('setup error:', err);
  setInterval(function () { blink() }, 5*1000);
});*/

/*var blink = function () {
  gpio.write(pin, true, function (err, res) {
    console.log(err, res)
    setTimeout(function () {
      gpio.write(pin, false, function (err, res) {
        console.log('blink')
      });
    }, 2500);
  });
};*/




var camera1 = new cv.VideoCapture(0);
camera1.setWidth(640);
camera1.setHeight(480);

var camera2 = new cv.VideoCapture(1);
camera2.setWidth(640);
camera2.setHeight(480);





var http = require('http');

var server = http.createServer(function (request, response) {
  if (request.url.indexOf('jpg') === -1) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end("not found");
    return;
  }

  var camera = (request.url.indexOf('image1') !== -1) ? camera1 : camera2;

  if (App.image) {
    response.writeHead(200, {'Content-Type': 'image/jpeg', 'Cache-Control': 'must-revalidate, max-age=0'});
    response.end(App.image.toBuffer());
    return;
  }

  getImage(camera, function (image) {
    //camera.read(function (error, image) {

    // HERSEY_SCRIPT_COMPLEX, HERSEY_SCRIPT_SIMPLEX
    //image.putText((new Date).toLocaleDateString() + " " + (new Date).toLocaleTimeString(), 25, 50, "HERSEY_SIMPLEX", [255,255,255], 0.5, 1);

    /*delete require.cache[require.resolve('./detector.js')];
    var detector = require('./detector.js');
    image = detector(image, cv);*/

    response.writeHead(200, {'Content-Type': 'image/jpeg', 'Cache-Control': 'must-revalidate, max-age=0'});
    response.end(image.toBuffer());

    image.release();
  });

    //  gpio.write(pin, false, function (err, res) {
    //    //
    //  });

});



// лаги
// https://01.org/developerjourney/problems-camera-lag
var getImage = function (camera, callback) {
  var n = 0;

  (function _read() {
    camera.read(function (error, image) {
      //(++n >= 5) ? callback(image) : (image.release() && _read());
      if (++n >= 5) {
        callback(image);
      } else {
        image.release();
        _read();
      }
    });
  })();
};





server.listen(80, function () {
  console.log('WebServer is listening on port:', 80);
});




process.on('SIGTERM', function () {
  console.log('SIGTERM');

  gpio.destroy(function () {
    console.log('destroy gpio');
    process.exit(0);
  });
});

