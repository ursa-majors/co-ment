const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(jpg|png|gif|bmp|svg|woff|woff2|ttf|eot)$/,
        // loader: 'file-loader',
        // options: {
        //   name: '[name].[ext]',
        //   outputPath: 'assets/'
        // }
        loader: require.resolve('url-loader')
      }
    ]
  },

  plugins: [
    new HTMLWebpackPlugin({
      template: path.join(__dirname, '/src/index.html'),
      filename: 'index.html',
      inject: 'body'
    })
  ]

};
