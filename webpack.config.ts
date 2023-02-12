/* eslint-disable import/no-extraneous-dependencies */
import path from "path";
import CopyWebpackPlugin from "copy-webpack-plugin";
import { Configuration, HotModuleReplacementPlugin } from "webpack";
import { Configuration as DevServerConfiguration } from "webpack-dev-server";

const config: Configuration & { devServer: DevServerConfiguration } = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "development",
  plugins: [
    new CopyWebpackPlugin({
      patterns: ["index.html"],
    }),
    new HotModuleReplacementPlugin(),
  ],
  devServer: {
    client: {
      overlay: true,
    },
    watchFiles: ["src/*", "index.html"],
  },
};

export default config;
