const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "/is",
  devServer: {
    proxy: {
      "/is/inf-sys-server": {
        target: "http://5.42.115.6:80", // изменено на dev стенд
        changeOrigin: true,
      },
      "/is/inf-sys-parser": {
        target: "http://5.42.115.6:80", // изменено на dev стенд
        changeOrigin: true,
      },
      "/is/api/files": {
        target: "http://5.42.115.6:80", // изменено на dev стенд
        changeOrigin: true,
      },
    },
  },
});
