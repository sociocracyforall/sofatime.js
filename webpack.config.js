const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    sofatime: {
      import: './sofatime.js',
      library: {
        name: 'sofatime',
        type: 'umd',
      },
    },
    jsontemplate: {
      import: './template.js',
      library: {
        name: 'jsontemplate',
        type: 'umd',
      },
    },
    demo: './demo.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'demo'),
  },
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'demo.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
