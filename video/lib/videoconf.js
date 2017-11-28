'use strict';

var videoconf = {
  statusCode: {
    stop: 2,
    play: 0,
    pause: 1
  },

  videoList: [],

  methods: {
    start: function start(_ref) {
      var url = _ref.url,
          index = _ref.index;

      console.log('[-------\u5F00\u59CB\u64AD\u653E || url:' + url + '!!]');
    },
    pause: function pause() {
      console.log('[-------\u6682\u505C\u64AD\u653E------!!]');
    },
    resume: function resume() {
      console.log('[-------\u6062\u590D\u64AD\u653E------!!]');
    },
    stop: function stop() {
      console.log('[-------\u505C\u6B62\u64AD\u653E------!!]');
    },
    getVideoStatus: function getVideoStatus() {
      return 2;
    },
    getVideoTotal: function getVideoTotal() {
      var time = 1;
      console.log('[-------\u83B7\u53D6\u65F6\u957F:' + time + '-----!!]');
      return time;
    },
    seek: function seek(time) {
      console.log('[-------\u8BBE\u7F6E\u8FDB\u5EA6:' + time + '-----!!]');
    },
    offsetChange: function offsetChange() {},
    setMute: function setMute(v) {
      console.log('[-------\u8BBE\u7F6E\u9759\u97F3------!!]');
    },
    getMute: function getMute() {
      console.log('[-------\u67E5\u8BE2\u9759\u97F3\u97F3\u91CF------!!]');
    },
    setVoice: function setVoice(v) {
      console.log('[-------\u8BBE\u7F6E\u97F3\u91CF------!!]');
    },
    getVoice: function getVoice() {
      console.log('[-------\u67E5\u8BE2\u97F3\u91CF------!!]');
    }
  },
  stopCallback: function stopCallback(_ref2) {
    var url = _ref2.url,
        index = _ref2.index;

    console.log('stopCallback');
    this.pause();
  },
  startCallback: function startCallback(_ref3) {
    var url = _ref3.url,
        index = _ref3.index;

    console.log('startCallback');
  },
  errorCallback: function errorCallback(_ref4) {
    var url = _ref4.url,
        index = _ref4.index;

    this.nextVideo();
    console.log('errorCallback', 'this is index[' + index + ']');
  },
  pauseCallback: function pauseCallback(_ref5) {
    var url = _ref5.url,
        index = _ref5.index;

    console.log('pauseCallback');
  }
};