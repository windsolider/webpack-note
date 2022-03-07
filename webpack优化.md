# webpack各种优化



## CDN加载文件
我们希望通过cdn的方式引入资源
```javascript
const AddAssetHtmlCdnPlugin = require('add-asset-html-cdn-webpack-plugin')
new AddAssetHtmlCdnPlugin(true,{
    'jquery':'https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js'
})
```

但是在代码中还希望引入`jquery`来获得提示
```javascript
import $ from 'jquery'
console.log('$',$)
```

但是打包时依然会将`jquery`进行打包
```javascript
externals:{
  'jquery':'$'
}
```

在配置文件中标注`jquery`是外部的，这样打包时就不会将jquery进行打包了

## 打包文件分析工具

```bash
npm install webpack-bundle-analyzer --save-dev 
```

```javascript
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
new BundleAnalyzerPlugin()
```


## splitChunks
我们在来看下SplitChunks这个配置，他可以在编译时抽离第三方模块、公共模块

默认配置在此
```javascript
splitChunks: {
  chunks: 'async', // 分割异步模块
  minSize: 30000, // 分割的文件最小大小
  maxSize: 0, 
  minChunks: 1, // 引用次数
  maxAsyncRequests: 5, // 最大异步请求数
  maxInitialRequests: 3, // 最大初始化请求数
  automaticNameDelimiter: '~', // 抽离的命名分隔符
  automaticNameMaxLength: 30, // 名字最大长度
  name: true,
  cacheGroups: { // 缓存组
    vendors: { // 先抽离第三方
      test: /[\\/]node_modules[\\/]/,
      priority: -10
    },
    default: { 
      minChunks: 2,
      priority: -20, // 优先级
      reuseExistingChunk: true
    }
  }
}
```

> 我们将`async`改为`initial`

![](http://img.fullstackjavascript.cn/analyze-2.png)

我们在为每个文件动态导入`lodash`库,并且改成`async`
```javascript
import('lodash')
```

![](http://img.fullstackjavascript.cn/analyze-3.png)

> 为每个入口引入`c.js`,并且改造配置文件

```javascript
splitChunks: {
  chunks: 'all',
  name: true,
  cacheGroups: {
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      priority: -10
    },
    default: {
      minSize:1, // 不是第三方模块，被引入两次也会被抽离
      minChunks: 2,
      priority: -20,
    }
  }
}
```
![](http://img.fullstackjavascript.cn/analyze-4.png)

> 这样再反过来看`chunks`的参数是不是就了然于胸啦！


## IgnorePlugin

```javascript
new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
```
## 费时分析
可以计算每一步执行的运行速度
```javascript
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
const smw = new SpeedMeasureWebpackPlugin();
  module.exports =smw.wrap({
});
```

## noParse
忽略 `import`和`require`语法
`module.noParse`，对类似jq这类依赖库，内部不会引用其他库，我们在打包的时候就没有必要去解析，这样能够增加打包速率
```javascript
noParse:/jquery/
```
## resolve 
```javascript
resolve: {
  extensions: [".js",".jsx",".json",".css"],
  alias:{},
  modules:['node_modules']
},
```
## include/exclude
在使用`loader`时,可以指定哪些文件不通过`loader`,或者指定哪些文件通过`loader`
```javascript
{
  test: /\.js$/,
  use: "babel-loader",
  // include:path.resolve(__dirname,'src'),
  exclude:/node_modules/
},
```
## happypack
多线程打包，我们可以将不同的逻辑交给不同的线程来处理
```bash
npm install --save-dev happypack
```

```javascript
const HappyPack = require('happypack');
rules:[
  {
    test: /\.js$/,
    use: 'happypack/loader?id=jsx'
  },

  {
    test: /\.less$/,
    use: 'happypack/loader?id=styles'
  },
]
new HappyPack({
  id: 'jsx',
  threads: 4,
  loaders: [ 'babel-loader' ]
}),

new HappyPack({
  id: 'styles',
  threads: 2,
  loaders: [ 'style-loader', 'css-loader', 'less-loader' ]
})
```