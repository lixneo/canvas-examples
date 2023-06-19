let myCanvas = document.getElementById("myCanvas")
let ctx = myCanvas.getContext('2d')
ctx.beginPath() //新建笔画
ctx.moveTo(100, 100) //移动到起点
ctx.lineTo(200, 200) //移动到相应位置
ctx.stroke() //描边