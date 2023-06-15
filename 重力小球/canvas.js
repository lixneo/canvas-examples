let myCanvas = document.getElementById("myCanvas");
let ctx = myCanvas.getContext("2d");

myCanvas.width = window.innerWidth;
myCanvas.height = window.innerHeight;

window.addEventListener("resize", function (res) {
  myCanvas.width = window.innerWidth;
  myCanvas.height = window.innerHeight;
});

window.addEventListener("mousedown", function (res) {
  init();
});

class myball {
  constructor(x, y, size, color, dx, dy) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.dx = dx;
    this.dy = dy;
    this.gravity = 0.8;
    this.friction = 0.8;
    this.draw = function () {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI, true);
      ctx.fill();
    };
    this.updata = function () {
      if (this.y + this.size + this.dy + this.gravity > myCanvas.height) {
        this.dy = -this.dy;
        this.dy *= this.friction;
      } else {
        this.dy += this.gravity;
      }
      this.y += this.dy;
      this.draw();
    };
  }
}

let newBall;
function init() {
  newBall = null;
  newBall = new myball(300, 300, 50, "red", 10, 5);
}

//动画函数
function animal() {
  requestAnimationFrame(animal);
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  newBall.updata();
}

init() 
animal();
