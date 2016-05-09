var path = require("path");
var webpack = require('webpack');
module.exports = {
  entry: {
    app: ["./example/example.js"]
  },
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
  output: {
    path: path.resolve(__dirname, "example/build"),
    filename: "bundle.js"
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__ : true
    })
  ]
};