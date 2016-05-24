(function () {
  if (typeof PuzzleBobble === "undefined") {
    window.PuzzleBobble = {};
  }


  var COLORS = ["#f7d7bd", "#ffbabd", "#fffbf7", "#94867b"]
  var RAD = (Math.PI / 180)

  var Bubble = PuzzleBobble.Bubble = function (posX, posY, bool, id) {
    this.uniqueId = id
    this.centerX = posX;
    this.centerY = posY;
    this.radius = 25;
    this.color = COLORS[Math.floor(Math.random(4) * 4)];
    this.moving = bool
    this.motionAngle = 90
  }

  Bubble.prototype.move = function (angle) {
    var vecY = (25 * Math.sin(angle * RAD))
    var vecX = Math.sqrt(Math.pow(25, 2) - Math.pow(vecY, 2))
    if (angle >= 90) {
      this.centerX += vecX
      this.centerY -= vecY
    } else if (angle < 90) {
      this.centerX -= vecX
      this.centerY -= vecY
    }
  }

  Bubble.prototype.getNeighbors = function (otherBubbles) {
    var neighbors = []
    var that = this
    for (var i = 0; i < otherBubbles.length; i++) {
      if (otherBubbles[i].withinFifty(that)) {
        neighbors.push(otherBubbles[i])
      }
    }

    return neighbors
  }

  Bubble.prototype.isNeighborSameColor = function (neighbors) {
    for (var i = 0; i < neighbors.length; i++) {
      if (neighbors[i].color === this.color) {
        return true
      }
    }
    return false
  }

  Bubble.prototype.newPosition = function (position, otherBubble) {
    switch (position) {
      case 1:
        this.centerX = otherBubble.centerX + 25
        this.centerY = otherBubble.centerY - (25 * Math.sqrt(3))
        break;
      case 2:
        this.centerX = otherBubble.centerX + 50
        this.centerY = otherBubble.centerY
        break;
      case 3:
        this.centerX = otherBubble.centerX + 25
        this.centerY = otherBubble.centerY + (25 * Math.sqrt(3))
        break;
      case 4:
        this.centerX = otherBubble.centerX - 25
        this.centerY = otherBubble.centerY + (25 * Math.sqrt(3))
        break;
      case 5:
        this.centerX = otherBubble.centerX - 50
        this.centerY = otherBubble.centerY
        break;
      case 6:
        this.centerX = otherBubble.centerX - 25
        this.centerY = otherBubble.centerY - (25 * Math.sqrt(3))
        break;
    }


  }

  Bubble.prototype.setPosition = function (otherBubble, distance) {

    var deltaX = otherBubble.centerX - this.centerX
    var deltaY = (25 * Math.abs(otherBubble.centerY - this.centerY)) / distance
    if (deltaX <= 0) {
      if (deltaY >= 12.5 && this.centerY < otherBubble.centerY) {
        this.newPosition(1, otherBubble)
      } else if (deltaY >= 12.5 && this.centerY > otherBubble.centerY) {
        this.newPosition(3, otherBubble)
      } else {
        this.newPosition(2, otherBubble)
      }
    } else {
      if (deltaY >= 12.5 && this.centerY < otherBubble.centerY) {
        this.newPosition(6, otherBubble)
      } else if (deltaY >= 12.5 && this.centerY > otherBubble.centerY) {
        this.newPosition(4, otherBubble)
      } else {
        this.newPosition(5, otherBubble)
      }
    }
  }

  Bubble.prototype.withinFifty = function (otherBubble) {
    var dangerZone = 50
    var distance = Math.floor(this.distanceFrom(otherBubble))
    if (distance <= dangerZone) {
      return true
    } else {
      return false
    }
  }

  Bubble.prototype.distanceFrom = function (otherBubble) {
    var distance = Math.sqrt( Math.pow((this.centerX - otherBubble.centerX), 2) +
                              Math.pow((this.centerY - otherBubble.centerY), 2));

    return distance
  }





  Bubble.prototype.render = function (ctx) {
    // var image = document.getElementById(this.color)
    // ctx.drawImage(
    //   image,
    //   this.centerX - 30,
    //   this.centerY - 30,
    //   50,
    //   50
    // );
  ctx.fillStyle = this.color;
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
