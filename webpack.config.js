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
  }
]
