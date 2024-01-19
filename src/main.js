import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import '@storefront-ui/vue/styles.scss'
import './interceptors/axios'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'
import config from './store/resources/endpoints/authentication'

Vue.config.productionTip = false
Vue.use(new VueSocketIO({
  debug: false,
  connection: SocketIO(config.api, { autoConnect: false })
}));

const vm = new Vue({
  router,
  store,
  render: h => h(App)
})

export { vm }
vm.$mount('#app')
