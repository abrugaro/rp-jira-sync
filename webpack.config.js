const path = require("path")
const nodeExternals = require("webpack-node-externals")

module.exports = {
  entry: "./src/main.ts",
  mode: "development",
  externals: [nodeExternals()],
  target: "node",
  //devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  optimization: {
    //minimize: false
  },
}
