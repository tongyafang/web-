/**
 * 根据id获取元素
 * @param id
 * @returns {HTMLElement | null}
 */
function my$(id){
    return document.getElementById(id);
}

/**
 * 匀速动画函数，移动任意元素到任意位置
 * 参数1：要移动的元素；参数2：目标位置，要移动到的位置
 * @param element
 * @param target
 */
function animation(element,target){
    //先清理定时器，保证每次点击的时候只有一个定时器
    clearInterval(element.timeId);
    //设置定时器
    element.timeId = setInterval(function(){
        // 获取元素当前位置
        var current = element.offsetLeft;
        // 设置每次移动的步数
        step = 9;
        //判断当前位置和目标位置的关系，如果当前位置大于目标位置，走负数，反之走整数
        step = current>target? -step:step;
        current += step;
        //判断：如果在目标位置的距离大于step，正常移动step，如果小于，则清除定时器，并直接将current设置为目标位置，
        if(Math.abs(current-target)>Math.abs(step)){
            element.style.left = current+"px";
        }else{
            clearInterval(element.timeId);
            element.style.left = target+"px";
        }
    },20);
}

/**
 * 缓动动画函数，使任意元素到达任意位置，参数1是获取到的元素，参数2是要到达的目标位置（纯数字，不带单位）
 * @param element
 * @param target
 */
function variableAnimation(element,target){
    //如果有定时器，先清理
    clearInterval(element.timeid);
    // 设置定时器
    element.timeid = setInterval(function(){
        //获取元素当前位置
        var current = element.offsetLeft;
        // 设置每次移动步数
        var step = (target-current)/10;
        // 判断
        step = step>0? Math.ceil(step):Math.floor(step);
        current += step;
        element.style.left = current+"px";
        if(current==target){
            //如果到达目标位置，清理定时器
            clearInterval(element.timeid);
        }
    },20);
}

/**
 * 参数1是要改变的元素，参数2是要改变的多个属性值，以键值对的方式写，{“参数1”：值，”参数2“：值}
 * 终极版缓动动画函数，设置元素的任意多个属性到达指定值，且可以执行回调函数
 * @param element
 * @param json
 * @param fn
 */
function animate(element,json,fn){
    // 如果有定时器，先清理
    clearInterval(element.timeid);
    // 设置定时器
    element.timeid = setInterval(function(){
        var flag = true;//默认所有属性都到达指定位置
        //遍历json对象，为每个属性添加动画
        for (var attr in json){

            if(attr=="zIndex"){//判断属性是否是层级，如果是，直接设置属性值
                element.style[attr] = json[attr];
            }else if(attr=="opacity"){//判断属性是否为透明度
                var current = getAttr(element,attr)*100;//透明度的值是数字类型，透明度的取值是0.00-1.00，放大100倍，方便计算
                // 获取target的值。target值即为json对象中键对应的值
                var target = json[attr]*100;
                // 设置移动的步数
                var step = (target-current)/10;
                //判断走正数还是走负数
                step = step>0?Math.ceil(step):Math.floor(step);
                // 移动后的位置
                current += step;
                element.style[attr] = current/100;
            }else{//设置普通属性
                //获取元素当前位置
                var current = parseInt(getAttr(element,attr));//获得的属性是字符串类型，用parseInt转换为数字类型
                // 获取target的值。target值即为json对象中键对应的值
                var target = json[attr];
                // 设置移动的步数
                var step = (target-current)/10;
                //判断走正数还是走负数
                step = step>0?Math.ceil(step):Math.floor(step);
                // 移动后的位置
                current += step;
                element.style[attr] = current+"px";
            }
            //判断，到达目标位置清理定时器
            if(current!=target){
                flag = false;//只要有属性没到达指定位置，flag就变为false
            }//end of if
        }//end of for
        if(flag){//for循环结束后，如果所有的属性值都到达指定位置，则flag的值变为true，此时清理定时器
            clearInterval(element.timeid);
            if(fn){
                fn();//如果有回调函数，在循环结束后，执行回调函数
            }
        }

    },20);//end of 定时器
}

/**
 * 获取浏览器页面向上和向左卷曲的距离，使用getScroll.top和getScroll.left获取
 * @returns {{top: number, left: number}}
 */
function getScroll(){
    return {
        top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
        left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0
    };
}

/**
 * //获取任意元素的任意属性，返回值是带有px的字符串类型，需要使用parseInt转换为整数类型后才能进行计算
 * @param element
 * @param attr
 * @returns {string}
 */
function getAttr(element,attr) {
    return window.getComputedStyle? window.getComputedStyle(element)[attr]:element.currentStyle[attr];
}

/**
 * 获取事件触发时相对页面的横坐标和纵坐标，使用evt对象调用方法
 * @type {{getE: function(*=): (*|Event | undefined), getClientY: function(*=): number, getClientX: function(*=): number, getScrollTop: function(): number, getScrollLeft: function(): number, getPageY: function(*=): (number | *), getPageX: function(*=): (number | *)}}
 */
//使用一个对象写兼容代码
var evt = {
    //e和window的兼容代码
    getE:function(obj){
        return obj || window.event;//获取e或者window.event
    },
    //获取clientY,相对
    getClientY :function(obj){
        return evt.getE(obj).clientY;
    },
    //获取clientX，向左
    getClientX :function(obj){
        return evt.getE(obj).clientX;
    },
    //获取页面向上卷曲的距离scrollTop
    getScrollTop:function(){
        return window.pageYOffset ||  document.documentElement.scrollTop || document.body.scrollTop ||0;
    },
    //获取页面向左卷曲的距离scrollLeft
    getScrollLeft:function(){
        return window.pageXOffset ||  document.documentElement.scrollLeft || document.body.scrollLeft ||0;
    },
    //获取元素在页面的Y坐标
    getPageY:function(obj){
        return evt.getE(obj).pageY || evt.getClientY()+ evt.getScrollTop();
    },
    //获取元素在页面的X坐标
    getPageX:function(obj){
        return evt.getE(obj).pageX || evt.getClientX(obj)+evt.getScrollLeft();
    }
};