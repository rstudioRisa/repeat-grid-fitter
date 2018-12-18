const path = require('path');
const {VueLoaderPlugin} = require('vue-loader');

module.exports = {
    entry: "./src/main.js",
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'main.js',
        libraryTarget: "commonjs2"
    },
    devtool: "none", // prevent webpack from using eval() on my module
    externals: {
        uxp: "uxp",
        scenegraph: "scenegraph",
        commands: "commands"
    },
    resolve: {
        extensions: [".js", ".css", ".vue"],
        alias: {
            "@": path.resolve(__dirname, "./src"),
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};
