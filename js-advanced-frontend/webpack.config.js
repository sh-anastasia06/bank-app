const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'main.[contenthash].js',
    // publicPath: '/',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ title: 'Coin.' }), new MiniCssExtractPlugin({
    filename: 'main.[contenthash].css',
  })],
  externalsType: 'script',
  externals: {
    ymaps: [
      "https://api-maps.yandex.ru/2.1/?apikey=9eaafcf4-a275-4ab6-bcd0-da7d650fbbc2&lang=ru_RU",
      'ymaps'
    ],
  },
  devServer: {
    hot: true,
    historyApiFallback: true,
  },
  optimization: {
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.sharpMinify,
          options: {
            encodeOptions: {
              png: {},
            },
          },
        },
      }),
    ],
  },
};
