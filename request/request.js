import UserLogin from '../common/userlogin.js'
import { BASE_URL } from './baseUrl.js'
function request(options) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {'Authorization': 'Bearer ' + UserLogin.getToken()},
      success: function(res){
        resolve(res.data)
      },
      fail: reject
    })
  })
}
export default request