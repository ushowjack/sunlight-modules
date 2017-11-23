/**
 * @description 事件节流
 * @author USHOW JACK, EMAIL: ushowjack@GMail.com
 * @param {any} fn 
 * @param {any} interval 
 * @returns 
 */
function throttle(fn, interval) {
  var $self = fn, //保存需要被延迟执行的函数引用
    timer, //定时器
    firstTime = true; //是否第一次调用

  return function() { //返回一个函数，形成闭包，持久化变量
    var args = arguments, //缓存变量
      $me = this;
    if (firstTime) { //如果是第一次调用，不用延迟执行
      $self.apply($me, args);
      return firstTime = false;
    }
    if (timer) { //如果定时器还在，说明上一次延迟执行还没有完成
      return false;
    }
    timer = setTimeout(function() { //延迟一段时间执行
      clearTimeout(timer);
      timer = null;
      $self.apply($me, args);
    }, interval);
  };
}

class Controler {
  constructor(options = {}, isThrottle = false, interval = 300) {

    // PC默认键值
    this.$options = {
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

    // TODO: 如果键值和键名重复就存在bug
    for (const key in this.$options) {
      if (this.$options.hasOwnProperty(key)) {
        this.$options[this.$options[key]] = key;
        delete this.$options[key];
      }
    }

    // DOM列表
    this.$elList = [];

    // 创建一个DOM
    this.$outDocDom = document.createElement('div');

    let keydownTrigger = this.keydownTrigger;
    if (isThrottle) {
      keydownTrigger = throttle(this.keydownTrigger, interval);
    }
    this.eventRecode = keydownTrigger.bind(this);

    this.addPress(options);
  }

  // ------------------- 按键处理 --------------------- //

  /**
   * @description 添加按键、一个事件名对应多个code
   * @author USHOW JACK, EMAIL: ushowjack@GMail.com
   * @param {Object} options 
   * @memberof Controler
   */
  addPress(options) {
    // 删除重复按键事件名
    for (const key in this.$options) {
      if (options.hasOwnProperty(this.$options[key])) {
        delete this.$options[key];
      }
    }

    // 翻转参数
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        if (typeof options[key] === 'number') {
          options[options[key]] = key;
        } else if (options[key] instanceof Array) {
          options[key].forEach(index => {
            this.$options[index] = key;
          })
        }
        delete options[key];
      }
    }

    // 合并事件，一个事件对应多个keyCode
    this.$options = { ...this.$options, ...options };

    return this.$options;

  }

  /**
   * @description 删除事件值，传入事件名即可
   * @author USHOW JACK, EMAIL: ushowjack@GMail.com
   * @param {any} [keyCode=[]] 
   * @memberof Controler
   */
  delPress(keyCode = []) {
    for (const key in this.$options) {
      if (this.$options.hasOwnProperty(key) && ~keyCode.indexOf(this.$options[key])) {
        delete this.$options[key];
      }
    }
  }

  // ------------------- 事件处理 --------------------- //

  event(type, el, keyCode) {
    let evt = null;
    keyCode = keyCode ? keyCode : 'CustomEvent';

    try {
      evt = new window.CustomEvent(type, { detail: { keyCode } });
    } catch (e) {
      evt = document.createEvent('Event');
      evt.initEvent(type, true, true);
    }

    el ? el.dispatchEvent(evt) : this.$outDocDom.dispatchEvent(evt);
  }

  // ------------------- 监听处理 --------------------- //

  /**
   * @description 订阅事件
   * @author USHOW JACK, EMAIL: ushowjack@GMail.com
   * @param {any} type 
   * @param {any} callback 
   * @returns 
   * @memberof Controler
   */
  subscribe(type, callback) {
    this.$outDocDom.addEventListener(type, callback, false);

    const unSubscribe = function unSubscribe() {
      this.$outDocDom.removeEventListener(type, callback);
    }.bind(this);
    return unSubscribe;
  }

  /**
   * @description 发布事件
   * @author USHOW JACK, EMAIL: ushowjack@GMail.com
   * @param {any} type 
   * @memberof Controler
   */
  publish(type) {
    this.event(type);
  }

  // 添加按键事件
  addListener(el) {
    this.$elList.push(el);
    document.removeEventListener('keydown', this.eventRecode);
    document.addEventListener('keydown', this.eventRecode, false);
  }

  // 解绑键盘事件
  removeListener(el) {
    if (this.$elList.indexOf(el) === -1) return;
    this.$elList.splice(this.$elList.indexOf(el), 1);
  }

  // 触发自定义事件器 可以手动触发
  keydownTrigger(evt) {
    const keyCode = evt.which || evt.keyCode;
    const el = evt.target;
    const type = this.$options[keyCode];
    if (!this.$options.hasOwnProperty(keyCode)) {
      console.warn(`未定义该键: ${keyCode}`);
      return false;
    }
    this.$elList.forEach(el => {
      this.event(type, el, keyCode);
    })
  }
}
