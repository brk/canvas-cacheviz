var movingcircle;

var dragging;
var x = 10;
var y = 10;
var width  = 100;
var height = 100;
var deltaX;
var deltaY;
var offsetX;
var offsetY;
var evtX;
var evtY;

var context;
var circles;
var lines;
var gradient;
var canvas;

var green_grad;

var blue_grad;

function Circle(x, y, r) {
  this.x = x;
  this.y = y;
  this.r = r ? r : 10;

  this.draw = function(r) {
    context.beginPath();
    context.arc(this.x, this.y, r ? r : this.r, 0, Math.PI*2, true);
    context.closePath();
    context.fill();
  }

  this.moveTo = function() {
    context.moveTo(this.x, this.y);
  }

  this.lineTo = function() {
    context.lineTo(this.x, this.y);
  }

  this.isHit = function(hitX, hitY) {
    var dx = hitX - this.x;
    var dy = hitY - this.y;

    return Math.sqrt(dx*dx + dy*dy) <= this.r;
  }
}

function Line(startCircle, endCircle) {
  this.start = startCircle;
  this.end = endCircle;

  this.draw = function(w) {
    w = w ? w : 1;
    context.save();
    context.strokeStyle = "#dddddd";
    context.beginPath();
    this.start.moveTo();
    this.end.lineTo();
    context.stroke();
    context.restore();
  }

  this.lerp = function(t) {
    var vx = this.end.x - this.start.x;
    var vy = this.end.y - this.start.y;
    var x  = this.start.x + t*vx;
    var y  = this.start.y + t*vy;
    var c  = new Circle(x, y, 5);
    return c;
  }
}

function GradientBar(x1, y1, x2, y2) {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;

  this.draw = function() {
    var g = context.createLinearGradient(this.x1, this.y1, this.x2, this.y2);
    g.addColorStop(0.0, "#000000");
    g.addColorStop(1.0, "#DDDDDD");
    context.fillStyle = g;
    context.fillRect(this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1);
  }

  this.isHit = function(hitX, hitY) {

    return ((hitX >= this.x1) &&
	    (hitX <= this.x2) &&
	    (hitY >= this.y1) &&
	    (hitY <= this.y2));
  }
}

function main() {
  circles = new Array(new Circle(20, 20),
		      new Circle(300, 300),
		      new Circle(400, 200));
  lines = new Array(new Line(circles[0], circles[1]),
		    new Line(circles[1], circles[2]));

  gradient = new GradientBar(25, 600, 625, 645);

  canvas  = document.getElementById("my-canvas");
  offsetX = getOffsetX(canvas);
  offsetY = getOffsetY(canvas);
  context = canvas.getContext("2d");
  context.fillStyle = "#900";

  green_grad = context.createLinearGradient(25,600, 625,645);
  green_grad.addColorStop(0.0, '#003300');
  green_grad.addColorStop(1.0, '#00EE00');

  blue_grad = context.createLinearGradient(25,600, 625,645);
  blue_grad.addColorStop(0.0, '#000033');
  blue_grad.addColorStop(1.0, '#0000EE');

  paint();
}

function paint() {
  context.clearRect(0, 0, 650, 600);

  gradient.draw();

  for (var i in lines) {
    lines[i].draw();
  }

  for (var i in circles) {
    circles[i].draw();
  }


}

function canvasPressed(evt) {
  translateEventCoords(evt);

  for (var i in circles) {
    if (circles[i].isHit(evtX, evtY)) {
      movingcircle = i;
      dragging = true;
      deltaX = evtX - circles[i].x;
      deltaY = evtY - circles[i].y;

      break;
    }
  }
}

function plotSplinePoint1(t) {
  var c1 = lines[0].lerp(t);
  var c2 = lines[1].lerp(t);

  var l = new Line(c1 , c2);

  context.save();
  context.fillStyle = blue_grad;
  l.lerp(t).draw();
  context.restore();
}

function plotSplinePoint(t) {
  var c1 = lines[0].lerp(2*t);
  var c2 = lines[1].lerp(-1 + 2*t);

  var l = new Line(c1 , c2);

  context.save();
  context.fillStyle = green_grad;
  l.lerp(t).draw();
  context.restore();
}

function onMouseMoved(evt) {
  translateEventCoords(evt);

  if (gradient.isHit(evtX, evtY)) {
    var x = evt.pageX - offsetX;
    var y = evt.pageY - offsetY;

    var t = (x-gradient.x1) / (gradient.x2 - gradient.x1);
    plotSplinePoint1(t);
    plotSplinePoint(t);
  }
  else {
    canvasDragged(evt);
  }
}

function canvasDragged(evt) {
  if (!dragging) return;
  translateEventCoords(evt);

  circles[movingcircle].x = evtX - deltaX;
  circles[movingcircle].y = evtY - deltaY;

  paint();
}

function canvasReleased(evt) {
  dragging = false;
}

function translateEventCoords(evt) {
  evtX = evt.pageX - offsetX;
  evtY = evt.pageY - offsetY;
}

function getOffsetX(node) {
  var result = node.offsetLeft;
  for (var parent = node; parent = parent.offsetParent; parent != null) {
    result += parent.offsetLeft;
  }
  return result;
}

function getOffsetY(node) {
  var result = node.offsetTop;
  for (var parent = node; parent = parent.offsetParent; parent != null) {
    result += parent.offsetTop;
  }
  return result;
}
