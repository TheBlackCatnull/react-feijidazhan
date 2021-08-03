/**
 * 'Star Battle' game logic
 * Developed by ws04
 */
window.onload = function () {
  /**
   * game initial: hidden others board, move logo and instructions with animations
   */

  $(".form-board, .ranking-board").fadeOut(0); //淡入淡出影藏
  console.log($(".form-board, .ranking-board"));
  $(".logo")
    .addClass("instructions")
    .on("webkitTransitionEnd", function () {
      //用on绑定一个过度动画效果，动画执行后直接调用回调函数
      $(".instructions-board>*, .planet-box").each(function (i) {
        $(this).css("animation", `general 0.3s ${i / 10}s forwards`); //让每个p显示出来
      });
      console.log($(".instructions-board>*, .planet-box"));
    });

  // 点击“开始游戏”按钮后              *隐藏指示板和移动徽标              */
  $(".btn-start").one("click", function () {
    $(".instructions-board").fadeOut(); //隐藏文子
    $(".logo").addClass("gaming"); //隐藏火星图标
    $(".planet-box").css({ left: "+=120px", "z-index": "auto" }); //让背景地球向后移动一点，打造，动画效果
    $(".planet-item, .container, .fuel-counter, .player").css(
      "animation-play-state",
      "running"
    ); //让背景地球火星动画运行 //游戏开始：启动计时器，将事件绑定到这些元素，背景音乐开始，播放器可移动
    /**
     * Game started: start timer, bind event to these elements, background music start and player moveable
     */ $(".player").on("webkitAnimationEnd", function () {
      game.timer(); //调用了一个时间函数//创建障碍物道具
      $(document).on("keydown", function (e) {
        e.keyCode == 80 && $(".setting-play").click(); //当按下的是p键和按暂停一个效果
      });
      $(".setting-play").on("click", setting.play); //给每个小按钮绑定点击事件
      $(".setting-audio").on("click", setting.audio);
      $(".setting-font-plus").on("click", setting.fontPlus);
      $(".setting-font-minus").on("click", setting.fontMinus);
      $(".container").createAudio("background", game.audio, "loop"); //调用函数播放音乐
      $(".player").moveable(player.playingFn, player.shot); //
    });
  });

  /**
   * Player related informations
   */
  let player = {
    /**
     * 始终与动画一起播放的函数
     */

    playingFn() {
      // Enemy shot
      //敌人飞船射击

      $(".enemy.collision[shot]").each(function () {
        //获取所有敌人飞船
        //console.log( $('.enemy'))
        if ($(this).position().left < 700) {
          //当left为<700时射击
          $(this).removeAttr("shot"); //移除shot属性，代表可以射击
          $(game.container).createEle(
            "enemy-bullet collision",
            {
              //可以创建子弹元素
              top: $(this).position().top + 37, //这个子弹要射出去，就要比飞船的top大一点
              left: $(this).position().left, //left不变在一条直线
              animationDuration: game.getRandTime() / 2 + "s", //在game.getRandTime() / 2  秒内运行完
            },
            {
              score: 0,
              fuel: -150,
            }
          );
        }
      });

      // 玩家与其他元素碰撞
      $(".player").crash($(".collision:not(.bullet)"), function (e1, e2) {
        $(e2).css("visibility", "hidden").removeClass("collision"); //相撞后让元素消失，取消元素定位
        let fuel = $(e2).attr("fuel") / 1; //获取相撞元素fuel的值
        game.fuel += fuel;
        game.fuel > 300 && (game.fuel = 300); //如果 game.fuel > 300,game.fuel =的值锁定为300
        game.score += $(e2).attr("score") / 1;
        if ($(e2).attr("destroy")) {
          //当元素是障碍物时
          $(game.container).createAudio("destroyed", game.audio); //触发音乐
        }
        if (fuel < 0) {
          //当燃料耗尽时
          $(game.container).createEle("layer-red", {}, {}); //触发红色掉血动画
        }
      });

      //使用其他元素射击的玩家
      $(".bullet.collision").crash(
        $(".collision:not(.bullet, .fuel, .enemy-bullet)"),
        function (e1, e2) {
          $(e1).css("visibility", "hidden").removeClass("collision"); //当自己子弹碰到障碍物使其消失，并取消定位
          console.log(12312);
          let life = $(e2).attr("life") - 1; //使陨石障碍物生命值减一
          $(e2).attr("life", life); //获取元素生命值
          if (life <= 0) {
            //当陨石生命值小于0
            let score = $(e2).attr("score") / 1; //获得被击毁障碍物分数，有可能是负数，可能是负数
            game.score += score; //加分数
            score != 0 &&
              $(game.container)
                .createEle(
                  `score-counter score-${score > 0 ? "plus" : "minus"}`,
                  {
                    //如果击毁的分数是正数就创建plus不是则是minus
                    top: $(game.player).position().top, //top，left跟自己的飞机一样
                    left: $(game.player).position().left,
                  },
                  {}
                )
                .text(score); //把创建的元素text改为分数
            $(e2).css("visibility", "hidden").removeClass("collision"); //当陨石生命值小于0让其消失取消定位
            if ($(e2).attr("destroy")) {
              //当击毁的是障碍物
              $(game.container).createAudio("destroyed", game.audio); //播放音乐
            }
          }
        }
      );

      // 当燃料血量不足0时游戏结束
      game.fuel < 0 && game.over(); //

      // 将游戏信息呈现给游戏
      $(".time-info").text(Math.round(game.time / 10)); //存活时间
      $(".score-info").text(game.score); //分数
      $(".fuel-info").text(Math.round(game.fuel / 10)); //自己生命值
      $(".fuel-counter").css("width", game.fuel / 3 + "%"); //生命值血条
    },

    /**
     * 播放器快照：创建快照元素，创建音频
     */
    shot() {
      //当按下空格时
      $(game.container)
        .createAudio("shoot", game.audio)
        .createEle(
          "bullet collision",
          {
            //按下空格播放子弹发射创建子弹元素
            top: $(game.player).position().top + 17,
            left: $(game.player).position().left + 100,
          },
          {}
        );
    },
  };

  /**
   * Game relate informations
   * Game elements: game board and player
   * Game informations: name, score, time, fuel
   * Game setting: audio, font size
   */
  /**
   *游戏相关信息
   *游戏元素：游戏板和玩家
   *游戏信息：名字，分数，时间，燃料
   *游戏设置：音频，字体大小
   */
  let game = {
    container: $(".container")[0], //装游戏的盒子
    player: $(".player")[0], //自己的飞机

    name: "", //名字
    score: 0, //分数
    time: 0, //时间
    fuel: 150, //燃料

    audio: 1, //开关音乐
    font: 16, //字体

    /**
     * 游戏计时器：计算时间，燃料，创建时间元素
     */
    timer() {
      setInterval(function () {
        if (game.player.actions.playing) {
          //当飞机元素actions.playing这个属性为真时
          game.time++;
          game.fuel--;

          if (!(game.time % 40)) {
            //当game.time % 40，没有余数的时候
            $(game.container).createEle(
              "friend collision",
              {
                top: "rand",
                animationDuration: game.getRandTime() + "s, 0.4s", //给动画规定一个运行时间，0.4s是延迟时间让物体不同时出现
              },
              {
                score: -10, //给创建的障碍物身上设置属性
                fuel: -150,
                life: 1,
                destroy: true,
              }
            );
          }

          if (!(game.time % 35)) {
            //当game.time % 30，没有余数的时候
            $(game.container).createEle(
              "enemy collision",
              {
                top: "rand",
                animationDuration: game.getRandTime() + "s, 0.4s", //给动画规定一个运行时间，0.4s是延迟时间让物体不同时出现
              },
              {
                score: 5, //给创建的障碍物身上设置属性
                fuel: -150,
                life: 1,
                shot: true,
                destroy: true,
              }
            );
          }

          if (!(game.time % 30)) {
            //当game.time % 30，没有余数的时候
            $(game.container).createEle(
              `aestroid aestroid-${~~(Math.random() * 4) + 1} collision`,
              {
                //aestroid-${~~(Math.random() * 4) + 1//1到5
                top: "rand",
                animationDuration: game.getRandTime() + "s", //给动画规定一个运行时间
              },
              {
                score: 10,
                fuel: -150,
                life: 2,
                destroy: true,
              }
            );
          }

          if (!(game.time % 25)) {
            //当game.time % 30，没有余数的时候//创建能量道具
            $(game.container).createEle(
              "fuel collision",
              {
                left: "rand", //他是从上往下所以控制left
                animationDuration: game.getRandTime() + "s", //给动画规定一个随机运行时间
              },
              {
                score: 0,
                fuel: 150,
              }
            );
          }
        }
      }, 100); //1/10秒运行一次
    },

    /**
     * Create a rand time of the game
     * @returns rand time
     */
    getRandTime() {
      return Math.random() * 2 + 6; //随机一个6到8的数
    },

    /**
     * *当比赛结束时
     */
    over() {
      $(".setting-play").click(); //取消暂停函数点击事件
      $(".form-board").fadeIn(); //让页面淡出
      $(".logo").addClass("form"); //给logo一个class，class里面有动画移动到对应的位置
      $(".layer-red").css("animation-play-state", "running"); //让掉血红色动画执行一次，
      $(".input-name").on("input", function () {
        //给输入框绑定input
        game.name = $(this).val(); //名字等于输入的名字
        game.name
          ? $(this).next().removeClass("disabled")
          : $(this).next().addClass("disabled"); //如果有名字给同胞元素buttn按钮可以按并改变样式
        //如果没输入值那么不能按
      });
    },
  };

  /**
   * 游戏设置
   */
  let setting = {
    /**
     * 更改游戏状态
     */
    play() {
      game.player.actions.playing = !game.player.actions.playing; //.playing是true那么等于false
      $(this).attr(
        "src",
        `imgs/setting-${game.player.actions.playing ? "pause" : "play"}.png`
      ); //如果.playing是false，则换成暂停图标
      $("[style*=animation]").css(
        "animation-play-state",
        game.player.actions.playing ? "running" : "paused"
      ); //让所有有动画的元素暂停，如果本是暂停的就继续
      $(game.container).playAudio(game.player.actions.playing); //game.player.actions.playing为false暂停音乐，为true播放音乐
      game.player.actions.playing
        ? $(".setting-item").addClass("controllable")
        : $(".setting-item").removeClass("controllable");
      //如果按暂停删除按钮动画css，如果继续添加动画css
    },

    /**
     * 更改音频音量
     */
    audio() {
      if (game.player.actions.playing) {
        //如果按下声音键
        game.audio = game.audio ? 0 : 1; //第一个按下返回0，第二次1
        $(this).attr(
          "src",
          `imgs/setting-audio-${game.audio ? "on" : "off"}.png`
        ); //按下后更改图片
        $(game.container).openAudio(game.audio); //按下关闭音乐，再按下打开音乐
      }
    },

    /**
     * 加号字体
     */
    fontPlus() {
      if (game.player.actions.playing && game.font < 24) {
        //如果按下加字体键，并且字体font<24
        game.font += 2; //然后字体+2
        console.log($(".score-info").css("font-size"));
        $(".score-info, .time-info").css("font-size", "+=2px"); //让装分数，和时间的字体变大
      }
    },

    /**
     * 减号字体
     */
    fontMinus() {
      if (game.player.actions.playing && game.font > 12) {
        //如果按下减字体键，并且字体font>12
        game.font -= 2; //那么字体-2
        $(".score-info, .time-info").css("font-size", "-=2px");
      }
    },
  };

  /**
   * 单击“继续”按钮后
   */
  $(".btn-continue").on("click", function () {
    //给继续按钮绑定点击事件
    if (game.name) {
      //游戏失败后设置了名字就为真
      $(".logo").addClass("ranking"); //那么logo继续改变位置

      //获取结果数据
      let result = {
        name: game.name, //获取名字
        score: game.score, //获取分数
        time: ~~(game.time / 10), //获取时间
      };

      //存储到本地存储并排序数据
      let data = localStorage.ws04_ranking
        ? JSON.parse(localStorage.ws04_ranking)
        : []; //JSON.parse字符串转成数组或对象，第二次进入data
      //第二次进入data为把JSON.parse(localStorage.ws04_ranking)，转成json
      data.push(result); //把result添加到本地储存数组,push合并数组，第二次进入会把
      localStorage.ws04_ranking = JSON.stringify(data); //把数组转成转成字符串,这句话应该优化性能
      data.sort(function (a, b) {
        if (a.score === b.score) {
          return b.time - a.time;
        }
        return b.score - a.score;
      });
      let index = data.findIndex(function (arr) {
        return (
          arr["name"] == result["name"] &&
          arr["score"] == result["score"] &&
          arr["time"] == result["time"]
        );
      }); //index第一次运行找到的是0，第二次是1，然后抵价

      for (let i in data) {
        data[i]["rank"] = i / 1 + 1;
        console.log(data[i]["rank"]);
        if (
          i != 0 &&
          data[i]["score"] == data[i - 1]["score"] &&
          data[i]["time"] == data[i - 1]["time"]
        ) {
          data[i]["rank"] = data[i - 1]["rank"]; //当你分数，与前面的分数想等时
        }
        if (i < 10 || i == index) {
          $(".ranking-board tr:last-child").before(`<tr class="${
            i == index ? "player-score" : ""
          }">
                    <td>${data[i]["rank"]}</td>
                    <td>${data[i]["name"]}</td>
                    <td>${data[i]["score"]}</td>
                    <td>${data[i]["time"]}</td>
                </tr>`); //给现在出现的分数条变成红色冰把分数传进去
        }
      }

      //为游戏提供排名
      for (let i = 0; i < 10 - data.length; i++) {
        //当排名小于10的时候
        $(".ranking-board tr:last-child").before(
          `<tr style="visibility:hidden;"><td>-</td><td></td><td></td><td></td></tr>`
        );
      } //在排名人数不够10个的时候创建很多空的tr填补空缺

      $(".ranking-board").fadeIn(); //让隐藏的board元素淡入出来
      $(".ranking-table tr").each(function (i) {
        //遍历tr给每个tr添加动画
        $(this).css("animation", `general 0.3s ${i / 10}s forwards`); //这个延迟会随着i的提高而提高从而好看
      });
    }
  });

  /**
   * 排行榜中的重启游戏按钮：点击将重启游戏
   */
  $(".btn-restart").on("click", function () {
    location.href = location.href; //给继续点击事件，重启网页
  });
};
