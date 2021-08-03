/**
 * JQuery extend: Create element
 * Developed by ws04
 */
$.fn.extend({
   // *创建元素函数
   // *@param name:元素的类名
   // *@param css:css样式
   // *@param attr:属性
   // *@returns jquery（新元素）
   // */
    createEle (name, css, attr) {
        let ele = $(`<div class="${name}"></div>`).appendTo(this);//创建一个名字为neme的div把他扩充到this上
        css.top=='rand' && (css.top = Math.random()*($(this).height() - ele.height() - 80) + 80);//rand在80和$(this).height() - ele.height()之间
        css.left=='rand' && (css.left = Math.random()*($(this).width() - ele.width()));
        ele.css(css).attr(attr).css('animation-play-state', 'running').on('webkitAnimationEnd', function () {
            $(this).remove();//给每个障碍物飞机设一个动画，从右往左移动，移动完就删除元素消失
        });
        return ele;
    }
})