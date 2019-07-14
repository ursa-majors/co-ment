const webpack = require('webpack');
const merge  = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode : 'production',
  entry : {
    app : './src/index.jsx'
  },
  devtool : 'source-map',
  plugins : [
    new UglifyJSPlugin({
      sourceMap : true
    }),
    new CompressionPlugin({
      test: /\.js$|\.css$|\.html$/,
      algorithm: 'gzip',
      filename: '[path].gz[query]',
      threshold: 10240,
      minRatio: 0.8,
    }),
    new webpack.DefinePlugin({
      ENVIRONMENT: JSON.stringify('PRODUCTION')
    })
  ]
});
