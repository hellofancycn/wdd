import Vue from 'vue'
import App from './App'


Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()


// #ifdef MP-WEIXIN
import share from './@/utils/share.js'
Vue.mixin(share)
// #endif
