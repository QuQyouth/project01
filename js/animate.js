function animate(obj, target, callback) { //callback形参传递 function(){}函数，相当于 callback = function(){} 函数名为callback
    clearInterval(obj.timer) //使元素只有一个定时器执行
    obj.timer = setInterval(function() { //给对象添加timer属性 不使用使用var timer避免内存中重复开辟新的空间
        var step = (target - obj.offsetLeft) / 10; //步长值写在定时器内部
        step = step > 0 ? Math.ceil(step) : Math.floor(step); //正值取大负值取小
        if (obj.offsetLeft == target) {
            clearInterval(obj.timer);
            if (callback) { //回调函数写在定时器结束里面
                callback(); //如果有callback函数则调用
            }
            //相当于 callback && callback() 逻辑与的短路
        } else {
            obj.style.left = obj.offsetLeft + step + 'px'; //style改变 offset获取
        }
    }, 15);
}

function animateY(obj, target, callback) { //callback形参传递 function(){}函数，相当于 callback = function(){} 函数名为callback
    clearInterval(obj.timer) //使元素只有一个定时器执行
    obj.timer = setInterval(function() { //给对象添加timer属性 不使用使用var timer避免内存中重复开辟新的空间
        var step = (target - window.scrollY) / 10; //window.scrollY得到页面滚动距离
        step = step > 0 ? Math.ceil(step) : Math.floor(step); //正值取大负值取小
        if (window.scrollY == target) {
            clearInterval(obj.timer);
            if (callback) { //回调函数写在定时器结束里面
                callback(); //如果有callback函数则调用
            }
            //相当于 callback && callback() 逻辑与的短路
        } else {
            //obj.style.left = obj.offsetLeft + step + 'px'; //style改变 offset获取
            window.scroll(0, window.scrollY + step);
        }
    }, 15);
}