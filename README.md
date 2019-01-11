# awesome-webpack-multiple

这是一个使用 `webpack4` 来构建前端工作流的多页面项目。目的是搭建一个综合，高效，简介的 webpack 多页面模板。

## TODO

- [x] 区分环境
- [x] webpack 配置
- [x] 字体图标
- [x] axios
- [x] onerror
- [x] eslint
- [x] 本地缓存封装

## 目录介绍

```sh
.
├── README.md
├── config/
├── dist/
├── errorServer/
├── package-lock.json
├── package.json
├── src/
├── webpack/
└── yarn.lock
```

```sh
src
├── api/
│   ├── api.js
│   ├── request.js
│   └── show-tips.js
├── assets/
│   ├── favicon.ico
│   ├── fonts/
│   └── images/
├── lib/
│   ├── axios.min.js
│   ├── vue.min.js
│   └── zepto.min.js
├── pages/
│   ├── about/
│   ├── big-wheel/
│   └── index/
├── styles/
│   ├── base/
│   ├── demo.css
│   ├── framework/
│   ├── index.scss
│   ├── modules/
│   └── vendor/
└── utils/
    ├── common.js
    ├── flexable.js
    └── windowOnError.js
```

```sh
dist
├── assets/
├── css/
├── js/
├── about.html
├── big-wheel.html
├── index.html
└── favicon.ico
```

## 备注

### 出口

`output.path` 必须为一个绝对路径。

### html-loader 与 HtmlWebpackPlugin

现象，当同时使用了`html-loader` 与 `HtmlWebpackPlugin` 插件后，html 中的 ejs 模板语法使用不了了。原因是：当 `HtmlWebpackPlugin` 检查到 html 有其他 loader 处理，就不再使用 `lodash.template` 去编译目标，直接返回 `source`。

其中一个解决办法是：

1、使用不同的后缀名，使其不被其他loader处理, 比如ejs, tpl,等等

2、html-loader 添加 exclude:[], 将入口模板排除掉。

## 问题

### 安装问题

我们在安装一些 npm 包的时候，经常看到这样的命令 `npm i xxx -S` 或者 `npm i xxx -D`。那么，`-S`，`-D` 代表什么意思呢。

我们在使用 `npm install` 安装模块或插件的时候，有两种命令把他们写入到 `package.json` 文件里面去：`--save-dev`，`--save`，分别可缩写成 `-D` 和 `-S`

在 `package.json` 文件中，能看到的区别是：

使用 `--save-dev` 安装的插件，会被写入到 `devDependencies` 对象中去；

使用 `--save` 安装的插件，会被写入到 `dependencies` 对象中去。

----

那么 `devDependencies` 与 `dependencies` 有什么区别呢。

`devDependencies` 里面的插件只用于开发环境，不用于生产环境，

`dependencies` 是需要发布到生产环境的。

举个栗子：比如你开发一个前端项目，需要用到 `webpack` 来压缩代码，打包文件，这只是在开发，或者构建 build 的时候用到，项目实际运行的时候并不需要，所以放到 `devDependencies` 就可以了。

再比如，你引用了一个 UI 库，`element-ui`，生产环境运行项目的时候，肯定会用到它，所以需要放在 `dependencies`。

### 路径问题

`./`：会返回你执行 node 命令的路径，工作路径。(`process.cwd()`)

`__dirname`：总是指向被执行 js 文件的绝对路径。

假设，你有这样的目录结构：

```sh
.
└── webpack/
    └── config/
        └──index.js
```

`index.js` 文件长这样：

```js
var path = require("path");
console.log(". = %s", path.resolve("."));
console.log("__dirname = %s", path.resolve(__dirname));
```

**情况一** 你执行了下面的命令：

```sh
cd webpack/config/
node index.js
```

你将看到：

```sh
. = /awesome-webpack-multiple/webpack/config

__dirname = /awesome-webpack-multiple/webpack/config
```

`.` 是你的工作目录，`__dirname` 是 `index.js` 文件的路径。

**情况二** 你执行了下面的命令：

```sh
cd webpack/
node config/index.js
```

你将看到：

```sh
. = /awesome-webpack-multiple/webpack

__dirname = /awesome-webpack-multiple/webpack/config
```

**总结：** `.` 是你的工作目录，你 `cd` 到哪，它就是哪，`__dirname` 是文件的绝对路径，不管你在哪，它是不变的。在配置的时候，这一这两点区别，选择不同的路径。

### 导出问题

- exports
- module.exports
- export
- export default

首先，他们都是导出模块的，

然后，将这些方法分下类别：

`exports` `module.exports` 是 `Node.js` 给每个 js 文件内置的两个对象。一般通过 `require` 导入其中的模块。

`export` `export default` 是 `ES6` 的模块规范中的两个命令。一般通过 `import` 导入其中的模块。

那么，可以按照类别将它们进行对比，就可以弄懂它们了。

#### exports 与 module.exports 的区别

前面，已经讲过，`exports` `module.exports` 是 `Node.js` 给每个 js 文件内置的两个对象。我们可以将这两个对象打印出来，看看它们到底是啥。

```js
console.log(exports)
console.log(module.exports)
console.log(exports === module.exports);
```

得到以下结果

```sh
{}
{}
true
```

可以看到，一开始，`exports` 和 `module.exports` 一开始都是一个空对象 `{}`，并且它们是等价的。相当于在，文件的最开头加了这么一句 `var exports = module.exports;` 。实际上，这两个对象指向同一块内存，因此全等（前提是：不去改变它们指向的内存地址）。

因此，下面这种写法是等价的

```js
exports.age = 18;
module.exports.age = 18;
```

都相当于，给一开始的空对象 `{}`，添加一个属性，`require` 得到的就是 `{age: 18}`。

**但是**，`require` 引入的对象本质上是 `module.exports`。

这样就产生一个问题，`exports`  和 `module.exports` 指向的不是同一块内存时，`exports` 的内容就会失效。（也就是改变它们指向的内存地址，会导致 `exports` 的内容失效）。

看下面的例子：

```js
exports = {name: '小明'};

module.exports = {name: '小红'};
```

这时，`exports` 指向了一块内容为 `{name: '小明'}` 的内存，而 `module.exports` 指向了一块内容为 `{name: '小红'}` 的内存。`require` 得到的是 `{name: '小红'}`。

所以，不能直接将 `exports` 或 `module.exports` 直接指向一个值，这样，就切断了 `exports` 与 `module.exports` 的联系

#### export 与 export default 的区别

`export` 与 `export default` 都可以将 常量、函数、文件、木块等导出，只是，在导出的时候有一点区别，因此，在导入的时候需要用不同的方式导入。(带 `{}` 导入，与不带 `{}` 导入)

`export` 可以有多个，导入的时候要加 `{}`。

`export default` 只能有一个，导入的时候不用加 `{}`。

 **写法**

```js
// 写法一
export var a = 1;

// // 写法二
var b = 2;
export {b};

// 写法三
var some = 3;
export {some as c};

export default 4;
```

```js
import { a, b, c } from './utils/common';
import common from './utils/common';

console.log('a：', a);
console.log('b：', b);
console.log('c：', c);
console.log('common：', common);
```

输出是：

```sh
a： 1
b： 2
c： 3
common: 4
```

```js
// common.js
var some = 3;
export {some as default};
// 等同于
// export default some;

// index.js
import { default as xxx } from './utils/common';
console.log('xxx：'，xxx);
// 等同于
// import xxx from './utils/common';
```

#### 联系

**导出时**

`export` 相当于把对象添加到 `module` 的 `exports` 中。

`export default` 相当于把对象添加到 `module` 的 `exports` 中，并且对象的 key 叫 `default`。

**导入时**

不带 `{}` 的导入：本质上就是导入exports中的default属性（注：如果default属性不存在，则导入exports对象）。

带 `{}` 的导入：本质上按照属性 key 值导入 `exports` 中对应的属性值。

## loader

`happyBabel` 处理 js 单线程的问题，启用多进程处理多个任务。

### 处理js

安装 `babel-loader`，`@babel/core` 插件

`babel-loader` 配置 `cacheDirectory=true` 被转换的结果将会被缓存起来，当webpack再次编译时，将会首先尝试从缓存中读取转换结果，以此避免资源浪费。

官方给的提示如下：

```js
// This is a feature of `babel-loader` for webpack (not Babel itself).
// It enables caching results in ./node_modules/.cache/babel-loader/
// directory for faster rebuilds.
```

## 错误监控

思路：利用 `source-map` 插件，传入错误文件，行号，列号等信息，可以映射到源码中的位置，从而实现，线上压缩代码报错，在源码中排查的目的。

首先，监听 window.onerror 事件，发生错误，会自动 发送 post 请求 `http://localhost:8001/errorReport`，参数 就是 onerror事件的参数。

```js
window.onerror = function(message, source, lineno, colno, error) { 
  if (XMLHttpRequest) {
    var params = {
      message: message,
      source: source,
      lineno: lineno,
      colno: colno,
      stack: error && error.stack ? error.stack : null
    };
    var xhr = new XMLHttpRequest();
    xhr.open('post', 'http://localhost:8001/errorReport', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(params));
  }
}
```

然后，我们可以在本地起个服务，来将错误信息，解析出来，给出源码的位置信息。

```js
app.post('/errorReport', function (req, res) {
  let {source, lineno, colno, message, stack} = req.body;
  const sourceMapFile = resolve('../dist/' + url.parse(source).pathname + '.map');
  console.log(sourceMapFile, 'sourceMapFile');

  const rawSourceMap = JSON.parse(fs.readFileSync(sourceMapFile, 'utf8'));

  sourceMap.SourceMapConsumer.with(rawSourceMap, null, consumer => {
    const pos = consumer.originalPositionFor({
      line: lineno,
      column: colno
    });

    console.log(pos);
    res.json({
      code: 200,
      data: {
        ...pos,
        message,
        stack,
      },
      message: '解析成功！'
    });
  });
});
```

具体代码请看，`utils/windowOnError.js` 和 `errorServe./app.js`

## 参考

https://www.jianshu.com/p/beafd9ac9656

http://es6.ruanyifeng.com/#docs/module#export-default-%E5%91%BD%E4%BB%A4