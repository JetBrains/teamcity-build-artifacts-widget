const {join, resolve} = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const variables = require('@jetbrains/ring-ui/extract-css-vars');
const ringUiWebpackConfig = require('@jetbrains/ring-ui/webpack.config');

const pkgConfig = require('./package.json').config;

const componentsPath = join(__dirname, pkgConfig.components);

// Patch @jetbrains/ring-ui svg-sprite-loader config
ringUiWebpackConfig.loaders.svgSpriteLoader.include.push(
  require('@jetbrains/logos'),
  require('@jetbrains/icons')
);

const webpackConfig = () => ({
  entry: `${componentsPath}/app/app.js`,
  resolve: {
    mainFields: ['module', 'browser', 'main'],
    alias: {
      react: resolve('./node_modules/react'),
      'react-dom': resolve('./node_modules/react-dom'),
      '@jetbrains/ring-ui': resolve('./node_modules/@jetbrains/ring-ui')
    }
  },
  output: {
    path: resolve(__dirname, pkgConfig.dist),
    filename: '[name].js',
    publicPath: '',
    devtoolModuleFilenameTemplate: '/[absolute-resource-path]'
  },
  module: {
    rules: [
      ...ringUiWebpackConfig.config.module.rules,
      {
        test: /\.css$/,
        include: componentsPath,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]__[hash:base64:7]'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                ctx: {variables}
              }
            }
          }
        ]
      },
      {
        // Loaders for any other external packages styles
        test: /\.css$/,
        include: /node_modules/,
        exclude: ringUiWebpackConfig.componentsPath,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        include: [componentsPath],
        loader: 'babel-loader?cacheDirectory'
      },
      {
        test: /\.po$/,
        include: [
          componentsPath
        ],
        use: [
          'json-loader',
          {
            loader: 'angular-gettext-loader',
            options: {
              format: 'json'
            }
          }
        ]
      }
    ]
  },
  devServer: {
    // // Uncomment to enable https, set path to local https certificate
    // host: 'localhost',
    // port: 9010,
    // https: true,
    // key: fs.readFileSync('/Users/katriyna/localhost.key'),
    // cert: fs.readFileSync('/Users/katriyna/localhost.crt'),

    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    stats: {
      assets: false,
      children: false,
      chunks: false,
      hash: false,
      version: false
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'html-loader?interpolate!src/index.html'
    }),
    new CopyWebpackPlugin([
      'manifest.json'
    ], {})
  ]
});

module.exports = webpackConfig;
