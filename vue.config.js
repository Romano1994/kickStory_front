module.exports = {
  devServer: {
    proxy: {
      '/':{
        target:process.env.VUE_APP_API_BASE_URL,
        changeOrigin: true
      }
    }
  }
}
