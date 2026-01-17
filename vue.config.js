const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  devServer: {
    port:8080,
    proxy: {
      '/api': { // 请求接口中要替换的标识
        target: 'http://localhost:8082',
        ChangeOrigin: true,
        secure: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  transpileDependencies: true,
  runtimeCompiler: true
})
