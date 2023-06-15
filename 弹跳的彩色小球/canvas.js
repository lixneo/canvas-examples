let myCanvas = document.getElementById("myCanvas");
let ctx = myCanvas.getContext("2d");

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
let moveX = 100;
let moveY = 100;
let myBallColor = ["#025E73", "#011F26", "#A5A692", "#BFB78F", "#F2A71B"];
let mousePosition = {
  x: -50,
  y: -50,
};
myCanvas.onmousemove = (res) => {
  mousePosition.x = res.offsetX;
  mousePosition.y = res.offsetY;
};

myCanvas.onmouseout = (res) => {
  mousePosition.x = -50;
  mousePosition.y = -50;
};

myCanvas.width = windowWidth;
myCanvas.height = windowHeight;

class myBall {
  constructor(x, y, size, color, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.size = size;
    this.ysize = size;
    this.color = color;
    this.draw = function () {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI, true);
      ctx.fill();
    };
    this.updata = function () {
      if (this.x + this.size > myCanvas.width || this.x - this.size < 0) {
        this.dx = -this.dx;
      }
      if (this.y + this.size > myCanvas.height || this.y - this.size < 0) {
        this.dy = -this.dy;
      }
      this.x += this.dx;
      this.y += this.dy;

      if (
        this.x - mousePosition.x > -50 &&
        this.x - mousePosition.x < 50 &&
        this.y - mousePosition.y > -50 &&
        this.y - mousePosition.y < 50
      ) {
        if (this.size < this.ysize + 50) {
          this.size++;
        }
      } else if (this.ysize < this.size) {
        this.size--;
      }

      this.draw();
    };
  }
}

let myBallList = [];
for (let index = 0; index < 100; index++) {
  let size = myRandom(10, 20);
  myBallList.push(
    new myBall(
      myRandom(size, myCanvas.width - size),
      myRandom(size, myCanvas.height - size),
      size,
      myBallColor[myRandom(0, 4)],
      myRandom(-2, 2) || 1,
      myRandom(-2, 2) || 1
    )
  );
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, windowWidth, windowHeight);
  for (let index = 0; index < 100; index++) {
    myBallList[index].updata();
  }
}

function myRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

animate();
