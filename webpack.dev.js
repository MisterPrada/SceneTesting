const path = require('path');

module.exports = {
    entry: './index.js',
    devtool: 'source-map',
    devServer: {
        watchContentBase: true
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js'
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.glsl$/i,
                use: 'raw-loader',
            },
        ],
    },
    plugins: [ ]
};