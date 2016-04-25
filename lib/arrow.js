(function () {
  if (typeof PuzzleBobble === "undefined") {
    window.PuzzleBobble = {};
  }

var rad = (Math.PI / 180)

var Arrow = PuzzleBobble.Arrow = function () {
  this.centerX = 210;
  this.centerY = 500;
  this.radius = 6;
  this.angle = 90;
}

Arrow.prototype.changePosition = function () {
  deltaY = Math.sin(this.angle * rad) * 50
  deltaX = Math.sqrt(Math.pow(50, 2) - Math.pow(deltaY, 2))
  if (this.angle === 90) {
    this.centerX = 210;
    this.centerY = 500;
  } else if (this.angle > 90) {
    this.centerX = 210 + deltaX
    this.centerY = 550 - deltaY
  } else {
    this.centerX = 210 - deltaX
    this.centerY = 550 - deltaY
  }
}

Arrow.prototype.rightClick = function () {
  if (this.angle < 160) {
    this.angle += 6;
    this.changePosition();
  }
};

Arrow.prototype.leftClick = function () {
  if (this.angle > 20) {
    this.angle -= 6;
    this.changePosition();
  }
};

Arrow.prototype.spaceBar = function () {};

Arrow.prototype.render = function (ctx) {
  ctx.fillStyle = "white";
  ctx.beginPath();

  ctx.arc(
    this.centerX,
    this.centerY,
    this.radius,
    0,
    2 * Math.PI,
    false
  );

  ctx.fill();
}

})();
