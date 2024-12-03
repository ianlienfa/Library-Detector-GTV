// webpack.config.js
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: {
        index: './src/index.js', // Your entry point
        help: './src/help.js'
    },
    output: {
        filename: '[name].bundle.js', // The name of your bundled file
        path: path.resolve(__dirname, 'dist'), // Output directory
        publicPath: '/' // Necessary for the dev server
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'), // Directory for static files
        },
        compress: true, // Enable gzip compression
        port: 9000, // Port to run the server
    },
    plugins: [
        new BundleAnalyzerPlugin({analyzerMode: 'json', generateStatsFile: true})
    ]
};