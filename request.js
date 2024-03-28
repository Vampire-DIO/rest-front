const BASE_URL = 'http://localhost:8081/';


function request(url, method, data, page){
	let token =  uni.getStorageSync('token');
	return new Promise((resolve, reject) => {
		uni.request({
			url: BASE_URL + url,
			method: method,
			data: data,
			header: {
				'token': token
			},
			success: (res) => {
				if (res.data.code === 0){
					resolve(res.data);
				}else if (res.data.code === 28011){
					uni.showModal({
						title: "登录提醒",
						content: "当前未登录状态, 跳转登录",
						success() {
							uni.redirectTo({
								url: '/pages/login/login?page=' + page
							});
						}
					});
				} else {
					reject(res);
				}
			},
			fail: (err) => {
				reject(err);
			},
		});
	});
}

export default request;