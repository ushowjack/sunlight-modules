### 键盘事件模块

version: 1.0.1

#### 用途:
> *对键盘事件进行封装，提高可读性。*

#### 如何使用

你可以通过npm包获取：
```shell
  npm i keydownEvent
```
或者在html中引入
```html
  <script src="./control-script.js"></script>
```

**注意：**
**1. 所有通过本npm包所创建的自定义键盘事件都必须以`.press`结尾。**
**2. 本模块使用ES6语法，请使用babel编译。**

#### API

**实例化**

*实例化可以传入键值对，也可以不传参数默认为电脑端的键值对，但目前只有包括方向，数字键，enter和esc。*

**支持事件节流**
*参数 keyValue < Object > | isThrottle < Boolean | false > | interval < Number | 500 >*
```javascript
  const keyValue = {
    'enter': 17, 
    'up': 57
  }
  const controlor = new Controler(keyValue);
```

**addListener**

*绑定监听对象，**注意** keydown 事件绑定在document上，通过添加对象的监听才能使用自定义事件。可以对多个DOM元素绑定，但是一个DOM只能绑定一次。*

arguments | el
```javascript
  improt Controlor from 'keydownEvent';

  const controlor = new  Controlor();
  const BODY = document.querySelector('body');

  controlor.addListener(BODY);
```
**removeListener**

*删除DOM，从而监听对应的DOM元素上的键盘事件失效。*
***注意**：所有的绑定事件还是生效的。只是不会被触发。如果只是对自定义事件解绑，请使用原生解绑。*
```javascript
  const BODY = document.querySelector('body');
  controlor.removeListener(BODY);
```

**keydownTrigger**

*手动触发自定义事件方法*
***注意**：解绑过后的事件是无法被触发的，参数可以监听事件的名称也可以是键名。*
```javascript
  const BODY = document.querySelector('body');
  controlor.addListener(BODY);

  BODY.addEventListener('enter.press', ev => {
    console.log('this is body!');
  });
  
  // 可以是controlor.keydownTrigger('enter',BODY);
  controlor.keydownTrigger('enter.press',BODY);


```

**getElems**
*获取所有监听的DOM对象，返回一个DOM元素数组。*
```javascript
  controlor.getElems();
```
**getKeycode**
*获取所有键值对，返回一个 Object 。*
```javascript
  controlor.getKeycode();
```

#### demo

```javascript
  improt Controlor from 'keydownEvent';

  const keyOpts = {
    enter: 17 //实际是alt键
  } 

  const controlor1 = new Controlor(keyOpts);
  const BODY = document.querySelector('body');
  const HTML = document.querySelector('html');

  // 绑定多个元素，可以同时触发
  controlor1.addListener(BODY);
  controlor1.addListener(HTML);
  
  // 绑定多个自定义事件
  document.querySelector('body');
    .addEventListener('enter.press', ev => {
      console.log('this is body!');
    });
  document.querySelector('html');
  .addEventListener('down.press', function() {
      console.log('this is html!');
  });

  // 可以单独触发自定义事件
  controlor.keydownTrigger('down.press');

  // 设置全局事件节流
  const controlor2 = new Controlor(keyOpts, true, 300);
```



