let myCanvas = document.getElementById("myCanvas");
let ctx = myCanvas.getContext("2d");

let gameStatus = false,
	awardNum = 5;

myCanvas.width = window.innerWidth;
myCanvas.height = 3000;

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
	//初始赋值
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
		this.gravity = 0.8;
		this.colliding = false;
	}
	//绘制小球
	draw() {
		ctx.beginPath();
		//碰撞变色
		// ctx.fillStyle = this.colliding ? "#A9D9D0" : this.color;

		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
		ctx.fill();
	}
	//小球动作更新
	updata() {
		if (gameStatus) {
			//左右回弹
			if (this.x - this.r < 0 || this.x + this.r > myCanvas.width) {
				this.vx = -this.vx;
			}
			this.x += this.vx;

			//到底部停止
			if (this.y + this.r + this.vy + this.gravity > myCanvas.height) {
				gameStatus = false
				console.log("小球的位置：", this.x, this.y);
				console.log("获得", parseInt(this.x / (myCanvas.width / awardNum) + 1), "等奖");
			} else {
				this.y += this.vy;
				this.vy += this.gravity
			}

			//检测球形障碍物
			this.colliding = false;
			for (let i = 0; i < obstacleBallList.length; i++) {
				this.checkCollideWith(obstacleBallList[i]);
			}

			//检测直线障碍物
			for (let i = 0; i < obstacleLineList.length; i++) {
				this.checkCollideWithLine(obstacleLineList[i]);
			}


			//重力+速度
			this.vy += this.gravity;
		}

		this.draw();
	}

	checkCollideWithLine(other) {
		var bounds = other.getBounds();
		if (this.x + this.r > bounds.x && this.x - this.r < bounds.x + bounds.width) {
			var cos = Math.cos(other.rotation),
				sin = Math.sin(other.rotation);
			var x1 = this.x - other.x,
				y1 = this.y - other.y;
			var y2 = y1 * cos - x1 * sin;
			var vy1 = this.vy * cos - this.vx * sin;
			if (y2 > -this.r && y2 < vy1) {
				var x2 = x1 * cos + y1 * sin;
				var vx1 = this.vx * cos + this.vy * sin;
				y2 = -this.r;
				vy1 *= -0.7
				//旋转回去
				x1 = x2 * cos - y2 * sin;
				y1 = y2 * cos + x2 * sin;
				this.vx = vx1 * cos - vy1 * sin;
				this.vy = vy1 * cos + vx1 * sin;
				this.x = other.x + x1;
				this.y = other.y + y1;
			}
		}
	}

	isLineCollided(other) {
		let squareDistance =
			(this.x - other.x) * (this.x - other.x) +
			(this.y - other.y) * (this.y - other.y);
		let squareRadius = (this.r + other.r) * (this.r + other.r);
		return squareDistance <= squareRadius;
	}

	//碰撞处理
	checkCollideWith(other) {
		//判断是否碰到
		if (this.isCircleCollided(other)) {
			this.colliding = true;
			//处理碰到后的状态
			this.changeVelocityAndDirection(other);
		}
	}

	isCircleCollided(other) {
		let squareDistance =
			(this.x - other.x) * (this.x - other.x) +
			(this.y - other.y) * (this.y - other.y);
		let squareRadius = (this.r + other.r) * (this.r + other.r);
		return squareDistance <= squareRadius;
	}

	changeVelocityAndDirection(other) {
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

	reboot() {
		this.x = this.ox
		this.y = this.oy
		this.vx = MathRandom(5, 15)
		this.vy = MathRandom(5, 15)
	}
}



class obstacleLine {
	constructor(x1, y1, x2, y2) {
		this.x = 0;
		this.y = 0;
		this.x1 = (x1 === undefined) ? 0 : x1;
		this.y1 = (y1 === undefined) ? 0 : y1;
		this.x2 = (x2 === undefined) ? 0 : x2;
		this.y2 = (y2 === undefined) ? 0 : y2;
		this.rotation = 0;
		this.scaleX = 1;
		this.scaleY = 1;
		this.lineWidth = 1;
	}

	draw() {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		ctx.scale(this.scaleX, this.scaleY);
		ctx.lineWidth = this.lineWidth;
		ctx.beginPath();
		ctx.moveTo(this.x1, this.y1);
		ctx.lineTo(this.x2, this.y2);
		ctx.closePath();
		ctx.stroke();
		ctx.restore();
	}

	getBounds() {
		if (this.rotation === 0) {
			var minX = Math.min(this.x1, this.x2),
				minY = Math.min(this.y1, this.y2),
				maxX = Math.max(this.x1, this.x2),
				maxY = Math.max(this.y1, this.y2);

			return {
				x: this.x + minX,
				y: this.y + minY,
				width: maxX - minX,
				height: maxY - minY
			};
		} else {
			var sin = Math.sin(this.rotation),
				cos = Math.cos(this.rotation),
				x1r = cos * this.x1 + sin * this.y1,
				x2r = cos * this.x2 + sin * this.y2,
				y1r = cos * this.y1 + sin * this.x1,
				y2r = cos * this.y2 + sin * this.x2;

			return {
				x: this.x + Math.min(x1r, x2r),
				y: this.y + Math.min(y1r, y2r),
				width: Math.max(x1r, x2r) - Math.min(x1r, x2r),
				height: Math.max(y1r, y2r) - Math.min(y1r, y2r)
			};
		}
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

let obstacleBallList = [
		new obstacleBall(100, 2000, 30, "#000000", 40),
		new obstacleBall(450, 2000, 30, "#000000", 40),
		new obstacleBall(800, 2000, 30, "#000000", 40),

		new obstacleBall(300, 2300, 30, "#000000", 40),
		new obstacleBall(600, 2300, 30, "#000000", 40),

		new obstacleBall(100, 2600, 30, "#000000", 40),
		new obstacleBall(450, 2600, 30, "#000000", 40),
		new obstacleBall(800, 2600, 30, "#000000", 40),
	],
	obstacleLineList = [new obstacleLine(-100, 0, 50, 0), new obstacleLine(-100, 0, 50, 0), new obstacleLine(-100, 0, 50,
		0)];
(function() {
	obstacleLineList[0].x = 200;
	obstacleLineList[0].y = 300;
	obstacleLineList[0].rotation = 30 * Math.PI / 180;

	obstacleLineList[1].x = 400;
	obstacleLineList[1].y = 400;
	obstacleLineList[1].rotation = 45 * Math.PI / 180;

	obstacleLineList[2].x = 600;
	obstacleLineList[2].y = 600;
	obstacleLineList[2].rotation = -20 * Math.PI / 180;
})()
let myball = new Ball(100, 100, 50, '#D8B08C', 10, 10, 10)

function MathRandom(start, end) {
	return Math.round(Math.random() * (end - start) + start)
}

myCanvas.addEventListener("click", () => {
	myball.reboot()
	gameStatus = true
})

function drawAward() {
	let rectHeight = 60
	ctx.beginPath();
	ctx.fillStyle = 'red';
	ctx.font = '40px border';
	ctx.fillRect(myCanvas.width / awardNum * 0, myCanvas.height - rectHeight, 10, rectHeight)
	ctx.fillText("一等奖", myCanvas.width / awardNum * 0 + 20, myCanvas.height - 20);
	ctx.fillRect(myCanvas.width / awardNum * 1, myCanvas.height - rectHeight, 10, rectHeight)
	ctx.fillText("二等奖", myCanvas.width / awardNum * 1 + 20, myCanvas.height - 20);
	ctx.fillRect(myCanvas.width / awardNum * 2, myCanvas.height - rectHeight, 10, rectHeight)
	ctx.fillText("三等奖", myCanvas.width / awardNum * 2 + 20, myCanvas.height - 20);
	ctx.fillRect(myCanvas.width / awardNum * 3, myCanvas.height - rectHeight, 10, rectHeight)
	ctx.fillText("四等奖", myCanvas.width / awardNum * 3 + 20, myCanvas.height - 20);
	ctx.fillRect(myCanvas.width / awardNum * 4, myCanvas.height - rectHeight, 10, rectHeight)
	ctx.fillText("五等奖", myCanvas.width / awardNum * 4 + 20, myCanvas.height - 20);
	ctx.closePath();
}

function animal() {
	ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
	myball.updata()
	obstacleBallList.forEach((res) => {
		res.draw();
	});
	obstacleLineList.forEach((res) => {
		res.draw();
	});
	drawAward()
	requestAnimationFrame(animal);
}

animal()