//封装鼠标滚轮事件
function addMouseWheel(obj,fn){
    if(window.navigator.userAgent.toLowerCase().indexOf('firefox') != -1){
        obj.addEventListener('DOMMouseScroll',fnWheel,false);
    }else{
        obj.onmousewheel = fnWheel;
    }
    function fnWheel(ev){
        var oEvt = ev || event;
        //firefox向下是true，其他浏览器相反
        var dir = true;
        if(oEvt.wheelDelta){
            //ie chrome
            dir = oEvt.wheelDelta > 0?false:true;
        }else{
            dir = oEvt.detail > 0?true:false;
        }

        (typeof fn == 'function')&&fn(dir);
        oEvt.preventDefault&&oEvt.preventDefault();
        return false;
    }
    
}
// 封装getPos
function getPos(obj){
    var l=0;
    var t=0;
    
    while(obj){
         l += obj.offsetLeft;
         t += obj.offsetTop;
        obj=obj.offsetParent;   //找div的定位父级
    }
    
    return {left:l, top:t}
}

//封装运动
function move(obj,json,options){
    
    options = options || {};
    options.easing = options.easing || "ease-out";
    options.duration = options.duration || 700;
    
    
    
    //起点
    var start = {};
    //距离
    var dis = {};
    
    for(var name in json){
        start[name] = parseFloat(getStyle(obj,name));
        dis[name] = json[name] - start[name];
    }
    //终点json
    //次数
    var count = Math.round(options.duration/30);
    
    var n = 0;
    
    clearInterval(obj.timer);
    obj.timer = setInterval(function(){
        n++;
        //位置
        
        for(var name in json){
            
            switch(options.easing){
                case "linear":
                    var a = n/count;
                    var cur = start[name] + dis[name]*a;
                    break;
                case "ease-in":
                    var a = n/count;
                    var cur = start[name] + dis[name]*Math.pow(a,3);
                    break;
                case "ease-out":
                    var a = 1 - n/count;
                    var cur = start[name] + dis[name]*(1-Math.pow(a,3));
                    break;
            }
            
            
            if(name == "opacity"){
                obj.style.opacity = cur;
                obj.style.filter = "alpha(opacity:"+cur*100+")";
            } else {
                obj.style[name] = cur + "px";
            }
        }
        if(n == count){
            clearInterval(obj.timer);
            options.complete && options.complete();
        }
    },30);
    
}
//封装获取样式
function getStyle(obj,attr){
    return obj.currentStyle? obj.currentStyle[attr]:getComputedStyle(obj,false)[attr];
}
//封装获取class名
function getByClass(oParent,sclass){
    var aEle = oParent.getElementsByTagName('*');
    var res = [];
    for(var i=0;i<aEle.length;i++){
        var arr = aEle[i].className.split(' ');
        for(var j=0;j<arr.length;j++){
            if(arr[j]==sclass){
                res.push(aEle[i]);
                break;
            }
        }
    }
    return res;
}
// 封装ajax
function ajax(options){
    options = options || {};
    if(!options.url){return;};
    options.data = options.data || {};
    options.type = options.type || 'get';

    data.t = Math.random();
    var arr = [];
    for(var key in options.data){
        arr.push(key + '='+options.data[key]);
    }
    var str = arr.join('&');
    //创建ajax对象
    if(window.XMLHttpReques){
        var xhr = new XMLHttpReques();
    }else{
        var xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    //连接
    if(options.type == 'get'){
        xhr.open('get',url+'?'+str,true);
        xhr.send(null);
    }else{
        xhr.open('post',url,true);
        xhr.send(str);
    }
    
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if(xhr.status >=200 && xhr.status<300 || xhr.status==304){
                options.success && options.success(xhr.responseText);
            }else{
                options.error && options.error(xhr.status);
            }
        }
    }

}


// //判断方向
// function direction(obj,oEv){
//  var x = oEv.clientX - obj.offsetLeft - obj.offsetWidth/2;
//  var y = obj.offsetHeight/2 + obj.offsetTop - oEv.clientY;
//  // 弧度
//  var a = Math.atan2(y,x);
//  //换成角度，然后除以90度，得到4个方向，0 左  1下 2 右 3 上
//  return Math.round((a*180/Math.PI + 180)/90)%4;
// }

//封装ready函数
function $(fn){
    if(document.addEventListener){
        document.addEventListener('DOMContentLoaded',fn,false);
    }else{
        document.attachEvent('onreadystatechange',function(){
            if(document.readyState == 'complete'){
                fn&&fn();
            }
        })
    }
}