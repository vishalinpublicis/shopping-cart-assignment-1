const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const json = require('./client/src/json/products.json');

module.exports = {
    entry: ['/client/src/js/index.js','/client/src/js/products.js'],
    plugins: [
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: "client/index.html"
            }),
            new HtmlWebpackPlugin({
                filename: 'products.html',
                template: "client/products.html"
            }),
            new MiniCssExtractPlugin({filename: "src/css/[name].[fullhash].css"})
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
                loader: 'html-loader',
                options: {
                    sources: {
                      list: [
                            {
                                 tag: 'source', 
                                 attribute: 'src-set',
                                 type: 'srcset'
                             },
                             {
                                 tag: 'img', 
                                 attribute: 'src',
                                 type: 'src'
                             },
                             {
                                tag: "img",
                                attribute: "data-srcset",
                                type: "srcset",
                              },
                             {
                                 tag: 'source', 
                                 attribute: 'srcset',
                                 type: 'srcset'
                             }
                        ]
                    }
                }
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: "src/images/[name][ext]"
                },
            },
            {
                test: /\.json$/,
                type: 'asset/resource',
                generator: {
                    filename: "src/json/[name][ext]"
                }
               
            },
        ]
    },
    resolve: {
        alias: {
           handlebars: 'handlebars/dist/handlebars.min.js'
        }
    }
}