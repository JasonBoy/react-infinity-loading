const path = require('path');
const webpack = require('webpack');

const PROD_MODE = process.env.NODE_ENV === 'production';

const entry = path.resolve(__dirname, 'components/InfiniteLoading/InfiniteLoading.js');

const config = {
  entry: entry,
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: PROD_MODE ? 'react-infinite-loading.min.js' : 'react-infinite-loading.js',
    library: 'InfiniteLoading',
    libraryTarget: 'umd',
  },
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'react',
    },
    // fbemitter: {
    //   commonjs: 'fbemitter',
    //   commonjs2: 'fbemitter',
    //   amd: 'fbemitter',
    //   root: 'fbemitter',
    // },
    // 'prop-types': {
    //   commonjs: 'prop-types',
    //   commonjs2: 'prop-types',
    //   amd: 'prop-types',
    //   root: 'prop-types',
    // },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname),
        ],
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ],
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(PROD_MODE ? 'production' : 'development')
      }
    }),

  ],
  devtool: 'source-map',
};

if(PROD_MODE) {
  const plugins = config.plugins;
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      drop_console: true,
      dead_code: true,
      drop_debugger: true,
    },
    sourceMap: true,
    mangle: true,
  }));
}

module.exports = config;