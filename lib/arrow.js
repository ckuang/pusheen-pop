(function () {
  if (typeof PuzzleBobble === "undefined") {
    window.PuzzleBobble = {};
  }

var rad = (Math.PI / 180)

var Arrow = PuzzleBobble.Arrow = function () {
  this.centerX = 250;
  this.centerY = 660;
  this.radius = 8;
  this.angle = 90;
}

Arrow.prototype.changePosition = function () {
  deltaY = Math.sin(this.angle * rad) * 60
  deltaX = Math.sqrt(Math.pow(60, 2) - Math.pow(deltaY, 2))
  if (this.angle === 90) {
    this.centerX = 250;
    this.centerY = 660;
  } else if (this.angle > 90) {
    this.centerX = 250 + deltaX
    this.centerY = 720 - deltaY
  } else {
    this.centerX = 250 - deltaX
    this.centerY = 720 - deltaY
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
