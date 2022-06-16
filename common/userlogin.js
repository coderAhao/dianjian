import {
	getTokenStorage,
	removeTokenStorage,
	setTokenStorage,
  setUserStorage,
  getUserStorage,
  setUserPasswordStorage,
  getUserPasswordStorage
} from './storage.js'

module.exports = {
	
	checkLogin: function() {
		const token = getTokenStorage()
		if (token == null || token === ''){ // 本地没有token表示未登录
			return false
		}
		return true
	},
	
	saveToken: function(token) {
		setTokenStorage(token)
	},
	saveUser: function(data) {
		setUserStorage(data)
	},
	getToken: function() {
		let token = getTokenStorage()
		if (token == null || token === ''){ // 本地没有token表示未登录
			return ''
		}
		return token
	},
	getUser: function() {
		let user = getUserStorage()
		return user || ''
	},
	savePassword: function(data) {
		setUserPasswordStorage(data)
	},
  getPassword: function() {
    let password = getUserPasswordStorage()
		return password || null
	},

	logout: function() {
		removeTokenStorage()
		uni.redirectTo({
			url: '/pages/login/index',
		})
    uni.$emit('clearPollingTimer')
	}
	
}