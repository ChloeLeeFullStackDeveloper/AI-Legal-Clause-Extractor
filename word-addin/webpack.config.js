const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/taskpane/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "assets/[name].[ext]"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/taskpane/index.html",
      filename: "taskpane.html"
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "manifest.xml",
          to: "manifest.xml"
        },
        {
          from: "assets",
          to: "assets",
          noErrorOnMissing: true
        }
      ]
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist")
    },
    compress: true,
    port: 3000,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  }
};