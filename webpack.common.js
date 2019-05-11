const path = require("path")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const ExtractCssChunksPlugin = require("extract-css-chunks-webpack-plugin")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "ts-loader",
        options: { transpileOnly: true },
      },
      {
        test: /\.s?css$/,
        exclude: path.resolve(__dirname, "src/view/global-css"), // module CSS
        use: [
          ExtractCssChunksPlugin.loader,
          "css-modules-typescript-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: "[local]__[hash:base64:5]",
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.s?css$/,
        include: path.resolve(__dirname, "src/view/global-css"), // global CSS
        use: [
          ExtractCssChunksPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: false,
            },
          },
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ExtractCssChunksPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "src/index.html",
      filename: "../index.html",
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".wasm", ".mjs", ".js", ".json"],
  },
}
