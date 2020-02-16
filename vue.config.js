const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
    productionSourceMap: false,
    assetsDir: 'static',
    chainWebpack: config => {
        config.set('externals', {
            vue: 'Vue',
            axios: 'axios',
            // iview: 'iview',
            'vue-router': 'VueRouter',
            nprogress: 'NProgress',
        })
    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            //关闭生产模式下的console控制台打印
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
            return {
                plugins: [
                    new CompressionPlugin({
                        // test: /\.js$|\.html$|.\css$/, //匹配文件名
                        // threshold: 10240,//对超过10k的数据压缩
                        // deleteOriginalAssets: false //不删除源文件
                        filename: '[path].gz[query]',
                        algorithm: 'gzip',
                        test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$',),
                        threshold: 8192,
                        minRatio: 0.8,

                    })
                ]
            }
        }
    },
}


