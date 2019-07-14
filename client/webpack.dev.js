const webpack = require('webpack');
const merge  = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode : 'development',
  entry : [
    './src/index.jsx',
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server'
  ],
  devtool : 'inline-source-map',
  devServer : {
    contentBase : './build',
    host: 'localhost',
    port: '3000',
    hot: true,
    overlay: true,
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      ENVIRONMENT: JSON.stringify('DEVELOPMENT')
    })
  ]
});
