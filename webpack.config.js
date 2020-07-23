const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const mainJsOutputName = 'main.js' + (process.env.NODE_ENV === 'production' ? '?crossCheck=' + new Date().getTime() : '');
const baseUrl = process.env.version ? `https://images.hepsiburada.net/cst/assets/solutioncenter/${process.env.version}/` : '/';
// const baseUrl =  '/';
let entry = {
    [mainJsOutputName]:
        process.env.NODE_ENV === 'development' ?
            [
                // "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
                'src/index.js'
            ] :
            'src/index.js'
};

let webpackConfig = {
    devServer: {
        // https: {
        //     key: fs.readFileSync('src/assets/ssl/hb.key'),
        //     cert: fs.readFileSync('src/assets/ssl/hb.crt')
        // },
        headers: {"Access-Control-Allow-Origin": ["https://voltran.qa.hepsiburada.com","http://hstatstest.hepsiburada.com/api/track"]},
        historyApiFallback: true,
        inline: true,
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 8090,
        host: '0.0.0.0',
        disableHostCheck: true,
    },
    mode: 'production',
    entry: entry,
    output: {
        publicPath: baseUrl,
        filename: '[name]',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.(woff(2)?|ttf|eot|svg|png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        fallback: 'url-loader',
                        name: 'icons/[name].[ext]'
                    }
                }]
            },
            {
                test: /\.css$/,
                use: [
                    process.env.NODE_ENV !== 'production'
                        ? 'style-loader'
                        : MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.styl(us)?$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'stylus-loader'
                ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    postcss: [require('postcss-cssnext')()],
                    loaders: {
                        js: 'babel-loader'
                    }
                }
            },
            {
                test: /\.js?$/,
                exclude: [path.resolve(__dirname, 'node_modules')],
                loader: 'babel-loader',
            },
            {
                test: /\.s[a|c]ss$/,
                use: [
                    process.env.NODE_ENV !== 'production'
                        ? 'style-loader'
                        : MiniCssExtractPlugin.loader,
                    'css-loader',
                    "sass-loader"
                ]
            },
            {parser: {system: false}}
        ],
    },
    performance: {
        hints: process.env.NODE_ENV === 'production' ? 'warning' : false
    },
    node: {
        fs: 'empty'
    },
    resolve: {
        extensions: [".js", ".css", ".json", ".vue"],
        modules: [
            __dirname,
            'node_modules',
        ],
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebPackPlugin({
            favicon: './src/icons/favicon.png',
            template: "./index.html",
            filename: path.resolve(__dirname, 'dist') + "/index.html"
        }),
        new MiniCssExtractPlugin({
            filename: 'styles/style.css'
        }),
        new webpack.EnvironmentPlugin({'NODE_ENV': 'production'}),
        new VueLoaderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new CompressionPlugin({
            filename: "[path].gz[query]",
            algorithm: "gzip",
            // test: /\.js$|\.css$|\.html$/,
            test: /\.js(\?.*)?$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        })
    ]
};

if ((process.env.NODE_ENV || 'development') === 'development') {
    webpackConfig.mode = "development";
    webpackConfig.devtool = "inline-source-map";
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
} else {
    webpackConfig.plugins.push(new UglifyJsPlugin());
    webpackConfig.devtool = false;
}

module.exports = webpackConfig;
