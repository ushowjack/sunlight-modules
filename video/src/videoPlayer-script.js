class VideoPlayer {
  constructor(options = {}, isLoop = false) {
    if (VideoPlayer.instance) {
      return this
    } else {
      VideoPlayer.instance = this
    }

    this.count = 0
    this.$options = options

    for (let key in options.methods) {
      if (options.methods.hasOwnProperty(key)) {
        this[key] = options.methods[key]
      }
    }

    //  对实例扩容
    for (let key in options) {
      if (options.hasOwnProperty(key) && key !== 'methods') {
        this[key] = options[key]
      }
    }

    this.$isLoop = isLoop

    this.statusCode = this.$statusCode = options.statusCode

    this.$playStatus_old = this.$statusCode.stop

    this.$videoList = []
    this.$playVideo = ''
    this.$videoList_pre = []
  }

  // ---------------- 视频列表方法 ----------------//

  // 添加视频url
  addVedioList(list = []) {
    const videoList = list.map((url, index) => {
      return { url, index }
    })
    if (this.$videoList) {
      typeof this.$videoList === 'string'
        ? (this.$videoList = [this.$videoList])
        : false
    } else {
      this.$videoList = []
    }
    this.$videoList = this.$videoList.concat(videoList)
    return this.$videoList
  }

  // 获取播放列表
  getVedioList() {
    return this.$videoList
  }

  // 删除列表
  deleteVidioList(delList = []) {
    this.$videoList = this.$videoList.filter(url => {
      if (~delList.indexOf(url.url)) return false
      return url
    })

    return this.$videoList
  }

  // 清空列表
  clearVidioList() {
    this.$videoList = []
    return this.$videoList
  }

  // ---------------- 衔接方法 ----------------//

  // 获取当前播放url
  getCurVideo() {
    return this.$curVideo
  }

  // 播放下一个
  nextVideo() {
    if (!this.$videoList.length) {
      console.warn('[ system ] 播放列表为空！！')
      return false
    }

    // 对上一个播放的url进行处理
    if (this.$isLoop) {
      this.$curVideo && this.$videoList.push(this.$curVideo)
    } else {
      this.$curVideo && this.$videoList_pre.push(this.$curVideo)
    }
    // 获取播放地址，播放视频
    this.$curVideo = this.$videoList.shift()
    this.start(this.$curVideo)

    return this.$videoList
  }

  // 播放上一个
  preVideo() {
    console.warn(`preVideo: this method is waiting for development!`)
  }

  // ---------------- 初始化添加配置 ----------------//

  /**
   * @description 初始化播放列表、是否循环播放
   * @author USHOW JACK, EMAIL: ushowjack@GMail.com
   * @param {any} videoList
   * @param {boolean} [isLoop=false]
   * @memberof VideoPlayer
   */
  init(videoList = '', isLoop = false, interval = 300) {
    videoList = typeof videoList === 'string' ? [videoList] : videoList
    this.addVedioList(videoList)
    this.$isLoop = isLoop
    this.$interval = interval
  }

  /**
   * @description 开始播放
   * @author USHOW JACK, EMAIL: ushowjack@GMail.com
   * @memberof VideoPlayer
   */
  play() {
    this.nextVideo()
    this.$timer = setInterval(() => {
      this.matchStatus()
    }, this.$interval)
  }

  /**
   * @description 关闭整个视频进程,关闭状态更新器，并执行回调
   * @author USHOW JACK, EMAIL: ushowjack@GMail.com
   * @memberof VideoPlayer
   */
  destroy(callback) {
    // 如果停止播放了，就不需要再重复执行关闭视频
    this.$videoList = []
    if (this.$over) return false

    this.stop()
    this.$destroyCallback = function() {
      clearInterval(this.$timer)
      callback && callback.apply(this)
    }.bind(this)
  }

  //  是否错误
  $isError() {
    typeof this.$errorCount === 'undefined'
      ? (this.$errorCount = 0)
      : this.$errorCount++
    if (
      this.$errorCount > 20 &&
      this.$playStatus_old === this.$statusCode.stop
    ) {
      this.$errorCount = 0
      this.$errorCallback()
    }
  }

  // ---------------- 生命周期触发 ----------------//

  /**
   * @description 状态器，开始播放方法执行后打开，非打开状态时结束，只做一件事，更新播放状态
   * @author USHOW JACK, EMAIL: ushowjack@GMail.com
   * @memberof VideoPlayer
   */
  matchStatus() {
    const newStatus = this.getVideoStatus()

    this.$isError()
    // 当状态发生改变
    if (newStatus !== this.$playStatus_old) {
      this.errorCount = 0

      this.triggleCallback(newStatus)
    } else {
      console.log('[u-video]:播放状态未改变！')
    }
  }

  /**
   * @description 触发状态回调函数
   * @author USHOW JACK, EMAIL: ushowjack@GMail.com
   * @param {any} newStatus
   * @memberof VideoPlayer
   */
  triggleCallback(newStatus) {
    if (this.$destroyCallback) {
      this.$destroyCallback()
      return false
    }
    this.$playStatus_old = newStatus

    switch (newStatus) {
      case this.$statusCode.stop:
        this.$stopCallback()
        break
      case this.$statusCode.play:
        this.$startCallback()
        break
      case this.$statusCode.pause:
        this.$pauseCallback()
        break
      default:
        console.warn(`获取状态码【${newStatus}】未定义！`)
        break
    }
  }

  // ---------------- 生命周期钩子 ----------------//

  $stopCallback() {
    if (this.$videoList.length) {
      this.nextVideo()
    } else {
      this.$over = true
      clearInterval(this.$timer)
    }
    this.stopCallback(this.$curVideo)
  }

  $startCallback() {
    this.startCallback(this.$curVideo)
  }

  $errorCallback() {
    if (this.$destroyCallback) {
      this.$destroyCallback()
      return false
    }
    this.errorCallback(this.$curVideo)
  }

  $pauseCallback() {
    this.pauseCallback(this.$curVideo)
  }
}
