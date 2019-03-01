import Vue from 'vue'
import App from './App'
import Notify from '@/../static/vant/dist/notify/notify';

Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$Notify = Notify

const app = new Vue(App)
app.$mount()
