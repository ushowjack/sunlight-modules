const videoconf = {
  // ---------------- 存放数据 ----------------//

  // 获取window播放器对象
  player: 'media',
  volumn: 'volumn',
  statusCode: {
    stop: 2,
    play: 0,
    // error: 3,
    pause: 1
  },

  // 播放列表,可以是单个字符串
  videoList: [],

  // 媒体方法
  methods: {
    // ---------------- 播放方法 ----------------//
    // 开始播放
    start(url) {
      this.status = 0;
      // debugger
      console.log(`[-------开始播放 || url:${url}!!]`);
    },

    // 暂停播放
    pause() {
      console.log(`[-------暂停播放------!!]`);
    },

    // 恢复播放
    resume() {
      console.log(`[-------恢复播放------!!]`);
    },

    // 停止播放
    stop() {
      console.log(`[-------停止播放------!!]`);
    },

    // 查询状态,必须要有返回值
    getVideoStatus() {
      // this.count++;
      // if (this.count % 10) {
      //   return 0;
      // }
      return 2;
    },

    // 获取时长
    getVideoTotal() {
      const time = 1;
      console.log(`[-------获取时长:${time}-----!!]`);
      return time
    },
    // 设置进度
    seek(time) {
      console.log(`[-------设置进度:${time}-----!!]`);
    },

    // 设置位置
    offsetChange() {},

    // ---------------- 音量方法 ----------------//

    // 设置静音
    setMute(v) {
      console.log(`[-------设置静音------!!]`);
    },

    // 查询静音音量
    getMute() {
      console.log(`[-------查询静音音量------!!]`);
    },

    // 设置音量
    setVoice(v) {
      console.log(`[-------设置音量------!!]`);
    },

    // 查询音量
    getVoice() {
      console.log(`[-------查询音量------!!]`);
    }
  },
  // --------------- 生命周期钩子 ------------------ //

  stopCallback({ url, index }) {
    console.log('stopCallback');
    this.pause();
  },

  startCallback({ url, index }) {
    console.log('startCallback');
  },

  errorCallback({ url, index }) {
    this.nextVideo();
    console.log('errorCallback', `this is index[${index}]`);
  },

  pauseCallback({ url, index }) {
    console.log('pauseCallback');
  }

}
