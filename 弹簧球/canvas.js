let myCanvas = document.getElementById("myCanvas");
let ctx = myCanvas.getContext("2d");
let winW = window.innerWidth;
let winH = window.innerHeight;
myCanvas.width = winW;
myCanvas.height = winH;

let codeFlag = false,
  SpaceStartTime = 0,
  SpaceEndTime = 0,
  TimeDif = 0,
  ballr = 15,
  rectw = 30,
  recth = 60,
  gameStart = false;
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * 向量加法
   * @param {Vector} v
   */
  add(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  /**
   * 向量减法
   * @param {Vector} v
   */
  substract(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  /**
   * 向量与标量乘法
   * @param {Vector} s
   */
  multiply(s) {
    return new Vector(this.x * s, this.y * s);
  }

  /**
   * 向量与向量点乘（投影）
   * @param {Vector} v
   */
  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * 向量标准化（除去长度）
   * @param {number} distance
   */
  normalize() {
    let distance = Math.sqrt(this.x * this.x + this.y * this.y);
    return new Vector(this.x / distance, this.y / distance);
  }
}

class Ball {
  constructor(x, y, r, color, vx, vy, mass = 1) {
    this.x = x;
    this.ox = this.x;
    this.y = y;
    this.oy = this.y;
    this.r = r;
    this.color = color;
    this.vx = vx;
    this.vy = vy;
    this.mass = mass;
    this.angle = 0;
    this.over = false;
    this.gravity = 0.09;
    this.colliding = false;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.colliding ? "#A9D9D0" : this.color;
    // ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
  }

  updata() {
    if (!gameStart) {
      this.y = this.oy + (30 / 1000) * TimeDif;
      this.x = this.ox;
    } else {
      if (this.over) {
        if (this.x - this.r < 0 || this.x + this.r > myCanvas.width - 80) {
          this.vx = -this.vx;
        }

        if (this.y + this.r > myCanvas.height) {
          gameStart = false;
          this.vx = 0;
          this.vy = 0;
          this.over = false;
        } else if (this.y - this.r < 0) {
          this.vy = -this.vy;
        }
      } else {
        if (this.x + this.r < myCanvas.width - 80) {
          this.over = true;
        }
        //到顶部
        if (this.totopRect()) {
          this.vx = -Math.round(Math.random() * 10 + 10);
          this.vy = Math.round(Math.random() * 10 + 5);
          // this.vx = -20;
          // this.vy = 5;
        }
      }
      //检测碰撞
      this.colliding = false;
      for (let i = 0; i < obstacleBallList.length; i++) {
        this.checkCollideWith(obstacleBallList[i]);
      }

      this.y += this.vy += this.gravity;
      this.x += this.vx;
    }
    this.draw();
  }

  isCircleCollided(other) {
    let squareDistance =
      (this.x - other.x) * (this.x - other.x) +
      (this.y - other.y) * (this.y - other.y);
    let squareRadius = (this.r + other.r) * (this.r + other.r);
    return squareDistance <= squareRadius;
  }

  totopRect() {
    if (this.y - this.r < topRect.y + 20) {
      return true;
    }
    return false;
  }

  isCircleCollided(other) {
    let squareDistance =
      (this.x - other.x) * (this.x - other.x) +
      (this.y - other.y) * (this.y - other.y);
    let squareRadius = (this.r + other.r) * (this.r + other.r);
    return squareDistance <= squareRadius;
  }

  checkCollideWith(other) {
    if (this.isCircleCollided(other)) {
      this.colliding = true;
      // other.colliding = true;
      this.changeVelocityAndDirection(other);
    }
  }

  changeVelocityAndDirection(other) {
    // 创建两小球的速度向量
    let velocity1 = new Vector(this.vx, this.vy);
    let velocity2 = new Vector(other.vx, other.vy);
    let vNorm = new Vector(this.x - other.x, this.y - other.y);
    let unitVNorm = vNorm.normalize();
    let unitVTan = new Vector(-unitVNorm.y, unitVNorm.x);
    let v1n = velocity1.dot(unitVNorm);
    let v1t = velocity1.dot(unitVTan);
    let v2n = velocity2.dot(unitVNorm);
    let v1nAfter =
      (v1n * (this.mass - other.mass) + 2 * other.mass * v2n) /
      (this.mass + other.mass);
    let v2nAfter =
      (v2n * (other.mass - this.mass) + 2 * this.mass * v1n) /
      (this.mass + other.mass);
    if (v1nAfter < v2nAfter) {
      return;
    }
    let v1VectorNorm = unitVNorm.multiply(v1nAfter);
    let v1VectorTan = unitVTan.multiply(v1t);
    let velocity1After = v1VectorNorm.add(v1VectorTan);
    this.vx = velocity1After.x;
    this.vy = velocity1After.y;
  }
}

class obstacleBall {
  constructor(x, y, r, color, mass = 1) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color;
    this.mass = mass;
    this.vx = 0;
    this.vy = 0;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
  }
}

class Rect {
  constructor(x, y, w, h, color) {
    this.x = x;
    this.y = y;
    this.oy = this.y;
    this.w = w;
    this.h = h;
    this.oh = this.h;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.fill();
  }

  updata() {
    this.y = this.oy + (30 / 1000) * TimeDif;
    this.h = this.oh - (30 / 1000) * TimeDif;
    this.draw();
  }
}
let newBall = new Ball(
  myCanvas.width - ballr * 2,
  myCanvas.height - ballr - recth,
  ballr,
  "#aa0000",
  0,
  0,
  10
);
let newRect = new Rect(
  myCanvas.width - rectw - rectw / 2,
  myCanvas.height - recth,
  rectw,
  recth,
  "#0B2B40"
);

let topRect = new Rect(
  myCanvas.width - 40,
  myCanvas.height - 600,
  20,
  20,
  "#164773"
);
document.addEventListener("keydown", (e) => {
  if (e.code == "Space") {
    if (!codeFlag) {
      // console.log("按下了");
      codeFlag = true;
      SpaceStartTime = new Date().getTime();
    } else {
      SpaceEndTime = new Date().getTime();
      if (SpaceEndTime - SpaceStartTime < 1000) {
        TimeDif = SpaceEndTime - SpaceStartTime;
      } else {
        TimeDif = 1000;
      }
    }
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code == "Space" && codeFlag) {
    // console.log("送开了");
    codeFlag = false;
    newBall.vy = -10;
    TimeDif = 0;
    gameStart = true;
  }
});

function line() {
  ctx.beginPath();
  ctx.strokeStyle = "#0B2B40";
  ctx.moveTo(myCanvas.width - 80, myCanvas.height - 400);
  ctx.lineTo(myCanvas.width - 80, myCanvas.height);
  ctx.stroke();
}
let obstacleBallList = [
  new obstacleBall(100, 500, 30, "#164773", 40),
  new obstacleBall(200, 400, 30, "#164773", 40),
  new obstacleBall(100, 300, 30, "#164773", 40),
];

function animal() {
  ctx.clearRect(0, 0, winW, winH);
  line();
  newRect.updata();
  newBall.updata();
  topRect.draw();
  obstacleBallList.forEach((res) => {
    res.draw();
  });
  requestAnimationFrame(animal);
}

animal();
