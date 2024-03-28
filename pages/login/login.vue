<template>
	<view class="container">
		<uni-card>
			<uni-forms :model-value="loginData">
				<uni-forms-item label="邮箱" required>
					<uni-easyinput v-model="loginData.email" placeholder="邮箱"/>
				</uni-forms-item>
				<uni-forms-item label="密码" required>
					<uni-easyinput v-model="loginData.password" type="password" placeholder="密码"/>
				</uni-forms-item>
			</uni-forms>
			<button type="primary" size="mini" @click="login">登录</button>
		</uni-card>
	</view>

</template>

<script>
	export default{
		data() {
			return {
				loginData: {
					email: '',
					password: ''
				},
				lastTabBar: ''
			}
		},
		onLoad: function (options){
			this.$data.lastTabBar = options.page
		},
		methods: {
			redirect(){
				if (this.lastTabBar === '') {
					uni.navigateBack(1);
				}else {
					uni.switchTab({
						url: '/pages/' + this.lastTabBar + "/" + this.lastTabBar 
					})
				}
			},
			login() {
				uni.request({
					url: 'http://localhost:8081/user/login',
					method: 'POST',
					data: this.loginData,
					success: (res) => {
						console.log(res);
						console.log(getCurrentPages());
						uni.setStorageSync('token', res.data.data);
						if (res.data.code != 0) {
							uni.showToast({
								title: res.data.message,
								icon: 'error',
								duration: 1500
							})
							return;
						}
						this.redirect();
					}
				})
			}
		}
	}
	
</script>

<style>
</style>