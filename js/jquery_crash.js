/**
 * JQuery extend: check crash between two elements
 * Developed by ws04
 */
$.fn.extend({
  /**
   *检查碰撞功能
   *@param ele2:需要检查的元素
   *@param cbFn:callback函数，当两个元素崩溃时
   *@返回jquery（this）
   */
  crash(ele2, cbFn) {
    this.each(function (x, e1) {
      //遍历this
      $(ele2).each(function (y, e2) {
        //遍历所有障碍元素
        let e1T = $(e1).offset().top; //获得我们飞船的距离页面顶部的偏移
        let e1B = e1T + $(e1).height(); //顶部的偏移+自己飞船的高度
        let e2T = $(e2).offset().top; //获得敌人飞船，障碍物的距离页面顶部的偏移
        let e2B = e2T + $(e2).height(); //顶部的偏移+敌人飞船，障碍物的高度
        if (e1T < e2B && e2T < e1B) {
          //当障碍物，或我们的飞机的坐标连线包围了另一个元素那么进入下一步
          let e1L = $(e1).offset().left; //获取我们飞船的左边偏移量
          let e1R = e1L + $(e1).width(); //获取我飞船的左边偏移量+ 宽度
          let e2L = $(e2).offset().left; //获取敌人飞船的左边偏移量
          let e2R = e2L + $(e2).width(); //获取敌人飞船的左边偏移量+宽度
          if (e1L < e2R && e2L < e1R) {
            //如果e1L<e2R，e2L<e1R那么就代表两元素相撞
            cbFn(e1, e2);
            return false;
          }
        }
      });
    });
    return this;
  },
});
