const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.ts',
  module: {
    rules: [
        {
          test: /\.ts?$/,
          use: 'ts-loader',
          exclude: /node_modules|dist/
        }, {
            test: /\.js$/,
            exclude: /node_modules|dist/,
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            } 
        }
      ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },

  output: {
    filename: 'threed-real-viewer.js',
    path: path.resolve(__dirname, 'dist')
  },

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },
  
  plugins: [
    // 开启webpack全局热更新
    new webpack.HotModuleReplacementPlugin(),
    
    new htmlWebpackPlugin({
        filename: 'index.html',
        template: './dist/index.html'
    })
  ]
};