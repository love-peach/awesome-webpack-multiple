const minimist = require('minimist'); // 命令行参数解析工具
const path = require('path');
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

console.log('\n 当前运行环境变量是：', commandLineParams.env, '\n');

module.exports = {
  mode: commandLineParams.env === 'production' ? 'production' : 'development',
  devtool: 'source-map',
  // mode: 'production',
  entry: projectConfig.entriesJs,
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: './js/[name].bundle.js?version=[hash:8]',
    publicPath: '',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
    alias: {
      api: path.resolve(__dirname, '../src/api/'),
      assets: path.resolve(__dirname, '../src/assets/'),
      styles: path.resolve(__dirname, '../src/styles/'),
      utils: path.resolve(__dirname, '../src/utils/'),
    },
  },
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    host: '0.0.0.0',
    port: '8090',
    open: true, // 开启浏览器
    hot: true, // 开启热更新
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
  plugins: pluginsConfig,
  module: {
    rules: rulesConfig,
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
