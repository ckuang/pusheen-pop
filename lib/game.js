(function () {
  if (typeof PuzzleBobble === "undefined") {
    window.PuzzleBobble = {};
  }

  var TOPEVEN = [40, 100, 160, 220, 280, 340, 400, 460]
  var TOPODD = [70, 130, 190, 250, 310, 370, 430]

  var Game = PuzzleBobble.Game = function (xDim, yDim) {
    this.xDim = xDim;
    this.yDim = yDim;
    this.bubbles = {};
    this.fallingBubbles = []
    this.arrow = new PuzzleBobble.Arrow ();
    this.uniqueId = 1;
    this.gravityCounter = 1
    this.gameOver = false

    for (var x = 0; x < 8; x++) {
      this.bubbles[this.uniqueId] = (new PuzzleBobble.Bubble(40 + (x * 60), 30, false, this.uniqueId))
      this.uniqueId += 1
    }

    for (var y = 0; y < 7; y++) {
      this.bubbles[this.uniqueId] = (new PuzzleBobble.Bubble(70 + (y * 60), 30 + (30 * Math.sqrt(3)), false, this.uniqueId))
      this.uniqueId += 1
    }

    this.baseball = new PuzzleBobble.Bubble(250, 660, false, this.uniqueId)
    this.uniqueId += 1
  };



  Game.prototype.sameColorBubbles = function () {
    var sameColorBubbles = []
    var that = this
    for (var id in this.bubbles) {
      if (that.bubbles[id].color === that.baseball.color) {
        sameColorBubbles.push(that.bubbles[id])
      }
    }

    return sameColorBubbles
  }

  Game.prototype.deleteProtocol = function () {

    var sameColorBubbles = this.sameColorBubbles()
    var toBeDeleted = sameColorBubbles.splice(sameColorBubbles.length - 1, 1)
    var isNotDone = true

    while (isNotDone) {
      this.deleteHelper([sameColorBubbles, toBeDeleted])
      var counter = 0
      for(var x = 0; x < sameColorBubbles.length; x++) {
        for(var y = 0; y < toBeDeleted.length; y++) {
          if (toBeDeleted[y].withinSixty(sameColorBubbles[x])) {
            counter += 1
          }
        }
      }
      if (counter === 0) {
        isNotDone = false
      }
    }

    if (toBeDeleted.length >= 3) {
      for (var z = 0; z < toBeDeleted.length; z++) {
        delete this.bubbles[toBeDeleted[z].uniqueId]
      }
    }

  }

  Game.prototype.deleteHelper = function (array) {
    var sameColorBubbles = array[0]
    var toBeDeleted = array[1]
    toBeDeleted.forEach(function(bubble) {
      for (var i = 0; i < sameColorBubbles.length; i++) {
        if (bubble.distanceFrom(sameColorBubbles[i]) === 60) {
          toBeDeleted.push(sameColorBubbles[i])
          sameColorBubbles.splice(i, 1)
        }
      }
    })

    return [sameColorBubbles, toBeDeleted]
  }

  Game.prototype.dropNonTethered = function () {
    var remain = [], queue = []
    for (var key in this.bubbles) {
      if (this.bubbles[key].centerY === 30) {
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

  Game.prototype.moveFallingBubbles = function () {
    for (var i = 0; i < this.fallingBubbles.length; i++) {
      this.fallingBubbles[i].centerY += (1 * this.gravityCounter)
      if (this.fallingBubbles[i].centerY > 740) {
        this.fallingBubbles.splice(i, 1)
      }
    }
    this.gravityCounter += 1

  }

  Game.prototype.render = function (ctx) {
    if (this.bubblesToArray().length === 0 && this.fallingBubbles.length === 0) {
      window.alert("YOU WIN!!!")
    }

    ctx.clearRect(0, 0, this.xDim, this.yDim);

    ctx.fillStyle = "#423C40";
    ctx.fillRect(0,0,500,740);

    ctx.fillStyle = "#cec3b5"
    ctx.fillRect(0, 660, 500, 8);

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
  };

  Game.prototype.handleLeftRight = function (e) {
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
  };

  Game.prototype.handleSpace = function (e) {
    e.preventDefault()
    if (e.keyCode === 32) {
      if (!this.baseball.moving) {
        this.baseball.motionAngle = this.arrow.angle
        this.baseball.moving = true
      }
    }
  }

  Game.prototype.checkForContact = function (bubble, otherBubbles) {
    for (var id in otherBubbles) {
      var otherBubble = otherBubbles[id];
      if (bubble.withinSixty(otherBubble)) {
        bubble.moving = false
        bubble.setPosition(otherBubble, bubble.distanceFrom(otherBubble))
        var neighbors = bubble.getNeighbors(this.bubblesToArray())

        //handles edge cases
        if (bubble.centerX > 460) {
          bubble.centerX = 430
        } else if (bubble.centerX < 40) {
          bubble.centerX = 70
        }

        if (neighbors.length === 2) {
            for (var i = 0; i < neighbors.length; i++) {
              if (  bubble.centerX === neighbors[i].centerX &&
                    bubble.centerY === neighbors[i].centerY) {
                if (bubble.centerX === 430) {
                  bubble.newPosition(3, neighbors[i])
                } else {
                  bubble.newPosition(4, neighbors[i])
                }
              }
            }
        }


      }


    }

    if (bubble.centerY > 660) {
      this.gameOver = true
      window.alert("GAME OVER!!!")
      this.bubbles = {}
    }
  }

  Game.prototype.bubblesToArray = function () {
      var allBubbles = []
      for (var id in this.bubbles) {
        allBubbles.push(this.bubbles[id])
      }
      return allBubbles
  }

  Game.prototype.resetBaseBall = function () {
    if (this.baseball.moving === false && this.baseball.centerY !== 660) {
      var neighbors = this.baseball.getNeighbors(this.bubblesToArray())
      this.bubbles[this.baseball.uniqueId] = (this.baseball)
      if (this.baseball.isNeighborSameColor(neighbors)) {
        this.deleteProtocol()
      }
      this.baseball = new PuzzleBobble.Bubble(250, 660, false, this.uniqueId);
      this.uniqueId += 1
    }
  }

  Game.prototype.moveBaseBall = function () {
    if (this.baseball.moving && this.baseball.centerX > 30 && this.baseball.centerX < 470) {
      this.baseball.move(this.baseball.motionAngle);
    } else if (this.baseball.moving && this.baseball.centerX <= 30) {
      this.baseball.motionAngle = 180 - this.baseball.motionAngle
      this.baseball.move(this.baseball.motionAngle)
    } else if (this.baseball.moving && this.baseball.centerX >= 470) {
      this.baseball.motionAngle = 180 - this.baseball.motionAngle
      this.baseball.move(this.baseball.motionAngle)
    }
  }

  Game.prototype.start = function (canvasEl) {
    // get a 2d canvas drawing context. The canvas API lets us call
    // a `getContext` method on a canvas DOM element.
    var ctx = canvasEl.getContext("2d");

    document.addEventListener("keydown", this.handleLeftRight.bind(this), false)
    document.addEventListener("keydown", this.handleSpace.bind(this), false)
    //this function will update the position of all the circles,
    //clear the canvas, and redraw them

    var animateCallback = function() {
      this.dropNonTethered()
      if (this.fallingBubbles.length > 0) {
        this.moveFallingBubbles()
        if (this.fallingBubbles.length === 0) {
          if (this.bubblesToArray().length === 0) {
            window.alert("YOU WIN!!!")
          }
          this.gravityCounter = 1
        }
      }

      if (this.baseball.centerY <= 30) {
        this.baseball.centerY = 30
        var baseballcenterX = this.baseball.centerX
        this.baseball.centerX = TOPEVEN.filter(function(posX) {return Math.abs(posX - baseballcenterX) <= 30})[0]
        this.baseball.moving = false
      }
      if (!this.gameOver) {
        this.resetBaseBall()
      }

      this.moveBaseBall()
      this.checkForContact(this.baseball, this.bubbles)


      this.render(ctx);
      //this will call our animateCallback again, but only when the browser
      //is ready, usually every 1/60th of a second

      requestAnimationFrame(animateCallback);

      //if we didn't know about requestAnimationFrame, we could use setTimeout
      //setTimeout(animateCallback, 1000/60);
    }.bind(this);

    //this will cause the first render and start the endless triggering of
    //the function using requestAnimationFrame
    animateCallback();
  };
})();
