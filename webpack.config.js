var path = require('path');
var webpack = require('webpack');

var momentExternals = {
  root: 'moment',
  commonjs2: 'moment',
  commonjs: 'moment',
  amd: 'moment'
};
var reactExternals = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react'
};
var reactDOMExternals = {
  root: 'ReactDOM',
  commonjs2: 'react-dom',
  commonjs: 'react-dom',
  amd: 'react-dom'
};

var libraryName = 'react-simpleform';
var outputFile = libraryName + '.min.js';

var plugins = [], outputFile;
plugins.push(new webpack.optimize.OccurenceOrderPlugin(true));
plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/,/node_modules\/react$/));

var config = {
  entry: __dirname + '/src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd'
  },
  externals: [
    {
      'moment': momentExternals,
      'react': reactExternals,
      './React': reactExternals,
      'react-dom': reactDOMExternals
    }
  ],
  module: {
    loaders: [
      {
        test: /\.less$/,
        loader: 'style!css!less',
        include: path.join(__dirname, 'src')
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: plugins
};

module.exports = config;
