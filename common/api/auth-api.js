
let loginUrl = '/api/v2/login';

let auth = (vm) => {
	return {
		login: (params = {}) => {
			return vm.$u.post(loginUrl, params)
		}
	}
}

export default auth