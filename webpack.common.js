const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: ['/client/src/js/index.js','/client/src/js/products.js'],
    plugins: [
            new HtmlWebpackPlugin({
                template: "client/index.html"
            }),
            new MiniCssExtractPlugin()
        ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            { test: /\.handlebars$/, loader: "handlebars-loader" },
            {
                test: /\.html$/,
                loader: 'html-srcsets-loader',
                options: {
                    attrs: ['img:src', ':srcset'],
                    minimize: true,
                    caseSensitive: true,
                    removeAttributeQuotes:false,
                    minifyJS:false,
                    minifyCSS:false
                },
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: "[name].[hash].[ext]",
                        outputPath: "src/assets"
                    }
                },
              }
        ]
    },
    resolve: {
        alias: {
           handlebars: 'handlebars/dist/handlebars.min.js'
        }
    }
}