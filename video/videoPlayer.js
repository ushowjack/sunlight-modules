class VideoPlayer {
  constructor(options = {}) {
    // 获取所有的配置
    for (let key in options) {
      if (options.hasOwnProperty(key)) {
        this[`$${key}`] = options[key];
      }
    }

    for (let key in options.data) {
      if (options.data.hasOwnProperty(key)) {
        this[`_${key}`] = options.data[key];
        this[key] = options.data[key];
      }
    }

    for (let key in options.methods) {
      if (options.methods.hasOwnProperty(key)) {
        this[key] = options.methods[key];
      }
    }

    // 状态发生改变调用状态回调函数
    Object.defineProperty(this, 'status', {
      set(status) {
        if (this._status === status) return;
        this._status = status;
        this.statusCallback(status);
      },
      get() {
        return this._status;
      },
      enumerable: true,
      configurable: true
    })

  }
  init() {

  }

  // ---------------- 播放方法 ----------------//

  // 测试用例
  test() {
    console.log('测试成功');
  }

  /**
   * @description 开始播放事件
   * @author USHOW JACK, EMAIL: ushowjack@GMail.com
   * @param {any} videoList 
   * @param {any} callback 
   * @param {boolean} [isLoop=false] 
   * @memberof VideoPlayer
   */
  startPlay(videoList, isLoop = false) {
    this.$videoList = typeof videoList === 'string' ? [videoList] : videoList;
    this.updateVideoStatus();
  }

  /**
   * @description 停止回调
   * @author USHOW JACK, EMAIL: ushowjack@GMail.com
   * @returns 
   * @memberof VideoPlayer
   */
  stopCallback() {

  }
  startCallback() {

  }

  /**
   * @description 状态器，开始播放方法执行后打开，非打开状态时结束，只做一件事，更新播放状态
   * @author USHOW JACK, EMAIL: ushowjack@GMail.com
   * @memberof VideoPlayer
   */
  updateVideoStatus() {
    this.statusTimer = setInterval(() => {
      const status = this.getVideoStatus();
      this.status = status;
      console.log(status)

      // 如果改变，则判断是否为播放状态
    }, 5000);
  }

  statusCallback(status) {
    switch (status) {
      case this.$statusCode.play:
        console.log('开始播放');
        this.startCallback();
        break;

      case this.$statusCode.stop:
        console.log('停止播放')
        this.stopCallback();
        break;

      case this.$statusCode.pause:
        console.log('暂停播放')
        this.pauseCallback();
        break;

      case this.$statusCode.error:
        console.log('播放失败')
        this.errorCallback();
        break;

      default:
        break;

    }
  }
}
