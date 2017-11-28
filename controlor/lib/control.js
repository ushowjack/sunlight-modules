'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function throttle(fn, interval) {
  var $self = fn,
      timer,
      firstTime = true;

  return function () {
    var args = arguments,
        $me = this;
    if (firstTime) {
      $self.apply($me, args);
      return firstTime = false;
    }
    if (timer) {
      return false;
    }
    timer = setTimeout(function () {
      clearTimeout(timer);
      timer = null;
      $self.apply($me, args);
    }, interval);
  };
}

var Controler = function () {
  function Controler() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var isThrottle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var interval = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 300;

    _classCallCheck(this, Controler);

    this.$options = {
      enter: 13,
      back: 27,
      ctrl: 17,
      left: 37,
      up: 38,
      right: 39,
      down: 40,
      '0': 48,
      '1': 49,
      '2': 50,
      '3': 51,
      '4': 52,
      '5': 53,
      '6': 54,
      '7': 55,
      '8': 56,
      '9': 57
    };

    for (var key in this.$options) {
      if (this.$options.hasOwnProperty(key)) {
        this.$options[this.$options[key]] = key;
        delete this.$options[key];
      }
    }

    this.$elList = [];

    this.$subscribeCenter = {};

    var keydownTrigger = this.keydownTrigger;
    if (isThrottle) {
      keydownTrigger = throttle(this.keydownTrigger, interval);
    }
    this.eventRecode = keydownTrigger.bind(this);

    this.addPress(options);
  }

  _createClass(Controler, [{
    key: 'isDom',
    value: function isDom(obj) {
      return (typeof HTMLElement === 'undefined' ? 'undefined' : _typeof(HTMLElement)) === 'object' ? obj instanceof HTMLElement : obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
    }
  }, {
    key: 'addPress',
    value: function addPress(options) {
      var _this = this;

      for (var key in this.$options) {
        if (options.hasOwnProperty(this.$options[key])) {
          delete this.$options[key];
        }
      }

      var _loop = function _loop(_key) {
        if (options.hasOwnProperty(_key)) {
          if (typeof options[_key] === 'number') {
            options[options[_key]] = _key;
          } else if (options[_key] instanceof Array) {
            options[_key].forEach(function (index) {
              _this.$options[index] = _key;
            });
          }
          delete options[_key];
        }
      };

      for (var _key in options) {
        _loop(_key);
      }

      this.$options = _extends({}, this.$options, options);

      return this.$options;
    }
  }, {
    key: 'delPress',
    value: function delPress() {
      var keyCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      for (var key in this.$options) {
        if (this.$options.hasOwnProperty(key) && ~keyCode.indexOf(this.$options[key])) {
          delete this.$options[key];
        }
      }
    }
  }, {
    key: 'event',
    value: function event(type, el, keyCode) {
      var evt = null;
      keyCode = keyCode ? keyCode : 'CustomEvent';

      try {
        evt = new window.CustomEvent(type, { detail: { keyCode: keyCode } });
      } catch (e) {
        evt = document.createEvent('Event');
        evt.initEvent(type, true, true);
      }

      el.dispatchEvent(evt);
    }
  }, {
    key: 'subscribe',
    value: function subscribe(type, callback) {
      !this.$subscribeCenter[type] ? this.$subscribeCenter[type] = [] : [];
      this.$subscribeCenter[type].push(callback);

      var unSubscribe = function unSubscribe() {
        this.$subscribeCenter[type].splice(this.$subscribeCenter[type].indexOf(callback), 1);
      }.bind(this);
      return unSubscribe;
    }
  }, {
    key: 'publish',
    value: function publish(type) {
      var _this2 = this;

      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      console.log(this.$subscribeCenter[type]);
      this.$subscribeCenter[type].forEach(function (fn) {
        fn.call(_this2, data);
      });
    }
  }, {
    key: 'addListener',
    value: function addListener(el) {
      this.$elList.push(el);
      document.removeEventListener('keydown', this.eventRecode);
      document.addEventListener('keydown', this.eventRecode, false);
    }
  }, {
    key: 'removeListener',
    value: function removeListener(el) {
      if (this.$elList.indexOf(el) === -1) return;
      this.$elList.splice(this.$elList.indexOf(el), 1);
    }
  }, {
    key: 'keydownTrigger',
    value: function keydownTrigger(evt) {
      var _this3 = this;

      var keyCode = evt.which || evt.keyCode;
      var el = evt.target;
      var type = this.$options[keyCode];
      if (!this.$options.hasOwnProperty(keyCode)) {
        console.warn('\u672A\u5B9A\u4E49\u8BE5\u952E: ' + keyCode);
        return false;
      }
      this.$elList.forEach(function (el) {
        _this3.event(type, el, keyCode);
      });
    }
  }]);

  return Controler;
}();

exports.default = Controler;