const path = require('path');

module.exports = {
  mode: 'production',
  entry: './sofatime-wp.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'wordpress'),
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
