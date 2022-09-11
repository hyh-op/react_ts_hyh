const path = require('path');
const { PROJECT_PATH, ISDEV } = require('../constants');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Webpackbar = require('webpackbar');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

//版本更替，这个最新版的写法不是这样，这里用的是4
//Downgrading Webpack to 4 and style-loader to 2 resolves it
//https://github.com/webpack-contrib/style-loader/issues/517
// webpack4 最后兼容的loader https://blog.arcto.me/frontend/webpack-4-loader/
const getCssLoaders = (importLoaders) => [
  ISDEV ? 'style-loader' : MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: {
      sourceMap: ISDEV, // 开启后与devtool设置一致
      importLoaders, // 指定在css-loader处理前使用的laoder数量
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      // 这里要注意配置是包裹在postcssOptions属性中
      postcssOptions: {
        ident: 'postcss',
        plugins: [
          // 修复一些和flex布局相关的bug
          require('postcss-flexbugs-fixes'),
          // 参考browserslist的浏览器兼容表自动对那些还不支持的css语法做转换
          require('postcss-preset-env')({
            // 自动添加浏览器前缀
            autoprefixer: {
              // will add prefixes only for final and IE versions of specification
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
          // 根据browserslist自动导入需要的normalize.css内容
          require('postcss-normalize'),
        ],
      },
      // 开启后与devtool设置一致
      sourceMap: ISDEV,
    },
  },
];

module.exports = {
  entry: {
    app: path.resolve(PROJECT_PATH, './src/index.tsx'),
  },
  output: {
    filename: `js/[name]${ISDEV ? '' : '.[hash:8]'}.js`,
    path: path.resolve(PROJECT_PATH, './dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: getCssLoaders(1),
      },
      {
        test: /\.less$/,
        use: [
          ...getCssLoaders(2),
          {
            loader: 'less-loader',
            options: {
              sourceMap: ISDEV, // 开启后与devtool设置一致
            },
          },
        ],
      },
      {
        test: /\.sass$/,
        use: [
          ...getCssLoaders(2),
          {
            loader: 'sass-loader',
            options: {
              sourceMap: ISDEV, // 开启后与devtool设置一致
            },
          },
        ],
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10 * 1024, // 图片低于10k会被转换成base64格式的dataUrl
              name: '[name].[contenthash:8].[ext]', // [hash]占位符和[contenthash]是相同的含义，都是表示文件内容的摘要值，默认是使用md5 hash算法
              outputPath: 'assets/imgaes', // 构建打包输出到出口文件夹的assets/images文件夹下
            },
          },
        ],
      },
      {
        test: /\.(ttf|woff|woff2|eot|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[contenthash:8].[ext]',
              outputPath: 'assets/fonts',
            },
          },
        ],
      },
      {
        test: /\.(tsx?|js)$/,
        loader: 'babel-loader',
        options: { cacheDirectory: true },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(PROJECT_PATH, './public/index.html'),
      filename: 'index.html',
      cache: false, // 防止之后使用v6版本的copy-webpack-plugin时，代码修改一刷新页面为空的问题发生
      minify: ISDEV
        ? false
        : {
            removeAttributeQuotes: true,
            collapseWhitespace: true,
            removeComments: true,
            collapseBooleanAttributes: true,
            collapseInlineTagWhitespace: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            minifyCSS: true,
            minifyJS: true,
            minifyURLs: true,
            useShortDoctype: true,
          },
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          context: path.resolve(PROJECT_PATH, './public'),
          from: '*',
          to: path.resolve(PROJECT_PATH, './dist'),
          toType: 'dir',
        },
      ],
    }),
    new Webpackbar({
      name: ISDEV ? '正在启动' : '正在构建打包',
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: path.resolve(PROJECT_PATH, './tsconfig.json'),
      },
    }),
    new HardSourceWebpackPlugin(),
    !ISDEV &&
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].css',
      }), // 判断生产环境下才使用mini-css-exract-plugin
  ].filter(Boolean),
  optimization: {
    minimize: !ISDEV,
    minimizer: [
      !ISDEV &&
        new TerserWebpackPlugin({
          extractComments: false,
          terserOptions: {
            compress: { pure_funcs: ['console.log'] },
          },
        }),
    ].filter(Boolean),
    splitChunks: {
      chunks: 'all',
      name: true,
    },
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'], // 经常被import的文件后缀放在前面
  },
};
