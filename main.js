
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
Vue.use(uView);
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif
Vue.prototype.checkLogin = function(page) {
	let token = uni.getStorageSync('token');
	if(token === ''){
		uni.showModal({
			title: "登录提醒",
			content: "当前未登录状态, 跳转登录",
			success() {
				uni.redirectTo({
					url: '/pages/login/login?page=' + page
				});
			}
		});
	}
}
// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif