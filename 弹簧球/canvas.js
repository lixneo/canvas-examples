let myCanvas = document.getElementById("myCanvas");
let ctx = myCanvas.getContext("2d");
let winW = window.innerWidth;
let winH = window.innerHeight;
myCanvas.width = winW;
myCanvas.height = winH;

class Ball {
  constructor(x, y, r, color, vx, vy) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color;
    this.vx = vx;
    this.vy = vy;
    this.angle = 0;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
  }

  radiusMove() {
    this.x = Math.sin(this.angle) * 100 + winW / 2;
    this.y = Math.cos(this.angle) * 100 + winH / 2;
    this.angle += 0.05;
  }
}

class Rect {
  constructor(x, y, w, h, color) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.fill();
  }
}
let newBall = new Ball(200, 100, 15, "red", 10, 10);
let newRect = new Rect(195, 115, 10, 30, "#303333");

let codeFlag = false;
document.addEventListener("keydown", (e) => {
  if (e.code == "Space"&&!codeFlag) {
    
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code == "Space"&&!codeFlag) {
  }
});

function animal() {
  ctx.clearRect(0, 0, winW, winH);
  newRect.draw();
  newBall.draw();
  requestAnimationFrame(animal);
}

animal();
