const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
const srcPath = path.join(__dirname, 'app');
const buildPath = path.join(__dirname, 'dist');  
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

var config = {
    entry: ['babel-polyfill','./app/index.js'],
    output: {
        path: buildPath,
        filename: 'index_bundle.js',
        publicPath: '/' //base path for assets
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['env','react','es2015-ie','stage-2'] ,
                    plugins: ['transform-class-properties']
                }
            }, {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [ 'css-loader' ]
                })
            }, {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader','autoprefixer-loader','sass-loader'],
                   // publicPath: '/'
                })
            }, {
                test: /\.svg$/,
                use: [ 'svg-sprite-loader', 'svgo-loader']
            }
        ]
    },
    devServer: {
        historyApiFallback: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(srcPath, 'index.html')
        }),
        new ExtractTextPlugin({
            filename: "[name].css",
            disable: false,
            allChunks: true,
            ignoreOrder: true
        })
    ]
}
if(process.env.NODE_ENV === 'production') {
    config.plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new webpack.optimize.UglifyJsPlugin()
    )
}

module.exports = config;