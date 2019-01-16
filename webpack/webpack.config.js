const path = require('path');
const minimist = require('minimist'); // 命令行参数解析工具
const pluginsConfig = require('./webpack.plugins.js');
const rulesConfig = require('./webpack.rules.js');
const projectConfig = require('../config/index');

const minimistOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'development' },
};

// 解析命令行中的参数
// 为啥要slice(2)? 因为 前两项分别是 node 程序位置和 js 脚本位置
const commandLineParams = minimist(process.argv.slice(2), minimistOptions);
const isProEnv = commandLineParams.env === 'production';

module.exports = {
  mode: isProEnv ? 'production' : 'development',
  devtool: isProEnv ? 'source-map' : '#eval-source-map',
  entry: projectConfig.entriesJs,
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: isProEnv ? './js/[name].js?version=[hash:8]' : './js/[name].js',
    publicPath: '',
  },
  resolve: {
    // 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
    modules: [path.resolve(__dirname, '../node_modules')],
    // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件，使用 Tree Shaking 优化
    // 只采用 main 字段作为入口文件描述字段，以减少搜索步骤
    mainFields: ['jsnext:main', 'main'],
    extensions: ['.js', '.jsx', '.css'],
    alias: {
      api: path.resolve(__dirname, '../src/api/'),
      assets: path.resolve(__dirname, '../src/assets/'),
      styles: path.resolve(__dirname, '../src/styles/'),
      utils: path.resolve(__dirname, '../src/utils/'),
    },
  },
  plugins: pluginsConfig,
  module: {
    rules: rulesConfig,
  },
  watchOptions: {
    // 不监听的 node_modules 目录下的文件
    ignored: /node_modules/,
  },
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    host: '0.0.0.0',
    port: '8090',
    open: true, // 开启浏览器
    hot: true, // 开启热更新
    historyApiFallback: {
      rewrites: [
        { from: /^\/about/, to: '/about.html' },
        { from: /^\/big-wheel/, to: '/big-wheel.html' },
        // 其它的都返回 index.html
        { from: /./, to: '/index.html' },
      ],
    },
    proxy: {
      '/api': {
        target: 'https://api.apiopen.top/',
        pathRewrite: { '^/api': '' },
        changeOrigin: true,
      },
      '/err': {
        target: 'https://demo.com/',
        pathRewrite: { '^/err': '' },
        changeOrigin: true,
      },
    },
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'vendor',
          priority: 10,
          enforce: true,
        },
        // 这里定义的是在分离前被引用过两次的文件，将其一同打包到common.js中，最小为30K
        common: {
          name: 'common',
          minChunks: 2,
          minSize: 30000,
        },
      },
      chunks: 'all',
      minSize: 40000,
    },
  },
};
