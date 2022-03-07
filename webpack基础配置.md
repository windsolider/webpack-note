# webpack基础配置

## 环境说明
- "css-loader": "^5.0.0"
- "html-webpack-plugin": "^4.5.0"
- "style-loader": "^2.0.0"
- "webpack": "^4.46.0"
- "webpack-cli": "^4.9.2"
- "copy-webpack-plugin": "^5.0.0

## 入口(entry)
- 指定入口文件的路径
```javascript
module.exports = {
    entry: "./src/index.js",
};
```
```javascript
module.exports = {
    entry: {
        main: "./src/index.js"
    },
};
```

## 出口(output)
- 指定文件的输出名、路径
```javascript
const path = require('path');
module.exports = {
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: "[name].js",
      chunkFilename: "[name].js"
    }
};
```


## 插件(plugin)
- 扩展插件，在webpack构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要的事情。
- 插件分为两种，一种是webpack自身拥有的，可以通过webpack直接调用，一种是第三方，需要安装对应的npm包

### 生成一个html文件，在body中使用script标签引入你所有webpack生成的bundle

```bash
npm i html-webpack-plugin --save-dev
```
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "main.js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ]
};
```

### 拷贝静态文件

有些时候在打包时希望将一些静态资源文件进行拷贝,可以使用`copy-webpack-plugin`


```bash
npm i copy-webpack-plugin --save-dev
```

```javascript
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
    plugins: [
        new CopyWebpackPlugin([
            {from:path.resolve(__dirname, './public'),to:path.resolve(__dirname, './dist')},
        ])
    ]
};
```

## loader

### 作用
- 主要用于把模块原内容按照需求转换成新内容，可以加载非js模块。
- 通过使用不同的loader，webpack可以把不同的文件都转成js文件。  

### 配置规则
- test：匹配处理文件的扩展名的正则表达式
- use：loader名称，就是你要使用模块的名称
- include/exclude:手动指定必须处理的文件夹或屏蔽不需要处理的文件夹，二者同时使用时候exclude的优先级高于include
- options:为loaders提供额外的设置选项

### 解析顺序
 默认loader的顺序是**从下到上**、**从右向左**执行，当然执行顺序也可以手动定义的。

### css文件处理


```bash
npm install style-loader css-loader --save-dev
```

```javascript
module: {
  rules: [
    {
       test: /\.css$/,
       use: ["style-loader", "css-loader"]
    }
  ]
}
```

### css预处理器文件处理
不同的css预处理器要安装不同的loader来进行解析
- sass: sass-loader node-sass
- less: less-loader less
- stylus: stylus-loader stylus
```bash
npm install less-loader less --save-dev
npm install style-loader css-loader --save-dev
npm install stylus-loader stylus --save-dev
```

```javascript
{
    test:/\.scss$/,
    use:[
        'style-loader',
        "css-loader",
        "sass-loader"
    ]
}
```

### 图片文件处理

```bash
npm install file-loader --save-dev
npm install url-loader --save-dev
```
- 使用[file-loader](https://github.com/webpack-contrib/file-loader)，会将图片进行打包，并将打包后的路径返回。
```javascript
{
    test:/\.jpe?g|png|gif/,
    use:{
        loader:'file-loader',
        options:{
            name:`img/[name].[ext]`
        }
    }
}
```

- 使用[url-loader](https://github.com/webpack-contrib/url-loader)将满足条件的图片转化成base64，不满足条件的[url-loader](https://github.com/webpack-contrib/url-loader)会自动调用用[file-loader](https://github.com/webpack-contrib/file-loader)来进行处理。

```javascript
{
    test:/\.jpe?g|png|gif/,
    use:{
        loader:'url-loader',
        options:{
            limit:100*1024,
            name:`img/[name].[ext]`
        }
    }
}
```

### icon文件处理

```javascript
{
    test:/woff|ttf|eot|svg|otf/,
    use:{
        loader:'file-loader'
    }
}
```


### js文件处理


```bash
npm install @babel/core @babel/preset-env babel-loader --save-dev
```

`@babel/core`是babel中的核心模块，`@babel/preset-env` 的作用是es6转化es5插件的插件集合，`babel-loader`是`webpack`和`loader`的桥梁。



将babel相关配置从package.json抽离出来,增加`babel`的配置文件 `.babelrc或者babel.config.js`

```json
{
    "presets": [
       ["@babel/preset-env"]
    ]
}
```

```javascript
module: {
  rules: [{ test: /\.js$/, use: "babel-loader" }]
},
```

### vue文件处理

```bash
npm install vue-loader  vue-template-compiler --save-dev
```

```javascript
{
    test:/\.vue$/,
    use:'vue-loader'
}
```

## 模式(mode)

## eslint

```bash
npm install eslint eslint-loader --save-dev

```
将eslint相关配置从package.json抽离，增加eslint的配置文件eslint.config.js

```javascript
{
    test:/\.js/,
    enforce:'pre',
    use:'eslint-loader'
},
```

> 配置[eslint-loader](https://github.com/webpack-contrib/eslint-loader)可以实时校验js文件的正确性,`pre`表示在所有`loader`执行前执行

## resolve解析
想实现使用require或是import的时候,可以自动尝试添加扩展名进行匹配

```javascript
resolve: {
    extensions: [".js", ".jsx", ".json", ".css", ".ts", ".tsx", ".vue"]
},
```


## 配置代理

```javascript
proxy: {
    '/api': {
      target: 'http://localhost:4000',
    },
}
```