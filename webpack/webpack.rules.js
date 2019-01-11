/* eslint-disable global-require */
const extractTextPlugin = require('extract-text-webpack-plugin');

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    {
      loader: 'css-loader',
      options: cssOptions,
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        ident: 'postcss',
        plugins: () => [
          // require('postcss-plugin-px2rem')({ rootValue: 100 }),
          require('postcss-flexbugs-fixes'),
          require('autoprefixer')({
            browsers: ['ie>=8', '>1% in CN', 'iOS >= 8', 'Android >= 4'],
          }),
        ],
      },
    },
  ];
  if (preProcessor) {
    loaders.push({
      loader: preProcessor,
    });
    if (preProcessor === 'sass-loader') {
      loaders.push({
        loader: 'sass-resources-loader',
        options: {
          resources: './src/styles/base/index.scss',
        },
      });
    }
  }
  return loaders;
};

module.exports = [
  /* 处理 js */
  {
    test: /\.js$/,
    // 将对 .js 文件的处理转交给 id 为 babel 的 HappyPack 的实列
    use: ['happypack/loader?id=babel'],
    exclude: '/node_modules/', // 不检查node_modules下的js文件
  },
  /* 处理 css */
  {
    test: /\.css$/,
    use: extractTextPlugin.extract({
      fallback: 'style-loader',
      use: getStyleLoaders({
        importLoaders: 1,
      }),
      publicPath: '../',
    }),
  },
  /* 处理 sass */
  {
    test: /\.(scss|sass)$/,
    use: extractTextPlugin.extract({
      fallback: 'style-loader',
      use: getStyleLoaders({
        importLoaders: 2,
      }, 'sass-loader'),
    }),
  },
  /* 处理 图片 */
  {
    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    loader: 'url-loader',
    query: {
      limit: 10240,
      name: '[name].[ext]?version=[hash:8]"',
      outputPath: 'assets/images/',
      publicPath: '/assets/images/',
    },
  },
  /* 处理 字体 */
  {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 102400,
      name: '[name].[ext]?version=[hash:7]',
      outputPath: 'assets/fonts/',
    },
  },
];
