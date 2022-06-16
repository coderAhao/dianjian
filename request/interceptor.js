import UserLogin from '../common/userlogin.js'
import {
  BASE_URL
} from './baseUrl.js'

export default uni.addInterceptor('request', {
  invoke(args) {
    const token = UserLogin.getToken()
    if (token) {
      args.header = {
        'Authorization': 'Bearer ' + token
      }
    }
  },
  success(args) {
    const data = args.data
    if (data.code === 4013) {
      uni.showToast({
        title: '请重新登录',
        icon: 'error',
        duration: 1500
      })
      setTimeout(() => {
        UserLogin.logout()
      }, 500)
    }
    console.log(args, 'args')
  },
  fail(err) {
    console.log('interceptor-fail', err)
  },
  complete(res) {
    console.log('interceptor-complete', res)
  }
})
