<template>
	<view class="container">
		<uni-section title="全部订单" type="line">
			<view class="order-list" v-for="(item,index) in orders">
				<uni-card :title="item.shopName" :sub-title="item.createTime" :extra="getStatus(item.status)" :thumbnail="item.menuList[0].pics[0]">
					<text class="uni-body">
						<u-button :ripple="true" :size="mini" :shape="circle" :disabled="true" ripple-bg-color="#909399" :custom-style="getRandomColor" v-for="(m,index) in menus[index]">{{m}}</u-button>
					</text>
				</uni-card>
			</view>
		</uni-section>

	</view>

</template>

<script>
	import request from '@/request.js';
	export default {
		components: {},
		data() {
			return {
				orders: [],
				cover: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/shuijiao.jpg',
				avatar: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png',
				extraIcon: {
					color: '#4cd964',
					size: '22',
					type: 'gear-filled'
				},
				menus: []
			}
		},
		onLoad() {

		},
		onShow() {
			let data = {
				shopId: 15
			}
			request('/order/list', 'GET', data, 'order')
				.then((res) => {
					this.orders = res.data.data;
					this.orders.forEach(f=>{
						let des = [];
						f.menuList.forEach(e=>{
							des.push(e.name);
						})
						this.menus.push(des);
					})
					console.log('orders', this.orders);
				})
				.catch((err) => {
					console.log('err', err);
					uni.showToast({
						title: err.data.message,
						icon: 'error',
					})
				});
				
		},
		methods: {
			getStatus(status) {
				if(status === 'WAIT_RECEIVE') {
					return '等待接单'
				}else if (status === 'IN_PROCESS'){
					return '努力备餐中'
				}else if (status === 'SUCCESS_WAIT_EVALUATE'){
					return '已完成,待评价';
				}else if (status === 'CANCELED'){
					return '已取消';
				}else if (status === 'FINISH'){
					return '已完成';
				}else if (status === 'CANCEL_WAIT_ACK'){
					return '订单取消中，待店主确认';
				}
			},
			getRandomColor() {
			  const letters = '0123456789ABCDEF';
			  let color = '#';
			  for (let i = 0; i < 6; i++) {
			    color += letters[Math.floor(Math.random() * 16)];
			  }
			  return color;
			},
			randomColor() {
			
			  // 生成从一种颜色渐变到另一种颜色的样式
			  const color1 = this.getRandomColor();
			  const color2 = this.getRandomColor();
			  const direction = ['to right', 'to left', 'to bottom', 'to top', 'diagonal'].random(); // 随机选择渐变方向
			  let res = {
				  background: linear-gradient(direction, color1, color2)
			  }
			
			  return res;
			}
		}
	}
</script>

<style>
</style>