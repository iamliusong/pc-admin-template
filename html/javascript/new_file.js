//获取对象的非行间样式
function getStyle(obj,name)
{
  if(obj.currentStyle)
  {
    return obj.currentStyle[name];
  }
  else
  {
    //第一个参数是这个元素，第二个元素是一个垃圾
    return getComputedStyle(obj,false)[name];
  }
}

/*
* 多物体运动框架中所有的属性变量都不能公用
* 使用json格式传递数据，可以一次设置多个属性
* startMove(oDiv,{width:400,height:400},func)
* */
function startMove(obj,json,func)
{
  clearInterval(obj.timer);
  obj.timer=setInterval(function()
  {
    //首先对所有的目标点做一个假设
    var bStop=true;
    //对所有的目标属性进行遍历
	for(var attr in json)
	{
	  var cur=0;
	  //如果是设置对象的透明度，则进行以下操作
	  if(attr=='opacity')
	  {
        cur=Math.round(parseFloat(getStyle(obj,attr))*100);
      }
      //设置对象的其它属性
      else
      {
        cur=parseInt(getStyle(obj,attr));
	  }
      //设置运动的速度
      var speed=(json[attr]-cur)/6;
      speed=speed>0?Math.ceil(speed):Math.floor(speed);
      //如果发现有值没有达到目标点，怎运动不结束
      if(cur!=json[attr])
       bStop=false;
      //设置透明度操作
      if(attr=='opacity')
      {
        obj.style.filter='alpha(opacity:'+(cur+speed)+')';
        obj.style.opacity=(cur+speed)/100;
      }
      //其它属性操作
      else
      {
        obj.style[attr]=cur+speed+'px';
      }
    }
    //当所有的属性操作进行完之后，再关闭定时器
    if(bStop)
    {
      clearInterval(obj.timer);
      //如果调用函数的时候传进来的有函数，则进行函数操做
      if(func)func();
    }
  },30);
}