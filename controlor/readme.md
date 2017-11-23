### 监听事件模块

version: 1.0.2

> *万物皆有变化，当发生变化时做相对应的动作，故为监听。在按键监听时才用一事件名对应多个 `keyCode`*
#### 用途:
> *对监听事件进行封装，提高可读性。在这主要先对订阅发布模式和键盘事件的封装。*

#### 如何使用

你可以通过npm包获取：
```bash
  npm install watch-event
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
```ES6
  const keyValue = {
    'enter': 17, 
    'up': 57
  }
  const controlor = new Controler(keyValue,true, 300);
```
**addPress**
*添加按键值，键名为事件名，键值为`keyCode`。事件名是为了监听所用。*

*arguments | Object*
```ES6
  controlor.addPress({'play': 10});
```
**delPress**
*删除事件名，参数是事件名数组。*

*arguments | Array*
```ES6
  controlor.delPress(['play']);
```

**subscribe**
*订阅事件，参数为事件名、回调函数，并且返回解绑函数。*
*arguments | String | Function*

```ES6
  // 之后会添加发布回来的消息 
  const unSubscribe = controlor.subscribe('play',()=>{
    console.log('play 发布了！')
  });

  // 解绑
  unSubscribe();
```
**publish**
*发布事件，参数为事件名。*
*arguments | String*

```ES6
  // 发布事件
  controlor. publish('play')
```

###### 思考：

> ***对于 keydown 事件而言，在工程实践中，我更倾向于把它理解成一个遥控器操作多个电器。***
>
> 一个房间可以有多个遥控器，红外线的或者是wifi的。即你可以通过不同的遥控器，来控制节奏，比如是否节流。
>
> 也可以把电器添加到遥控器的白名单，进行操作，当不想操控的时候直接移除，不论电器是否有接收的接口。比如视频和界面都添加了一个实例的左右键事件，当进入视频，界面解绑遥控器就算监听了事件，也无法触发。返回界面后视频亦然。
>
> 当然要注意不同的遥控器操作同一个接口要使用不同的事件名，不要因为相同的电器，相同的接口，不同的遥控器而导致误操作。推荐使用遥控器名作为后缀。

**addListener**

*arguments | el*

*绑定监听对象，**注意：** keydown 事件绑定在document上，而且实际上只绑定一次。原理是通过 keydown 事件的触发来遍历所有绑定好的DOM元素触发对应的事件。有点像 document 是信息集散地，addListener 即订阅数据。*

```ES6
  improt Controlor from 'keydownEvent';

  const controlor = new  Controlor();
  controlor.addListener(document.body);
```
**removeListener**

*arguments | el*

*删除DOM，从而监听对应的DOM元素上的键盘事件失效。*
***注意**：所有的绑定事件还是生效的。只是不会被触发。如果只是对自定义事件解绑，请使用原生解绑。*
```javascript
  controlor.removeListener(document.body);
```

**~~keydownTrigger~~ <sup>DEL</sup>**

*~~手动触发自定义事件方法~~*
~~***注意**：解绑过后的事件是无法被触发的，参数可以监听事件的名称也可以是键名。*~~
**说明：目前个人觉得有了发布订阅的 API，此 API 作用不大，转为模块内部自用。传参也变为传入事件 event 对象。如果真要使用请传入以下 JSON 对象作为参数：**

```ES6
// 传参对象
 const evt = {
   keyCode: 12, // 键值
   target: element, // DOM对象
   type: 'play' // 事件名
 }
```

```ES6
  controlor.addListener(document.body);

  document.body.addEventListener('play', ev => {
    console.log('this is body!');
  });

  const evt = {
    keyCode: 12, // 键值（可以忽略）
    target: document.body, // DOM对象
    type: 'play' // 事件名
  }

  controlor.keydownTrigger(evt);


```

**getElems**
*获取所有监听的DOM对象，返回一个DOM元素数组。*
```javascript
  controlor.getElems();
```
**getKeycode**
*获取所有键值对，返回一个 Object。*
```javascript
  controlor.getKeycode();
```

#### demo

```javascript
  improt Controlor from 'watch-event';

  const keyOpts = {
    enter: 17, // 实际是alt键
    RL: [37, 39] // RL即对应2个键值
  } 
  // 这里首先会覆盖掉 enter事件的13，然后再覆盖alt的事件名。
  // 遵循默认配置会被覆盖，一事件名对应多个键值的原则。
  const controlor = new Controlor(keyOpts);

  const play = document.querySelector('#videoPlayer');
  const main = document.querySelector('#main');
  
  // 每个DOM元素都使用原生监听自定义事件
  play.addEventListener('RL', ev => {
      if(ev.detail.keyCode === 37){
        console.log('this is Left!');
      }else {
        console.log('this is Right!');
      }
    });
    
  main.addEventListener('RL', ev => {
      console.log('this is html!');
  });

  // ...此处省略监听部分代码
  if(isVideo){

    // 是否为播放视频界面，如果是，移除main，遥控器只对play有效。
    controlor.removeListener(main);
    controlor.addListener(play);
  }else{
    controlor.addListener(main);
    controlor.removeListener(play);    
  }

  // 设置全局事件节流
  const controlor = new Controlor(keyOpts, true, 300);
```



