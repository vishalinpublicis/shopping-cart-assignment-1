const path = require('path');

module.exports = {
    entry: '/client/src/js/index.js',
    mode: 'development',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, "client/dist")
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                // exclude: /(node_modules)/,
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
            { test: /\.handlebars$/, loader: "handlebars-loader" }
        ]
    },
    resolve: {
        alias: {
           handlebars: 'handlebars/dist/handlebars.min.js'
        }
    }
}