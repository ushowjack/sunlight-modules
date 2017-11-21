/**
 * @description 用于格式化所有的按键名称，只需要在配置文件中添加，可以监听所有的按键
 * @author USHOW JACK, EMAIL: ushowjack@GMail.com
 * @class Controler
 */

// 事件节流
function throttle(fn, interval) {
  var _self = fn, //保存需要被延迟执行的函数引用
    timer, //定时器
    firstTime = true; //是否第一次调用

  return function() { //返回一个函数，形成闭包，持久化变量
    var args = arguments, //缓存变量
      _me = this;
    if (firstTime) { //如果是第一次调用，不用延迟执行
      _self.apply(_me, args);
      return firstTime = false;
    }
    if (timer) { //如果定时器还在，说明上一次延迟执行还没有完成
      return false;
    }
    timer = setTimeout(function() { //延迟一段时间执行
      clearTimeout(timer);
      timer = null;
      _self.apply(_me, args);
    }, interval);
  };
}

class Controler {
  constructor(options = {}, isThrottle = false, interval = 300) {
    // PC默认键值
    this._options = {
      'enter': 13,
      'back': 27,
      'ctrl': 17,
      'left': 37,
      'up': 38,
      'right': 39,
      'down': 40,
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
    // keyName映射
    this.map = { ...this._options, ...options };
    this._options = {};
    // DOM列表
    this.elList = [];

    let keydownTrigger = this.keydownTrigger;
    if (isThrottle) {
      keydownTrigger = throttle(this.keydownTrigger, interval);
    }
    this.eventRecode = keydownTrigger.bind(this);

    for (const key in this.map) {
      if (options.hasOwnProperty(key)) {
        // 使用值索引键名
        this._options[options[key]] = key;
      } else if (!this._options[this.map[key]]) {
        this._options[this.map[key]] = key;
      }
    }
  }

  // 获取所有监听对象
  getElems() {
    return this.elList;
  }

  // 获取所有键值对
  getKeycode() {
    return this._options;
  }

  // 添加键盘监听事件
  addListener(el, callback) {
    this.removeListener.bind(this)(el);
    this.elList.push(el);
    document.addEventListener('keydown', this.eventRecode, false);
  }

  // 解绑键盘事件
  removeListener(el) {
    if (this.elList.indexOf(el) === -1) return;
    this.elList.splice(this.elList.indexOf(el), 1);
  }

  // 触发自定义事件器 可以手动触发
  keydownTrigger() {
    // 如果键盘触发参数为event
    // 如果手动触发参数为两个：keyName el
    if (typeof arguments[0] === 'object') {
      var keyCode = arguments[0].which || arguments[0].keyCode;
      console.log(keyCode)
      var keyName = this._options[keyCode];
    } else {
      var keyName = arguments[0];
      var el = arguments[1];
    }

    if (keyName) {
      // 第二参数可选 确保传入的是***.press
      this.press(`${keyName.replace('.press','')}.press`, keyCode || el);
    } else {
      console.warn(`[对应键值{${keyCode}}未定义：请先定义！]`)
    }
  }

  // 自定义事件
  press(keyName) {
    let evt = null;
    try {
      evt = new window.CustomEvent(keyName);
    } catch (e) {
      evt = document.createEvent('Event');
      evt.initEvent(keyName, true, true);
    }

    if (typeof arguments[1] === 'object' && typeof arguments[1] !== 'undefined') {
      const el = arguments[1];

      if (~this.elList.indexOf(el)) {
        el.dispatchEvent(evt);
      }
    } else if (typeof arguments[1] === 'undefined') {
      console.error(`[参数错误：请输入绑定DOM对象！]`);

    } else {
      this.elList.forEach(el => {
        el.dispatchEvent(evt);
      })
      const keyCode = arguments[1];
      const keyNameRaw = keyName.slice(0, keyName.indexOf('.'));
      console.log(`[键盘输出：'${keyNameRaw}'] [键值：'${this.map[keyNameRaw]}']`);
    }

  }

}
