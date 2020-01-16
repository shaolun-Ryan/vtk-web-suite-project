const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
var vtkRules = require('vtk.js/Utilities/config/dependency.js').webpack.core.rules;


//创建一个插件的实例对象
const htmlPlugin = new HtmlWebpackPlugin({
    template: path.join(__dirname, './public/index.html'),//源文件
    filename: 'index.html'
})

module.exports = {
    mode: 'development',
    plugins: [
        htmlPlugin
    ],
    module: {
        rules: [
            { test: /\.html$/, loader: 'html-loader' },
            {test: /\.js|jsx$/, use: 'babel-loader', exclude:/node_modules/},//一定要加exclude
            { test: /.css$/, use: ['style-loader', 'css-loader']}
        ].concat(vtkRules),
      },   
}