<template>
	<view class="container">
		
	</view>
</template>

<script>
	import request from '@/request.js';
	export default {
		data() {
			return {
				order: {},
				orderId: 0,
				current: 0,
				mode: 'default',
				name: 'er'
			}
		},
		onLoad(e) {
			this.orderId = e.id;
			this.getDetails();
		},
		methods: {
			getStatus(status) {
				if (status === 'WAIT_RECEIVE') {
					return '等待接单'
				} else if (status === 'IN_PROCESS') {
					return '努力备餐中'
				} else if (status === 'SUCCESS_WAIT_EVALUATE') {
					return '已完成,待评价';
				} else if (status === 'CANCELED') {
					return '已取消';
				} else if (status === 'FINISH') {
					return '已完成';
				} else if (status === 'CANCEL_WAIT_ACK') {
					return '订单取消中，待店主确认';
				}
			},
			getDetails() {
				request('/order/' + this.orderId, 'GET', {}, '')
					.then((res) => {
						console.log(res);
						this.order = res.data;
					})
					.catch((err) => {
						uni.showToast({
							title: err.data.message,
							icon: 'error',
						})
					})
			}
		}


	}
</script>

<style>
</style>