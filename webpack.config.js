const path = require('path');
const NODE_ENV = process.env.NODE_ENV; // 获取环境变量
const isProd = NODE_ENV === 'production';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 每次构建清除上一次打包出来的文件
const nodeExternals = require('webpack-node-externals');
const plugins = isProd ? [new CleanWebpackPlugin()] : [
  new CleanWebpackPlugin(),
  new HtmlWebpackPlugin({
    template: 'public/index.html'
  }),
]

module.exports = {
  mode: isProd ? 'production' : 'development',
  entry: isProd ? './src/components/index.js' : './src/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,  // 用正则来匹配文件路径，这段意思是匹配 js 或者 jsx
        exclude: /node_modules/,
        include: [path.resolve(__dirname, 'src')],
        loader: 'babel-loader' // 加载模块 "babel-loader" 
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'less-loader',
          { loader: 'less-loader', options: { javascriptEnabled: true } }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },

    ]
  },
  devServer: {
    contentBase: './dist'
  },
  externals: isProd ? [nodeExternals()] : [], // nodeExternals 使得打包的组件中不包括任何 node_modules 里面的第三方组件，起到减小体积的作用。
  plugins,
};