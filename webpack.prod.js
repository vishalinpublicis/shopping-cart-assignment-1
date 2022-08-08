const path = require('path');
const {merge} = require('webpack-merge');
const common = require('./webpack.common');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin =require('terser-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = merge(common, {
    mode: "production",
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, "client/dist"),
        assetModuleFilename: 'src/[name][ext]'
    },
    optimization: {
        minimizer: [new CssMinimizerPlugin(), new TerserPlugin(),
            new ImageMinimizerPlugin({
                minimizer: {
                  implementation: ImageMinimizerPlugin.squooshMinify,
                  options: {
                    // Your options for `squoosh`
                  },
                },
              }),],

    },
    plugins:[
        new CleanWebpackPlugin()
    ],
})