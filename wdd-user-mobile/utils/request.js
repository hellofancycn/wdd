import {
	Api_URL,
	Token_Store_Key
} from '../utils/common'

const post = function(url, params) {
	return request(url, params, false)
}
const exportPost = function(url, params) {
	return exportRequest(url, params, false)
}

const postWithLoading = function(url, params) {
	return request(url, params, true)
}


const exportRequest = function(url, query, showLoadding) {
	if (showLoadding) {
		uni.showLoading({
			mask: true
		});
	}
	return new Promise((reslove, reject) => {
		const token = uni.getStorageSync(Token_Store_Key)
		uni.request({
			url: Api_URL + url,
			responseType: "arraybuffer",
			header: {
				'token': token,
			},
			data: query,
			method: "POST",
			success: re => {
				if (re.statusCode == 200) {
					if (re.data.code == 401 || re.data.code == 400) {
						uni.reLaunch({
							url: '/pages/public/login'
						});
						reject()
					} else {
						reslove(re.data)
					}
				} else {
					reject()
				}
			},
			fail: (data, code) => {
				reject(data)
			},
			complete: () => {
				if (showLoadding) {
					uni.hideLoading()
				}
			}
		});
	})

}

const request = function(url, query, showLoadding) {
	if (showLoadding) {
		uni.showLoading({
			mask: true
		});
	}
	return new Promise((reslove, reject) => {
		const token = uni.getStorageSync(Token_Store_Key)
		uni.request({
			url: Api_URL + url,
			header: {
				'token': token
			},
			 responseType: 'blob',
			data: query,
			method: "POST",
			success: re => {
				if (re.statusCode == 200) {
					if (re.data.code == 401 || re.data.code == 400) {
						uni.reLaunch({
							url: '/pages/public/login'
						});
						reject()
					} else {
						reslove(re.data)
					}
				} else {
					reject()
				}
			},
			fail: (data, code) => {
				reject(data)
			},
			complete: () => {
				if (showLoadding) {
					uni.hideLoading()
				}
			}
		});
	})

}


const fileRequest = function(url, filePath) {
	uni.showLoading({
		mask: true
	});
	return new Promise((reslove, reject) => {
		const token = uni.getStorageSync(Token_Store_Key)
		uni.uploadFile({
			url: Api_URL + url,
			header: {
				'token': token
			},
			 responseType: 'blob' ,
			filePath: filePath,
			name: 'file',
			success: function(uploadFileRes) {
				let res = JSON.parse(uploadFileRes.data);
				if (res.code == 401) {
					uni.reLaunch({
						url: '/pages/public/login'
					});
					reject()
				} else {
					reslove(res)
				}
			},
			fail: function() {
				reject()
			},
			complete: function() {
				uni.hideLoading()
			}
		});
	})
}

export {
	post,
	postWithLoading,
	fileRequest,
	exportPost
}
