<https://www.bilibili.com/video/BV1kv4y1D7uS/?spm_id_from=333.999.0.0&vd_source=3f2b06924792cf6a0fbfe2a57187754e>

<https://www.bilibili.com/video/BV1os4y1H7FB/?spm_id_from=333.337.search-card.all.click&vd_source=3f2b06924792cf6a0fbfe2a57187754e>

canvas 2d or 3d (webGL or webGPU)

#### 大小设置的两种方法：（注意：最好不要同时设置）

1.  style 设置 width height
2.  canvas 本身的 width height 属性

#### 不支持时

```html
<canvas>
	<div>换个浏览器，求求了</div>
</canvas>
```

#### 创建画笔

```javascript
var canvas = document.getEelementById("canvas")
var ctx = canvas.getContext("2d")

//判断浏览器的支持性
if(canvas.getContext){
	//正常逻辑
}else{
	//不支持的兼容处理
}
```

#### 如何下笔

```javascript
ctx.beginPath() //新建笔画
ctx.moveTo(100,100) //移动到起点
ctx.lineTo(200,200) //移动到相应位置
ctx.closePath() //起点终点闭合
ctx.rect(0,0,100,200) //快速绘制矩形
ctx.stroke() //描边
ctx.strokeRect(0,0,100,200) //快速绘制矩形并描边
ctx.fill() //填充
ctx.fillRect(0,0,100,200) //快速绘制矩形并填充
ctx.clearRect(50,50,10,100) //擦除，相当于橡皮擦
```

#### 绘制圆形

```javascript
// 弧度制 = pi / 180 * 角度
ctx.arc(x, y, r, startAngle, endAngle, anticlockwise)

//一次贝塞尔曲线
ctx.quadraticCurveTo(cp1x, cp1y, x, y)
//cp1x,cp1y：控制点坐标
//x,y：曲线结束点坐标

//二次贝塞尔曲线
ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
//cp1x,cp1y,cp2x,cp2y：控制点坐标
//x,y：曲线结束点坐标
```

#### 文本和图片

```javascript
ctx.fillText(text, x, y , [maxWidth])
ctx.strokeText(text, x, y , [maxWidth])

ctx.font = "bold 48px serif";
ctx.textAlign = "left" || "right" || "center" || "start" || "end";
ctx.textBaseline = "top" || "hanging" || "middle" || "alphabetic" || "ideographic" || "bottom";
ctx.direction = "ltr" || "rtl" || "inherit";

//添加图片
var img = new Image()
img.src = 'myImage.png'
ctx.drawImage(img, x, y, [width, height])
//图片过大问题
var img = new Image()
img.onload = function(){
	ctx.drawImage(img, 0, 0)
}
img.src = 'myImage.png'
//展示图片的一部分
drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
```

#### 样式

```javascript
ctx.fillStyle = "blue";
ctx.strokeStyle = "blue";
//注意点
//1. 不设置颜色的话默认都是黑色
//2. 一个上下文，如果设置了颜色，那他之后画任何东西都是那个颜色，直到下次修改颜色
ctx.lineWidth = 15; //默认值为1
ctx.lineCap = "butt"; //设置线末端的现状
ctx.lineJoin = "bevel"; //线交叉样式
ctx.setLineDash([5, 15]); //线间隙长度
```

#### 状态存储

```javascript
ctx.save() //状态存储
ctx.restore() //恢复到最新save状态，并且把之前的删除
```

#### 变形操作

```javascript
ctx.translate(x,y) //来移动我们画板的坐标系的原点
ctx.rotate(angle) //来顺时针旋转画板的坐标系
ctx.scale(x, y) //来去放大缩小我们坐标的比例
```

