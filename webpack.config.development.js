var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + '/index.html',
      filename: 'index.html',
      inject: true,
      favicon: __dirname + '/src/images/favicon.ico'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['react-hot', 'babel'], include: path.join(__dirname, 'src') },
      { test: /\.json$/, loaders: ["json"] },
      { test: /\.scss$/, loaders: ["style", "css", "sass"] },
      { test: /\.(ico|gif|png|jpg|jpeg|svg|webp|eot|woff|woff2|ttf).*/, loaders: ["file"] }
    ]
  }
};
