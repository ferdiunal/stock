module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: "Ürün Yönetimi",
        appId: 'funal.mgm',
        copyright: "Ferdi ÜNAL",
        target: "portable",
        win: {
          icon: 'public/windows.ico'
        }
      }
    }
  }
}