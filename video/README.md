# videoPlayer-modules

### 安装
目前只支持使用npm下载，如果需要脚本可以到[git仓](https://github.com/ushowjack/sunlight-modules.git)自行下载。
```bash
npm install sunlight-video
```

### 配置项
**目前为了与业务层解耦，所以必须按规定配置所有的参数和方法。**
```ES6
export default videoconf = {
  // ---------------- 存放数据 ----------------//
  // 用于统一状态码名称
  statusCode: {
    stop: 2,
    play: 0,
    pause: 1
  },

  // 播放列表,可以是单个字符串
  videoList: [],

  // 媒体方法
  methods: {
    // ---------------- 播放方法 ----------------//
    // 开始播放
    start({ url, index }) {
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
      return status;
    },

    // 获取时长,必须要有返回值
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
```
*说明：配置项中可以写业务逻辑，所有`methods`中的方法和生命周期的方法的 `this` 皆指向videoPlayer的实例。*

### API

#### videoPlayer#init( videoList, isLoop, interval)

参数：
*videoList{ String | Array } | ''*
*isLoop{ Bealoon } | false*
*interval{ Number } | 300*

初始化，传入视频列表，此处视频列表会合并配置项的视频列表，设置是否能循环播放，以及查询状态的时间间隔。

```ES6
  const videoPlayer = new VideoPlayer(videoconf);
  videoPlayer.init(['123', '2314', '214314', 'fsg'], true, 500);
```
#### videoPlayer#play()

播放视频，执行播放命令。**目前打开视频后会自动打开状态查询计时器，所以如果想停止计时器，请调用destroy API**

```ES6
  videoPlayer.play();
```

#### videoPlayer#destroy(callback)
参数：
*callback{ Function }*

结束视频，**目前只支持清空视频列表，清空状态更新计时器。**为了解决关闭视频有延迟的问题，可以传入回调函数作为参数，从而在结束后调用。
```ES6
  videoPlayer.destroy(()=>{
    console.log('The video is close!');
  });
```
#### 视频列表方法
- videoPlayer#addVedioList(addList)
- videoPlayer#deleteVidioList(delList)
- videoPlayer#getVedioList()
- videoPlayer#clearVidioList()

*对列表的增删查清，所具参数皆为数组。**返回值为视频列表本身。***
```ES6
  console.log('addVedioList', videoPlayer.addVedioList(['123', '2314', '214314', 'fsg']));
  console.log('getVedioList', videoPlayer.getVedioList());
  console.log('deleteVidioList', videoPlayer.deleteVidioList(['fsg']));
```
### 生命周期
*每个视频播放都有一个生命周期，开始、暂停、结束以及异常情况（**如果计时20次未打开视频判定为异常**）。每个生命周期都有钩子，会传入当前播放视频的url以及对应的index索引。*
```ES6
  stopCallback({ url, index }) {
    console.log('stopCallback');
    this.pause();
  },

  startCallback({ url, index }) {
    console.log('startCallback');
  },

  errorCallback({ url, index }) {
    this.nextVideo();
    console.log(`errorCallback, this is index[${index}]!`);
  },

  pauseCallback({ url, index }) {
    console.log('pauseCallback');
  }
```
可以利用生命钩子和传回来的索引进行业务逻辑上的处理，**注意：如果使用到视频的方法，尽量使用配置上的方法。**

### 特别说明
本模块只是用了常规的es6写法，通过编译后理论上应该可以兼容大部分浏览器。未经测试兼容性，欢迎提bug。