if (typeof PuzzleBobble === "undefined") {
  window.PuzzleBobble = {};
}

const rad = Math.PI / 180;

class Arrow {
  constructor() {
    this.centerX = 210;
    this.centerY = 500;
    this.radius = 6;
    this.angle = 90;
  }

  changePosition() {
    let deltaY = Math.sin(this.angle * rad) * 50;
    let deltaX = Math.sqrt(Math.pow(50, 2) - Math.pow(deltaY, 2));
    
    if (this.angle === 90) {
      this.centerX = 210;
      this.centerY = 500;
    } else if (this.angle > 90) {
      this.centerX = 210 + deltaX;
      this.centerY = 550 - deltaY;
    } else {
      this.centerX = 210 - deltaX;
      this.centerY = 550 - deltaY;
    }
  }

  rightClick() {
    if (this.angle < 160) {
      this.angle += 6;
      this.changePosition();
    }
  }

  leftClick() {
    if (this.angle > 20) {
      this.angle -= 6;
      this.changePosition();
    }
  }

  spaceBar() {}

  render(ctx) {
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
}

PuzzleBobble.Arrow = Arrow;