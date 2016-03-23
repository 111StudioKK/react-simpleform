var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var path = require('path');
var env = require('yargs').argv.mode;

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

var plugins = [], outputFile;

if (env === 'build') {
  outputFile = libraryName + '.min.js';
} else {
  outputFile = libraryName + '.js';
}

plugins.push(new webpack.optimize.OccurenceOrderPlugin(true));

plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/,/node_modules\/react$/));

var config = {
  entry: __dirname + '/src/index.js',
  output: {
    path: __dirname + '/lib',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: [
    {
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
        exclude: /(node_modules|bower_components)/
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
