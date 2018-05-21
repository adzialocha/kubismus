const path = require('path');
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pkg = require('./package.json');

function getPath(filePath) {
  return path.resolve(__dirname, filePath);
}

const ASSETS_NAME = 'app';
const ASSETS_PATH = getPath('src');

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';

  return {
    entry: getPath(`${ASSETS_PATH}/scripts/index.js`),
    output: {
      filename: `${ASSETS_NAME}.js`,
      path: getPath('./dist'),
    },
    resolve: {
      modules: [
        ASSETS_PATH,
        'node_modules',
      ],
      alias: {
        'osc-js': getPath('./node_modules/osc-js/lib/osc.browser.js'),
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          enforce: 'pre',
          loader: 'eslint-loader',
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  minimize: isProduction,
                },
              },
              {
                loader: 'postcss-loader',
              },
              {
                loader: 'sass-loader',
                options: {
                  indentedSyntax: false,
                  includePaths: [
                    ASSETS_PATH,
                  ],
                },
              },
            ],
          }),
        },
        {
          test: /\.(png|jpe?g|gif|ico)$/,
          loader: 'file-loader',
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'window.APP_VERSION': JSON.stringify(pkg.version),
        'process.env.NODE_ENV': JSON.stringify(options.mode),
      }),
      new HtmlWebpackPlugin({
        template: `${ASSETS_PATH}/index.html`,
        minify: {
          collapseWhitespace: isProduction,
        },
      }),
      new ExtractTextPlugin({
        filename: `${ASSETS_NAME}.css`,
      }),
      new CopyWebpackPlugin([
        {
          flatten: true,
          from: `${ASSETS_PATH}/images/*`,
          to: 'images',
        },
      ]),
    ],
    devtool: isProduction ? false : 'source-map',
  };
};
