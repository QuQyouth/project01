window.addEventListener('load', function() {
    //fixed定位侧边栏部分
    var slider = document.querySelector('.back-top');
    var topbar = document.querySelector('.topbar-wrapper');
    var sliderTop = slider.offsetTop - topbar.offsetHeight;
    var topW = document.querySelector('.back-top').querySelector('.top'); //注意这里不能使用top作为变量的关键字
    var binner = document.querySelector('.binner-wrapper');
    var binnerTop = binner.offsetTop; //写在滚动函数外部 否则binner.offsetTop会变化
    console.log('top' + binnerTop);
    console.log(sliderTop);
    document.addEventListener('scroll', function() {
        if (window.pageYOffset >= topbar.offsetHeight) {
            slider.style.position = 'fixed';
            slider.style.top = sliderTop + 'px';
        } else {
            slider.style.position = 'absolute';
            slider.style.top = '300px'; //使用bottom固定位置滚动时会跳动
        }
        //滚动至binner时让.topW显示
        if (window.pageYOffset >= 140) {
            topW.style.display = 'block';
        } else {
            topW.style.display = 'none';
        }
    });

    //返回顶部
    topW.addEventListener('click', function() {
        //window.scroll(0, 0);
        animateY(window, 0);
    })

    //弹出菜单
    var popup = document.querySelector('.popup');
    var popupWin = document.querySelector('.popup-win');
    popup.addEventListener('mouseenter', function() {
        animate(popupWin, -56, function() {
            popup.children[0].innerHTML = '➡'; //动画执行后回调函数改变文字
        });
    });
    popup.addEventListener('mouseleave', function() {
        animate(popupWin, 0, function() {
            popup.children[0].innerHTML = '⬅';
        });
    });

    //binner部分
    //鼠标经过显示隐藏左右按钮并控制自动播放
    var preBtn = document.querySelector('.pre');
    var nextBtn = document.querySelector('.next');
    var imgList = document.querySelector('.img-list');
    var binner = this.document.querySelector('.binner');
    var perImgWidth = imgList.children[0].clientWidth; //获取一张图片的宽度
    binner.addEventListener('mouseenter', function() {
        preBtn.style.display = 'block';
        nextBtn.style.display = 'block';
        clearInterval(autoTimer);
        autoTimer = null;
    });
    binner.addEventListener('mouseleave', function() {
        preBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        autoTimer = setInterval(function() {
            nextBtn.click();
        }, 2000)
    });

    //动态生成pointer
    console.log(imgList.children.length);
    var pointer = document.querySelector('.pointer');
    for (var i = 0; i < imgList.children.length; i++) {
        var everyPointer = document.createElement('a'); //创建一个a
        pointer.appendChild(everyPointer); //把a插入到pointer里
        //通过自定义属性记录当前小圆点的索引号
        everyPointer.setAttribute('index', i);

        //小圆点添加点击事件 排他思想
        everyPointer.addEventListener('click', function() {
            for (var i = 0; i < pointer.children.length; i++) {
                pointer.children[i].className = '';
            }
            this.className = 'current';
            //点击小圆点移动img-list
            var index = this.getAttribute('index'); //获取当前小圆点的索引号
            //将点击的小圆点索引号给控制图片播放的num和控制小圆点current类的cricle
            num = index;
            circle = index;
            console.log(index);
            //移动距离target = 小圆点索引号 * 图片宽度
            animate(imgList, -index * perImgWidth);

        })
    }
    //添加current类只能加入新的类 不能修改原来的样式 使用element.style.backgroundColor修改样式
    pointer.children[0].className = 'current';

    //点击pre-next实现滚动
    //生成小圆点之后克隆第一张图片 使小圆点数量不受影响
    var first = imgList.children[0].cloneNode(true); //深克隆
    imgList.appendChild(first); //第一张图片追加到imgList最后
    var num = 0; //控制图片播放
    var circle = 0; //控制小圆点播放
    //节流阀
    var flag = true;
    nextBtn.addEventListener('click', function() {
        if (flag) {
            flag = false;
            if (num == imgList.children.length - 1) {
                imgList.style.left = 0;
                num = 0;
                //最后一次num=4时 将0赋值给num 0赋值给left 此时图片闪现至第一张图 本次循环结束(此次点击看起来没有变化)
                //当再次点击右箭头时 num就由0自增为1了 目标位置为-1*图片宽度 此时无缝轮播到第二张图片
            }
            num++;
            animate(imgList, -num * perImgWidth, function() {
                flag = true; //动画执行完毕 打开节流阀
            });

            circle++;
            if (circle == pointer.children.length) { //当轮播到克隆的first图片时 复原
                circle = 0;
            }
            pointerChange(); //调用函数改变小圆点样式
        }

    });

    preBtn.addEventListener('click', function() {
        if (flag) {
            flag = false;
            if (num == 0) {
                num = imgList.children.length - 1;
                imgList.style.left = -num * perImgWidth + 'px'; //imgList向左移动 left为负值
                //5张图片4个小圆点
                //第一次num=0时 将4赋值给num 4*图片宽度赋值给left 此时图片闪现至第五张图 本次循环结束(此次点击看起来没有变化)
            }
            num--; //当再次点击左箭头时 num由4自减为3了 目标位置为-3*图片宽度 此时无缝轮播到第4张图片
            animate(imgList, -num * perImgWidth, function() {
                flag = true;
            });

            circle--;
            if (circle < 0) { //当circle为-1时 circle赋值为4 再次点击preBtn时circle自减为3即第3个小圆点亮
                circle = pointer.children.length - 1;
            }
            pointerChange();
        }
    });
    //封装改变小圆点样式函数
    function pointerChange() {
        //清除所有小圆点的current类
        for (var i = 0; i < pointer.children.length; i++) {
            pointer.children[i].className = '';
        }
        //当前小圆点设置current类
        pointer.children[circle].className = 'current';
    }

    //自动播放轮播图
    //手动调用nextBtn点击事件 nextBtn.click()
    var autoTimer = this.setInterval(function() {
        nextBtn.click();
    }, 2000);

})