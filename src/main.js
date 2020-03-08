import Vue from 'vue'
const electron = require("electron");
import App from './App.vue'
import vuetify from './plugins/vuetify';
import moment from "moment-timezone";

moment.locale("tr");
moment().tz("Europe/Istanbul")

Vue.use({
  install: function(Vue) {
    Vue.prototype.$ipc = electron.ipcRenderer;
  }
})

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
