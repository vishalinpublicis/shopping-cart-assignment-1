const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['/client/src/js/index.js','/client/src/js/products.js'],
    plugins: [new HtmlWebpackPlugin({
        template: "client/index.html"
    })],
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
                test: /\.css$/,
                use:[
                    {
                        loader: 'style-loader',
                        loader: 'css-loader'
                    }
                ]
            },
            { test: /\.handlebars$/, loader: "handlebars-loader" },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                  'file-loader',
                  {
                    loader: 'image-webpack-loader',
                    options: {
                      bypassOnDebug: true, // webpack@1.x
                      disable: true, // webpack@2.x and newer
                    },
                  },
                ],
              }
        ]
    },
    resolve: {
        alias: {
           handlebars: 'handlebars/dist/handlebars.min.js'
        }
    }
}