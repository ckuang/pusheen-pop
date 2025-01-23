(function () {
  if (typeof PuzzleBobble === "undefined") {
    window.PuzzleBobble = {};
  }

  const COLORS = ["#f7d7bd", "#ffbabd", "#fffbf7", "#94867b"]
  const RAD = (Math.PI / 180)

  class Bubble {
    constructor(posX, posY, bool, id) {
      this.uniqueId = id
      this.centerX = posX;
      this.centerY = posY;
      this.radius = 25;
      this.color = COLORS[Math.floor(Math.random() * 4)];
      this.moving = bool
      this.motionAngle = 90
    }

    move(angle) {
      const vecY = (25 * Math.sin(angle * RAD))
      const vecX = Math.sqrt(Math.pow(25, 2) - Math.pow(vecY, 2))
      if (angle >= 90) {
        this.centerX += vecX
        this.centerY -= vecY
      } else if (angle < 90) {
        this.centerX -= vecX
        this.centerY -= vecY
      }
    }

    getNeighbors(otherBubbles) {
      return otherBubbles.filter(bubble => bubble.withinFifty(this));
    }

    isNeighborSameColor(neighbors) {
      return neighbors.some(neighbor => neighbor.color === this.color);
    }

    newPosition(position, otherBubble) {
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

    setPosition(otherBubble, distance) {
      const deltaX = otherBubble.centerX - this.centerX
      const deltaY = (25 * Math.abs(otherBubble.centerY - this.centerY)) / distance
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

    withinFifty(otherBubble) {
      const dangerZone = 50
      const distance = Math.floor(this.distanceFrom(otherBubble))
      return distance <= dangerZone
    }

    distanceFrom(otherBubble) {
      return Math.sqrt( Math.pow((this.centerX - otherBubble.centerX), 2) +
                                Math.pow((this.centerY - otherBubble.centerY), 2));
    }

    render(ctx) {
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
  }

  PuzzleBobble.Bubble = Bubble;
})();
