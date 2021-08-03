/**
 * JQuery extend: move element
 * Developed by ws04
 */
$.fn.extend({
  /**
   *移动元素
   *@param playingFn:动画功能
   *@param spaceFn:当用户按下空格键时
   *@返回jquery（this）
   */
  moveable(playingFn, spaceFn) {
    let self = $(this)[0]; //获取到自己飞船
    //console.log($(this))
    self.actions = {
      //给飞船身上绑定几个属性
      l: false,
      r: false,
      t: false,
      b: false,
      s: true,
      playing: true,
    };

    $(document).on(
      "keydown",
      function (e) {
        //给键盘按下绑定事件
        switch (e.keyCode) {
          case 37:
            this.actions.l = true;
            break; //左
          case 39:
            this.actions.r = true;
            break; //右
          case 38:
            this.actions.t = true;
            break; //上
          case 40:
            this.actions.b = true;
            break; //下
          case 32:
            if (this.actions.playing && this.actions.s) {
              this.actions.s = false;
              spaceFn && spaceFn.bind(this)();
            } //bind原生js可以把spaceFn的上下文改为括号里的
            break;
        }
      }.bind(self)
    ); //bind把this 变为self 就会获得this.actions.l参数

    $(document).on(
      "keyup",
      function (e) {
        //当键盘松开
        switch (e.keyCode) {
          case 37:
            this.actions.l = false;
            break;
          case 39:
            this.actions.r = false;
            break;
          case 38:
            this.actions.t = false;
            break;
          case 40:
            this.actions.b = false;
            break;
          case 32:
            this.actions.s = true;
            break;
        }
      }.bind(self)
    );

    (function () {
      if (this.actions.playing) {
        //当飞机存活
        let eleTop = $(this).position().top; //获取飞机离顶部距离
        //console.log(eleTop);
        let eleLeft = $(this).position().left; //获取飞机离左边距离
        //console.log(eleLeft);
        let maxTop = $(this).parent().height() - $(this).height() - 10; //返回夫元素的高度-自己的高度-10   最大
        let maxLeft = $(this).parent().width() - $(this).width() - 10; //返回夫元素的宽度-自己的宽度-10   最大
        //console.log($(this).parent());
        this.actions.l && eleLeft > 10 && $(this).css("left", "-=8px"); //当this.actions.l为真且eleLeft>10，移动left
        this.actions.r && eleLeft < maxLeft && $(this).css("left", "+=8px"); ////当this.actions.r为真且eleLeft>10，移动left
        this.actions.t && eleTop > 10 && $(this).css("top", "-=8px"); //当按下上，并且大与最小高度移动top
        this.actions.b && eleTop < maxTop && $(this).css("top", "+=8px"); //当按下下，并且小与最大高度移动top
        playingFn && playingFn.bind(this)();
      }
      //console.log(arguments.callee);
      requestAnimationFrame(arguments.callee.bind(this));
    }.bind(self)());

    return this;
  },
});
