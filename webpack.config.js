const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  context: path.resolve(__dirname, "src"),
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@styles": path.resolve(__dirname, "src/assets/styles"),
    },
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: ["pug-loader"],
      },
      {
        test: /\.s[ac]ss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(eot|otf|ttf|woff|svg|png)/,
        use: ["file-loader"],
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      filename: "index.html",
      template: "./index.pug",
      inject: true,
    }),
  ],
};
