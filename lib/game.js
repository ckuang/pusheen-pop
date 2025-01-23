(function () {
  if (typeof PuzzleBobble === "undefined") {
    window.PuzzleBobble = {};
  }

  const TOPEVEN = [35, 85, 135, 185, 235, 285, 335, 385];
  const TOPODD = [60, 110, 160, 210, 260, 310, 360];

  class Game {
    constructor(xDim, yDim) {
      this.xDim = xDim;
      this.yDim = yDim;
      this.bubbles = {};
      this.fallingBubbles = [];
      this.arrow = new PuzzleBobble.Arrow();
      this.uniqueId = 1;
      this.gravityCounter = 1;
      this.gameOver = false;

      for (let x = 0; x < 8; x++) {
        this.bubbles[this.uniqueId] = new PuzzleBobble.Bubble(35 + (x * 50), 25, false, this.uniqueId);
        this.uniqueId += 1;
      }

      for (let y = 0; y < 7; y++) {
        this.bubbles[this.uniqueId] = new PuzzleBobble.Bubble(60 + (y * 50), 25 + (25 * Math.sqrt(3)), false, this.uniqueId);
        this.uniqueId += 1;
      }

      this.baseball = new PuzzleBobble.Bubble(210, 550, false, this.uniqueId);
      this.uniqueId += 1;
    }

    sameColorBubbles() {
      const sameColorBubbles = [];
      for (const id in this.bubbles) {
        if (this.bubbles[id].color === this.baseball.color) {
          sameColorBubbles.push(this.bubbles[id]);
        }
      }
      return sameColorBubbles;
    }

    deleteProtocol() {
      const sameColorBubbles = this.sameColorBubbles();
      const queue = [];
      const toBeDeleted = [];
      queue.push(sameColorBubbles.pop());
      toBeDeleted.push(queue[0]);
      
      while (queue.length !== 0) {
        const targetBall = queue.shift();
        const targetBallNeighbors = targetBall.getNeighbors(sameColorBubbles);
        if (targetBallNeighbors.length > 0) {
          targetBallNeighbors.forEach(bubble => {
            toBeDeleted.push(bubble);
            const idx = sameColorBubbles.indexOf(bubble);
            sameColorBubbles.splice(idx, 1);
          });
        }
        queue.push(...targetBallNeighbors);
      }

      if (toBeDeleted.length >= 3) {
        toBeDeleted.forEach(bubble => {
          delete this.bubbles[bubble.uniqueId];
        });
      }
    }

    dropNonTethered() {
      var remain = [], queue = []
      for (var key in this.bubbles) {
        if (this.bubbles[key].centerY === 25) {
          queue.push(this.bubbles[key])
        } else {
          remain.push(this.bubbles[key])
        }
      }

      while (queue.length !== 0) {
        var target = queue.shift()
        var targetNeighbors = target.getNeighbors(remain)
        if (targetNeighbors.length > 0) {
          targetNeighbors.forEach(function(bubble) {
            var index = remain.indexOf(bubble)
            remain.splice(index, 1)
          })
        }
        queue = queue.concat(targetNeighbors)
      }

      if (remain.length > 0) {
        var that = this
        remain.forEach(function (bubble) {
          that.fallingBubbles.push(bubble)
          delete that.bubbles[bubble.uniqueId]
        })
      }
    }

    moveFallingBubbles() {
      for (var i = 0; i < this.fallingBubbles.length; i++) {
        this.fallingBubbles[i].centerY += (1 * this.gravityCounter)
        if (this.fallingBubbles[i].centerY > 600) {
          this.fallingBubbles.splice(i, 1)
        }
      }
      this.gravityCounter += 1
    }

    render(ctx) {
      ctx.clearRect(0, 0, this.xDim, this.yDim);

      ctx.fillStyle = "#423C40";
      ctx.fillRect(0,0,420,600);

      ctx.fillStyle = "#cec3b5"
      ctx.fillRect(0, 550, 420, 6);

      for (var id in this.bubbles) {
        if(this.bubbles[id].hasOwnProperty("centerX")) {
          this.bubbles[id].render(ctx);
        }
      }

      this.fallingBubbles.forEach(function(bubble) {
        bubble.render(ctx)
      })

      this.baseball.render(ctx);
      this.arrow.render(ctx);
    }

    handleLeftRight(e) {
      e.preventDefault()
      var keyCode = e.keyCode;
      switch (keyCode) {
        case 37:
          this.arrow.leftClick();
          break;
        case 39:
          this.arrow.rightClick();
          break;
      }
    }

    handleSpace(e) {
      e.preventDefault()
      if (e.keyCode === 32) {
        if (!this.baseball.moving) {
          this.baseball.motionAngle = this.arrow.angle
          this.baseball.moving = true
        }
      }
    }

    checkForContact(bubble, otherBubbles) {
      for (var id in otherBubbles) {
        var otherBubble = otherBubbles[id];
        if (bubble.withinFifty(otherBubble)) {
          bubble.moving = false
          bubble.setPosition(otherBubble, bubble.distanceFrom(otherBubble))
          var neighbors = bubble.getNeighbors(this.bubblesToArray())

          if (bubble.centerX > 385) {
            bubble.centerX = 360
          } else if (bubble.centerX < 35) {
            bubble.centerX = 60
          }

          if (neighbors.length === 2) {
              for (var i = 0; i < neighbors.length; i++) {
                if (  bubble.centerX === neighbors[i].centerX &&
                      bubble.centerY === neighbors[i].centerY) {
                  if (bubble.centerX === 360) {
                    bubble.newPosition(3, neighbors[i])
                  } else {
                    bubble.newPosition(4, neighbors[i])
                  }
                }
              }
          }
        }
      }
    }

    bubblesToArray() {
        var allBubbles = []
        for (var id in this.bubbles) {
          allBubbles.push(this.bubbles[id])
        }
        return allBubbles
    }

    resetBaseBall() {
      if (this.baseball.moving === false && this.baseball.centerY !== 550) {
        var neighbors = this.baseball.getNeighbors(this.bubblesToArray())
        this.bubbles[this.baseball.uniqueId] = (this.baseball)
        if (this.baseball.isNeighborSameColor(neighbors)) {
          this.deleteProtocol()
        }
        this.baseball = new PuzzleBobble.Bubble(210, 550, false, this.uniqueId);
        this.uniqueId += 1
      }
    }

    moveBaseBall() {
      if (this.baseball.moving && this.baseball.centerX > 25 && this.baseball.centerX < 395) {
        this.baseball.move(this.baseball.motionAngle);
      } else if (this.baseball.moving && this.baseball.centerX <= 25) {
        this.baseball.motionAngle = 180 - this.baseball.motionAngle
        this.baseball.move(this.baseball.motionAngle)
      } else if (this.baseball.moving && this.baseball.centerX >= 395) {
        this.baseball.motionAngle = 180 - this.baseball.motionAngle
        this.baseball.move(this.baseball.motionAngle)
      }
    }

    dropBubbles() {
      this.dropNonTethered()
      if (this.fallingBubbles.length > 0) {
        this.moveFallingBubbles()
        if (this.fallingBubbles.length === 0) {
          this.gravityCounter = 1
        }
      }
    }

    setTopRow() {
      if (this.baseball.centerY <= 25) {
        this.baseball.centerY = 25
        var baseballcenterX = this.baseball.centerX
        this.baseball.centerX = TOPEVEN.filter(function(posX) {return Math.abs(posX - baseballcenterX) <= 25})[0]
        this.baseball.moving = false
      }
    }

    isBubbleOver() {
      var endGameCheck = this.bubblesToArray()
      for (var c = 0; c < endGameCheck.length; c++) {
        if (endGameCheck[c].centerY > 525) {
          return true
        }
      }

      return false
    }

    handleEndGame() {
      if (document.getElementById("modal").classList.length > 1) {
        document.getElementById("modal").classList.remove("active")
      }
      if (document.getElementById("lose-modal").classList.length > 1) {
        document.getElementById("lose-modal").classList.remove("active")
      }
      if (this.bubblesToArray().length === 0 && this.fallingBubbles.length === 0) {
        document.getElementById("modal").classList.add("active")
      } else if (this.isBubbleOver()) {
        this.gameOver = true
        document.getElementById("lose-modal").classList.add("active")
      }
    }

    start(canvasEl) {
      const ctx = canvasEl.getContext("2d");
      document.addEventListener("keydown", this.handleLeftRight.bind(this));
      document.addEventListener("keydown", this.handleSpace.bind(this));

      document.getElementById("lose-play-again").addEventListener("click", () => {
        const canvasEl = document.getElementById("canvas");
        canvasEl.height = 600;
        canvasEl.width = 420;
        new PuzzleBobble.Game(
          canvasEl.width,
          canvasEl.height
        ).start(canvasEl);
      });

      document.getElementById("win-play-again").addEventListener("click", () => {
        const canvasEl = document.getElementById("canvas");
        canvasEl.height = 600;
        canvasEl.width = 420;
        new PuzzleBobble.Game(
          canvasEl.width,
          canvasEl.height
        ).start(canvasEl);
      });

      const animateCallback = () => {
        if (!this.gameOver) {
          this.setTopRow()
          this.moveBaseBall()
          this.checkForContact(this.baseball, this.bubbles)
          this.resetBaseBall()
          this.dropBubbles()
        }

        this.handleEndGame()

        this.render(ctx)

        requestAnimationFrame(animateCallback)
      }

      animateCallback();
    }
  }

  PuzzleBobble.Game = Game;
})();

