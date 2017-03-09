
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


Ajax.get = function (url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xhr.onreadystatechange = function () {
    if (this.readyState != 4) return;
    if (this.responseText.indexOf('{') === 0) {
      callback(JSON.parse(this.responseText));
    } else {
      callback(this.responseText);
    }
  };
  xhr.send(null);
};
