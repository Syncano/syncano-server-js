const path = require('path')
const webpack = require('webpack')

module.exports = [
  {
    name: 'package',
    debug: false,
    profile: false,
    devtool: 'source-map',
    entry: path.join(__dirname, 'src', 'server.js'),
    target: 'node',
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'syncano-server.js',
      library: 'SyncanoServer'
    },
    module: {
      loaders: [
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
        { test: /\.json$/, loader: 'json-loader' }
      ]
    },
    resolve: {
      modulesDirectories: ['node_modules'],
      extensions: ['', '.js', '.json']
    },
    plugins: [
      new webpack.IgnorePlugin(/vertx/),
      new webpack.DefinePlugin({ 'global.GENTLY': false })
    ]
  },
  {
    name: 'uglified-package',
    debug: false,
    profile: false,
    devtool: 'source-map',
    entry: path.join(__dirname, 'src', 'server.js'),
    target: 'node',
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'syncano-server.min.js',
      library: 'SyncanoServer'
    },
    module: {
      loaders: [
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
        { test: /\.json$/, loader: 'json-loader' }
      ]
    },
    resolve: {
      modulesDirectories: ['node_modules'],
      extensions: ['', '.js', '.json']
    },
    plugins: [
      new webpack.IgnorePlugin(/vertx/),
      new webpack.optimize.OccurenceOrderPlugin(true),
      new webpack.DefinePlugin({ 'global.GENTLY': false }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_console: true,
          drop_debugger: true
        },
        output: {
          comments: false
        }
      })
    ]
  }
]
