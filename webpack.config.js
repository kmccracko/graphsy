const Dotenv = require('dotenv-webpack'); // required for accessing .env from front-end. used in plugins.
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: process.env.NODE_ENV,
  entry: ['./src/client/index.tsx'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  devtool: 'eval-source-map',
  resolve: {
    extensions: ['.jsx', '.js', '.ts', '.tsx'],
  },
  // devtool: 'inline-source-map',
  devServer: {
    static: {
      publicPath: '/',
      directory: path.resolve(__dirname, 'dist'),
    },
    port: 9090,
    historyApiFallback: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    // compress: true,
    hot: true,
    proxy: {
      '*': {
        target: 'http://localhost:3003',
        secure: false,
        // changeOrigin: true,
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(s(a|c)ss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'ts-loader'],
        // options: {
        //   presets: ['@babel/preset-env', '@babel/preset-react'],
        // },
      },
      {
        test: /\.(png|svg|jpeg|jpg|jpeg|gif)$/,
        use: [
          {
            // loads files as base64 encoded data url if image file is less than set limit
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/client/index.html',
    }),
    // new Dotenv({ systemvars: true }),
    // new BundleAnalyzerPlugin(),
  ],
};
