module.exports = {
	
	setTokenStorage(token) {
		uni.setStorageSync('app-token', token);
	},
	getTokenStorage() {
		return uni.getStorageSync('app-token');
	},
	removeTokenStorage() {
		return uni.removeStorageSync('app-token');
	},
	setUserStorage(data) {
		uni.setStorageSync('user', data);
	},
	getUserStorage(data) {
		return uni.getStorageSync('user');
	},
  setUserPasswordStorage(data) {
		uni.setStorageSync('password', data);
	},
  getUserPasswordStorage() {
		return uni.getStorageSync('password')
	}
};
