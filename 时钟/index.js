let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")

if (ctx) {
	init()
} else {
	console.log("浏览器不支持");
}

function init() {
	ctx.beginPath()
	ctx.moveTo(100, 100)
	ctx.lineTo(200, 200)
	ctx.stroke()
}