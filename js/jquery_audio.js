/**
 * JQuery extend: audio controller
 * Developed by ws04
 */

$.fn.extend({
    /**
*创建音频到元素
*@param name:音频名称
*@param volume:音频的音量
*@param loop:循环播放或一次
*@返回jquery（this）
*/
    createAudio (name, volume, loop) {
        $(`<audio src="sound/${name}.mp3" autoplay ${loop ? 'loop' : ''}></audio>`).appendTo(this).on('ended', function () {
            $(this).remove();//播放完音乐删除ended事件
        })[0].volume = volume;
        return this;
    },

  /**
  *更改音频音量
  *@param flag:音频音量（0-1）
  */
    openAudio (flag) {
        $(this).find('audio').each(function () {
            this.volume = flag;
        });
    },

  /** 
  *控制音频 
  *@param flag:true表示播放音频，false表示暂停音频 
  */ 

    playAudio (flag) {
        $(this).find('audio').each(function () {
            flag ? this.play() : this.pause();//flag:true表示播放音频，false表示暂停音频 
        });
    }
});