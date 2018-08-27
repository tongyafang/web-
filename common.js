/**
 *
 * @param id
 * @returns {HTMLElement | null}
 */
function my$(id){
    return document.getElementById(id);
}

/**
 * 动画函数，移动任意元素到任意指定位置
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