import Vue from 'vue'
import App from './App'

// vuex
import store from './store'

// 引入rtc
import './util/rtc/index.js'
import './util/filter/index.js'
// 引入全局uView
import uView from '@/uni_modules/uview-ui'

import mixin from './common/mixin'
import constants from './util/constants/index.js'
import checkPicStatus from './util/util.js'


Vue.prototype.$store = store
Vue.prototype.$const = constants
Vue.prototype.$checkPicStatus = checkPicStatus

Vue.config.productionTip = false

App.mpType = 'app'
Vue.use(uView)

// #ifdef MP
// 引入uView对小程序分享的mixin封装
const mpShare = require('@/uni_modules/uview-ui/libs/mixin/mpShare.js')
Vue.mixin(mpShare)
// #endif

Vue.mixin(mixin)

const app = new Vue({
    store,
    ...App
})

// http接口API抽离，免于写url或者一些固定的参数
// import httpApi from '@/common/api/http.api.js';
// Vue.use(httpApi, app);

import './request/interceptor.js'

// 全局导入工具类

import UserLogin from './common/userlogin.js'
Vue.prototype.$userlogin = UserLogin;


// 引入请求封装
// require('./util/request/index')(app)

app.$mount()
