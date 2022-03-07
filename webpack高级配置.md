# webpack高级配置

## devtool 增加映射文件，可以帮我们调试原文件
- eval 生成代码 每个模块都被eval执行,每一个打包后的模块后面都增加了包含sourceURL
- source-map 单独生成一个sourcemap文件，大而全
- eval-source-map
不会单独生成一个sourcemap文件，会打包到生成的chunk文件中
- inline 不会生成独立的 .map文件,会以dataURL形式插入
- cheap 忽略打包后的列信息，不使用loader中的sourcemap
- module 没有列信息，使用loader中的sourcemap(没有列信息)

```javascript
devtool:'cheap-module-eval-source-map'
```

> 每个库中采用的`sourcemap`方式不一,可以根据自己的需要自行配置

## 删除无用的css样式
无用的css样式指你的css文件中编写了一些id、类名下的css规则，但是你的template压根就没有这些id、class的引用。


```javascript
const glob = require('glob');
const PurgecssPlugin = require('purgecss-webpack-plugin');

// 需要配合mini-css-extract-plugin插件
new PurgecssPlugin({
  paths: glob.sync(`${path.join(__dirname, "src")}/**/*`, { nodir: true }) // 不匹配目录，只匹配文件
}),
```

## 压缩图片

```
npm install image-webpack-loader --save-dev
```

在file-loader之前使用压缩图片插件
```javascript
loader: "image-webpack-loader",
options: {
  mozjpeg: {
    progressive: true,
    quality: 65
  },
  // optipng.enabled: false will disable optipng
  optipng: {
    enabled: false,
  },
  pngquant: {
    quality: [0.90, 0.95],
    speed: 4
  },
  gifsicle: {
    interlaced: false,
  },
  // the webp option will enable WEBP
  webp: {
    quality: 75
  }
}
```

## 给动态引入的文件增加名字

```javascript
output:{
  chunkFilename:'[name].[contenthash:8].js'
}
import(/* webpackChunkName: "video" */ './video').then(res=>{
    console.log(res.default);
})
```
