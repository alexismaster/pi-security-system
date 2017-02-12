"use strict";


module.exports = function (image, cv) {
  image.convertGrayscale();
  image.gaussianBlur([7,7]);

  if (!global.image_old) {
    global.image_old = image.copy();
    return false;
  }

  // Разница между текущим кадром и предыдущим
  var diff = new cv.Matrix(image.width(), image.height());
  diff.absDiff(image, global.image_old);
  global.image_old.release();
  global.image_old = image.copy();

  // Use "Binary" (default), "Binary Inverted", "Threshold Truncated", "Threshold to Zero" or "Threshold to Zero Inverted"
  var diff_t = diff.threshold(25, 255, "Binary");
  var countNonZero = diff.countNonZero();
  diff.release();

  // Контуры
  // https://searchcode.com/codesearch/view/75662671/
  //var contours = diff.copy().findContours();
  var contours = diff_t.findContours();
  console.log("counturs count:", contours.size());
  diff_t.release();

  // Дата и время
  var datestring = (new Date).toLocaleDateString() + " " + (new Date).toLocaleTimeString();
  image.putText(datestring, 10, 30, "HERSEY_SIMPLEX", [255,255,255], 0.5, 1);

  if (contours.size()) {
    // Рисуем прямоугольники обозначающие границы найденных контуров
    for (var c = 0; c < contours.size(); ++c) {
      var rect = contours.boundingRect(c);
      if (rect.width * rect.height < 100) continue;
      image.rectangle([rect.x, rect.y], [rect.width, rect.height], [255,255,255], 1);
    }

    image.putText("motion detected", 10, 450, "HERSEY_SIMPLEX", [255,255,255], 0.5, 1);
    image.putText("motion factor: " + countNonZero, 10, 470, "HERSEY_SIMPLEX", [255,255,255], 0.5, 1);
    return true;
  }

  image.putText("motion not detected", 10, 450, "HERSEY_SIMPLEX", [255,255,255], 0.5, 1);
  return false;
}



