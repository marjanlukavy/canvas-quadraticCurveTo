document.addEventListener("DOMContentLoaded", function () {
  var canvas = document.getElementById("myCanvas");
  var context = canvas.getContext("2d");

  var canvas = document.getElementById("myCanvas");
  var context = canvas.getContext("2d");

  var image = new Image();
  image.src =
    "https://lh3.googleusercontent.com/u/0/drive-viewer/AFGJ81rP7upNuZdVEk_pzvxAFPdFwipUtMEDCTzJysYugXCpo4O3ipSrYcoWdWtjz1PZZPpaRS2n0kqQcFBrLOTMe2fim5wF2w=w2880-h1578";

  image.onload = function () {
    context.imageSmoothingEnabled = false;

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
  };
  var isDrawing = false;
  var startPoint, endPoint, midPoint;
  var isDragging = false;
  var dragOffset = { x: 0, y: 0 };
  var draggedDot = null;
  var dots = [];
  var lines = [];

  canvas.addEventListener("mousedown", function (event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    console.log(1);
    draggedDot = getClickedDot(x, y);
    if (draggedDot !== null) {
      isDragging = true;
      dragOffset.x = x - dots[draggedDot].x;
      dragOffset.y = y - dots[draggedDot].y;
    } else {
      isDrawing = true;
      startPoint = { x: x, y: y };
      endPoint = { x: x, y: y };
      midPoint = { x: x, y: y };
      dots.push(startPoint, midPoint, endPoint);
    }
  });

  canvas.addEventListener("mousemove", function (event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    if (isDragging) {
      dots[draggedDot].x = x - dragOffset.x;
      dots[draggedDot].y = y - dragOffset.y;
      if (draggedDot === 1) {
        updateCurve();
      }
      redrawCanvas();
    } else if (isDrawing) {
      endPoint = { x: x, y: y };
      midPoint = calculateMidPoint(startPoint, endPoint);
      redrawCanvas();

      drawLine({
        startPoint: startPoint,
        midPoint: midPoint,
        endPoint: endPoint,
      });
    }
  });

  canvas.addEventListener("mouseup", function () {
    if (isDragging) {
      isDragging = false;
      draggedDot = null;
    } else if (isDrawing) {
      isDrawing = false;
      dots.push(startPoint, midPoint, endPoint);
      var line = {
        startPoint: startPoint,
        midPoint: midPoint,
        endPoint: endPoint,
      };
      lines.push(line);
      redrawCanvas();
    }
  });

  function getClickedDot(x, y) {
    for (var i = 0; i < dots.length; i++) {
      var dot = dots[i];
      if (Math.abs(dot.x - x) <= 5 && Math.abs(dot.y - y) <= 5) {
        return i;
      }
    }
    return null;
  }

  function calculateMidPoint(startPoint, endPoint) {
    return {
      x: (startPoint.x + endPoint.x) / 2,
      y: (startPoint.y + endPoint.y) / 2,
    };
  }

  function updateCurve() {
    var controlPoint = calculateControlPoint(startPoint, endPoint);
    dots[1] = controlPoint;
  }

  function calculateControlPoint(startPoint, midPoint, endPoint) {
    var dx1 = startPoint.x - midPoint.x;
    var dx2 = endPoint.x - midPoint.x;
    var dy1 = startPoint.y - midPoint.y;
    var dy2 = endPoint.y - midPoint.y;
    var dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    var dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

    var pc = {
      x:
        midPoint.x -
        (Math.sqrt(dist1 * dist2) * (dx1 / dist1 + dx2 / dist2)) / 2,
      y:
        midPoint.y -
        (Math.sqrt(dist1 * dist2) * (dy1 / dist1 + dy2 / dist2)) / 2,
    };

    return pc;
  }

  function drawLine(line) {
    var startPoint = line.startPoint;
    var midPoint = line.midPoint;
    var endPoint = line.endPoint;

    var controlPoint = calculateControlPoint(startPoint, midPoint, endPoint);

    context.beginPath();
    context.moveTo(startPoint.x, startPoint.y);
    context.quadraticCurveTo(
      controlPoint.x,
      controlPoint.y,
      endPoint.x,
      endPoint.y
    );
    context.strokeStyle = "#000";
    context.lineWidth = 2;
    context.stroke();

    context.beginPath();
    context.arc(midPoint.x, midPoint.y, 5, 0, 2 * Math.PI);
    context.fillStyle = "#000";
    context.fill();
  }

  function drawDot(point) {
    context.beginPath();
    context.arc(point.x, point.y, 5.4, 0, 2 * Math.PI);
    context.fillStyle = "#000";
    context.fill();
  }

  function redrawCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    for (var i = 0; i < lines.length; i++) {
      drawLine(lines[i]);
    }

    for (var j = 0; j < dots.length; j++) {
      drawDot(dots[j]);
    }
  }

  redrawCanvas();
});
