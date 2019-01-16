/* eslint-disable global-require */
const path = require('path');
const webpack = require('webpack');
const minimist = require('minimist'); // 命令行参数解析工具

const HtmlWebpackPlugin = require('html-webpack-plugin');

const HappyPack = require('happypack');
// 构造出共享进程池，进程池中包含5个子进程
const happyThreadPool = HappyPack.ThreadPool({ size: 5 });

const OptimizeCss = require('optimize-css-assets-webpack-plugin');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');
const projectConfig = require('../config/index');

const minimistOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'development' },
};
const commandLineParams = minimist(process.argv.slice(2), minimistOptions);

const htmlPlugins = Object.entries(projectConfig.entriesHtml).map(item => (
  new HtmlWebpackPlugin({
    filename: `${item[0]}.html`,
    chunks: ['vendor', 'common', `${item[0]}`], // 按需引入对应名字的js文件 这里之所以会引入 'vendor', 'common' 是因为 optimization 的设置
    chunksSortMode: 'dependency', // 按 dependency 的顺序引入
    inject: true,
    hash: true,
    template: `${item[1]}`,
    favicon: path.resolve(__dirname, '../src/assets/favicon.ico'),
    projectEnv: commandLineParams.env,
    minify: { // 压缩配置
      removeComments: true, // 删除html中的注释代码
      collapseWhitespace: true, // 删除html中的空白符
      removeAttributeQuotes: true, // 删除html元素中属性的引号
    },
    meta: {
      // charset: 'UTF-8',
      // viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
      // 'X-UA-Compatible': 'ie=edge',
    },
  })
));

module.exports = [
  new webpack.HotModuleReplacementPlugin(),
  ...htmlPlugins,
  new HappyPack({
    // 用 id 来标识 happypack 处理那里类文件
    id: 'babel',
    // 如何处理  用法和loader 的配置一样
    loaders: [{
      loader: 'babel-loader',
      options: {
        // 这是 babel-loader 给 webpack 使用的一个属性，而不是 babel。
        // 被转换的结果将会被缓存起来，当webpack再次编译时，将会首先尝试从缓存中读取转换结果，以此避免资源浪费
        cacheDirectory: true,
        // Babel 变换输出 使不使用 Gzip 压缩
        cacheCompression: false,
      },
    }],
    // 共享进程池
    threadPool: happyThreadPool,
    // 允许 HappyPack 输出日志
    verbose: true,
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(commandLineParams.env),
    },
  }),
  new OptimizeCss({
    cssProcessor: require('cssnano'), // 引入cssnano配置压缩选项
    cssProcessorOptions: {
      discardComments: { removeAll: true },
    },
    canPrint: true, // 是否将插件信息打印到控制台
  }),
  new ExtractTextPlugin('css/[name].css?version=[hash:8]'),
  // 开启 Scope Hoisting
  new ModuleConcatenationPlugin(),
];
