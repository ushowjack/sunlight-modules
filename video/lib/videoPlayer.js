'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VideoPlayer = function () {
  function VideoPlayer() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var isLoop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _classCallCheck(this, VideoPlayer);

    if (VideoPlayer.instance) {
      return this;
    } else {
      VideoPlayer.instance = this;
    }

    this.count = 0;
    this.$options = options;

    for (var key in options.methods) {
      if (options.methods.hasOwnProperty(key)) {
        this[key] = options.methods[key];
      }
    }

    for (var _key in options) {
      if (options.hasOwnProperty(_key) && _key !== 'methods') {
        this[_key] = options[_key];
      }
    }

    this.$isLoop = isLoop;

    this.statusCode = this.$statusCode = options.statusCode;

    this.$playStatus_old = this.$statusCode.stop;

    this.$videoList = [];
    this.$playVideo = '';
    this.$videoList_pre = [];
  }

  _createClass(VideoPlayer, [{
    key: 'addVedioList',
    value: function addVedioList() {
      var list = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var videoList = list.map(function (url, index) {
        return { url: url, index: index };
      });
      if (this.$videoList) {
        typeof this.$videoList === 'string' ? this.$videoList = [this.$videoList] : false;
      } else {
        this.$videoList = [];
      }
      this.$videoList = this.$videoList.concat(videoList);
      return this.$videoList;
    }
  }, {
    key: 'getVedioList',
    value: function getVedioList() {
      return this.$videoList;
    }
  }, {
    key: 'deleteVidioList',
    value: function deleteVidioList() {
      var delList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      this.$videoList = this.$videoList.filter(function (url) {
        if (~delList.indexOf(url.url)) return false;
        return url;
      });

      return this.$videoList;
    }
  }, {
    key: 'clearVidioList',
    value: function clearVidioList() {
      this.$videoList = [];
      return this.$videoList;
    }
  }, {
    key: 'getCurVideo',
    value: function getCurVideo() {
      return this.$curVideo;
    }
  }, {
    key: 'nextVideo',
    value: function nextVideo() {
      if (!this.$videoList.length) {
        console.warn('[ system ] 播放列表为空！！');
        return false;
      }

      if (this.$isLoop) {
        this.$curVideo && this.$videoList.push(this.$curVideo);
      } else {
        this.$curVideo && this.$videoList_pre.push(this.$curVideo);
      }

      this.$curVideo = this.$videoList.shift();
      this.start(this.$curVideo);

      return this.$videoList;
    }
  }, {
    key: 'preVideo',
    value: function preVideo() {
      console.warn('preVideo: this method is waiting for development!');
    }
  }, {
    key: 'init',
    value: function init() {
      var videoList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var isLoop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var interval = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 300;

      videoList = typeof videoList === 'string' ? [videoList] : videoList;
      this.addVedioList(videoList);
      this.$isLoop = isLoop;
      this.$interval = interval;
    }
  }, {
    key: 'play',
    value: function play() {
      var _this = this;

      this.nextVideo();
      this.$timer = setInterval(function () {
        _this.matchStatus();
      }, this.$interval);
    }
  }, {
    key: 'destroy',
    value: function destroy(callback) {
      this.$videoList = [];
      if (this.$over) return false;

      this.stop();
      this.$destroyCallback = function () {
        clearInterval(this.$timer);
        callback && callback.apply(this);
      }.bind(this);
    }
  }, {
    key: '$isError',
    value: function $isError() {
      typeof this.$errorCount === 'undefined' ? this.$errorCount = 0 : this.$errorCount++;
      if (this.$errorCount > 20 && this.$playStatus_old === this.$statusCode.stop) {
        this.$errorCount = 0;
        this.$errorCallback();
      }
    }
  }, {
    key: 'matchStatus',
    value: function matchStatus() {
      var newStatus = this.getVideoStatus();

      this.$isError();

      if (newStatus !== this.$playStatus_old) {
        this.errorCount = 0;

        this.triggleCallback(newStatus);
      } else {
        console.log('[u-video]:播放状态未改变！');
      }
    }
  }, {
    key: 'triggleCallback',
    value: function triggleCallback(newStatus) {
      if (this.$destroyCallback) {
        this.$destroyCallback();
        return false;
      }
      this.$playStatus_old = newStatus;

      switch (newStatus) {
        case this.$statusCode.stop:
          this.$stopCallback();
          break;
        case this.$statusCode.play:
          this.$startCallback();
          break;
        case this.$statusCode.pause:
          this.$pauseCallback();
          break;
        default:
          console.warn('\u83B7\u53D6\u72B6\u6001\u7801\u3010' + newStatus + '\u3011\u672A\u5B9A\u4E49\uFF01');
          break;
      }
    }
  }, {
    key: '$stopCallback',
    value: function $stopCallback() {
      if (this.$videoList.length) {
        this.nextVideo();
      } else {
        this.$over = true;
        clearInterval(this.$timer);
      }
      this.stopCallback(this.$curVideo);
    }
  }, {
    key: '$startCallback',
    value: function $startCallback() {
      this.startCallback(this.$curVideo);
    }
  }, {
    key: '$errorCallback',
    value: function $errorCallback() {
      if (this.$destroyCallback) {
        this.$destroyCallback();
        return false;
      }
      this.errorCallback(this.$curVideo);
    }
  }, {
    key: '$pauseCallback',
    value: function $pauseCallback() {
      this.pauseCallback(this.$curVideo);
    }
  }]);

  return VideoPlayer;
}();

exports.default = VideoPlayer;