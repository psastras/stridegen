var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  devtool: 'cheap-source-map',
  entry: [
    './src/index'
  ],
  output: {
    path: process.env.OUTPUT_DIR || path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + '/index.html',
      filename: 'index.html',
      inject: true,
      favicon: __dirname + '/src/images/favicon.ico'
    }),
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      },
      compress: {
        warnings: false,
        screw_ie8: true
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new ExtractTextPlugin("app.css")
  ],
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['react-hot', 'babel'], include: path.join(__dirname, 'src') },
      { test: /\.json$/, loaders: ["json"] },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract("style", "css!sass") },
      { test: /\.(ico|gif|png|jpg|jpeg).*/, loaders: ["file?name=images/[hash].[ext]"] },
      { test: /\.(svg|webp|eot|woff|woff2|ttf).*/, loaders: ["file?name=fonts/[hash].[ext]"] }
    ]
  },
  resolve: {
    alias: {
      'react': 'react-lite',
      'react-dom': 'react-lite',
      'swagger.json':  path.join(__dirname, 'src/petstore.json')
    },
    extensions: ['', '.js', '.jsx', 'json']
  }
};
