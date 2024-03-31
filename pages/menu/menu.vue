<template>
	<view class="container">
		<view class="order-view">
			<view class="order-left">
				<scroll-view :scroll-top="scrollTopCategory" scroll-y="true" class="scroll-Y scroll-category"
					:show-scrollbar="false">
					<view class="category-card itemize-text" :class="{'selected': item.categoryId === selectCardId}"
						v-for="(item, index) in categorys" @click="itemIze(item)" :key="item.categoryId">
						<view>
							<text>{{item.categoryName}}</text>
						</view>
					</view>
				</scroll-view>
			</view>

			<view class="order-right">
				<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y scroll-menu" @scrolltoupper="upper"
					@scrolltolower="lower" @scroll="scroll" :show-scrollbar="true" ref="scrollMenu"
					:scroll-into-view="scroll_into" style="height: 85vh;">

					<uni-card :is-full="true" margin=0 padding=0 spacing=0 v-for="(item, index) in menus" :key="index"
						class="block-item" :id="'menuId-' +item.id">
						<uni-swipe-action-item :disabled="isManager" :right-options="options" @click="swipClick">
							<view class="good-detail" :id="item.categoryId">
								<swiper class="good-img-swiper" circular :indicator-dots="true" :autoplay="true"
									:interval="2000" :duration="500">
									<swiper-item v-for="(img, sIndex) in item.pics" :key="sIndex">
										<image class="good-img" mode="aspectFit" :src="img" @error="imageLoadError">
										</image>
									</swiper-item>
								</swiper>
								<view class="good">
									<view class="good-name" style="font-weight: bold;">
										<text>{{item.name}}</text>
										<uni-tag :type="item.status ==='有货'? 'success' : 'default'"
											style="position: absolute; right: 20rpx;" :text="item.status" />
									</view>
									<view class="good-soldNum" style="font-weight: bold;">
										已售: {{item.soldNum}}
									</view>
									<view class="good-description">
										{{item.description}}
									</view>
									<uni-number-box :min="0" v-model="item.quantity" @change="changeValue(item)" />
								</view>
							</view>
						</uni-swipe-action-item>
					</uni-card>
				</scroll-view>
			</view>
		</view>


		<uni-fab :pattern="pattern" @fabClick="showCart">

		</uni-fab>

		<u-popup :round="10" :show="show" @close="close" @open="open">
			<u-empty v-if="this.cart.length == 0" mode="car" icon="http://cdn.uviewui.com/uview/empty/car.png">
			</u-empty>
			<scroll-view scroll-y="true" style="height: 600rpx;">
				<block v-for="(item, index) in cart" :key="index" class="block-item">
					<view class="good-detail2">
						<swiper class="good-img-swiper" circular :indicator-dots="true" :autoplay="true"
							:interval="2000" :duration="500">
							<swiper-item v-for="(img, sIndex) in item.pics" :key="sIndex">
								<image class="good-img" mode="aspectFit" :src="img" @error="imageLoadError"></image>
							</swiper-item>
						</swiper>
						<view class="good">
							<view class="good-name" style="font-weight: bold;">
								<text>{{item.name}}</text>
							</view>
							<view style="text-overflow: ellipsis;
									white-space: nowrap;
									overflow: hidden;
									width: 400rpx;">
								{{item.description}}
							</view>
							<view style="position: relative; right: -100%; top: 30px;">
								数量: X {{item.quantity}}
							</view>
						</view>
					</view>
				</block>
			</scroll-view>
			<u-button type="error" :disabled="this.cart.length == 0"
				color="linear-gradient(to right, rgb(255, 170, 255), rgb(213, 51, 186))"
				@click="createOrder">下单</u-button>
		</u-popup>

		<u-toast ref="uToast" />

		<uModal v-model="modalShow" content="aasdasd"></uModal>
		<uButton @click="modalShow = true">
			打开模态框
		</uButton>
	</view>



</template>

<script>
	import uModal from "uview-ui/components/u-modal/u-modal.vue";
	import uButton from "uview-ui/components/u-button/u-button.vue";
	import request from '@/request.js';
	export default {
		components:{
			uModal,
			uButton
		},
		data() {
			return {
				modalShow: true,
				isManager: false,
				options: [{
					text: '编辑',
					style: {
						backgroundColor: '#007aff'
					}
				}, {
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				scroll_into: '',
				scrollTop: 0,
				scrollTopCategory: 0,
				selectCardId: '',
				show: false,
				pattern: {
					backgroundColor: "pink",
					buttonColor: "pink",
					icon: "cart",
				},
				cartShow: true,
				name: '',
				shopId: 15,
				getReqParam: {
					name: '',
					shopId: 15
				},
				token: '',
				categorys: [],
				menus: [],
				cart: []
			}
		},

		onLoad() {
			this.queryRole();
		},

		onShow() {
			this.clearData();
			this.getData();
		},
		methods: {
			swipClick(e) {
				if (e.position === 'left') {
					// 编辑

				} else {
					// 删除

				}
			},
			lower() {

			},
			scroll() {

			},
			queryRole() {
				request('/user/15', 'GET', {}, '')
					.then((res) => {
						console.log(res);
						this.isManager = res.data;
					})
					.catch((err) => {
						uni.showToast({
							title: err.errMsg,
							icon: 'error',
							duration: 1500
						})
					})
			},
			reset() {
				this.clearData();
				this.getData();
			},
			// 点击类目加上背景色
			itemIze(item) {
				this.selectCardId = item.categoryId;
				this.menus = item.menus;
			},
			changeValue(item) {
				let index = this.cart.findIndex(i => i.id === item.id);
				if (index === -1) {
					this.cart.push(item);
				} else {
					this.cart.splice(index, 1, item);;
				}
				console.log('cart', this.cart);
			},
			showCart() {
				this.show = true;
				let cart = this.cart.filter(item => item.quantity > 0).map(item => ({
					...item
				}));
				console.log(cart);
				this.cart = cart;
			},
			open() {
				this.show = true;
			},
			close() {
				this.show = false;
			},
			imageLoadError(e) {
				console.log(e)
			},
			clearData() {
				this.categorys = [];
				this.menus = [];
				this.close();
			},
			getData() {
				request('/menu/list?shopId=' + this.shopId, 'GET', {}, 'menu')
					.then((res) => {
						console.log('data', res);
						this.categorys = res.data;
						this.menus = this.categorys[0].menus;
						this.selectCardId = this.categorys[0].categoryId;
					}).catch((err) => {
						console.log(err)
						uni.showToast({
							title: err.errMsg,
							icon: 'error',
							duration: 1500
						})
					});
			},

			createOrder() {
				let ids = [];
				this.cart.forEach(f => {
					let m = {
						id: f.id,
						quantity: f.quantity
					};
					ids.push(m);
				})
				let data = {
					'shopId': 15,
					'menuIds': ids
				};
				console.log('req', data);
				request('/order', 'POST', data, 'menu')
					.then((res) => {
						console.log('order', res);
						if (res.code === 0) {
							uni.showToast({
								title: '下单成功',
								icon: 'success',
								duration: '1000'
							});
							this.show = false;
							uni.switchTab({
								url: '/pages/order/order?id=' + res.data
							});
						}
					}).catch((err) => {
						console.log('err', err)
						this.show = false;
						uni.showToast({
							title: err.data.message,
							icon: 'error',
							duration: 1500
						});
					});
			},

			upper(e) {},
		}
	}
</script>

<style>
	.order-view {
		display: flex;
		position: fixed;
		left: 0;
		right: 0;
	}

	.order-left {
		background-color: #fafafa;
		width: 200rpx;
		padding-left: 0rpx !important;
		padding-right: 0rpx !important;
		overflow-y: auto;
	}

	.order-right {
		background-color: #FFFFFF;
		flex: 1;
		overflow-y: auto;
	}

	.itemize-text {
		font-size: 27rpx;
		padding: 30rpx 10rpx;
		display: flex;
		align-items: center;
		color: #797979;
	}

	.itemize-text text:nth-child(1) {
		flex: 1;
	}

	.itemize-text text:nth-child(2) {
		background-color: #eb5941;
		border-radius: 50%;
		font-size: 20rpx;
		color: #FFFFFF;
		width: 30rpx;
		height: 30rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-left: 2rpx;
	}

	.category-card {
		margin-top: 0rpx;
		margin-left: 0rpx;
		margin-bottom: 0rpx;
		margin-right: 0rpx;
	}

	.selected {
		border-color: #007aff;
		justify-content: center;
		/* 高亮边框颜色 */
		box-shadow: 0 0 10px rgba(0, 123, 255, 0.2);
		/* 阴影效果 */
		background-color: #f0f9ff;
		/* 背景颜色 */
	}

	.scroll-menu {}

	.scroll-menu-container {
		margin-left: 34%;
	}

	.good-detail2 {
		display: flex;
		border-bottom: 1rpx solid rosybrown;
	}

	.good-detail {
		display: inline-flex;
		width: 100%;
		margin-bottom: 10rpx;

		animation: animated-border 1.5s infinite;
		font-family: Arial;
		font-size: 13px;
		line-height: 30px;
		font-weight: bold;
		border: 2px solid;
		border-radius: 10px;
		padding: 15px;
	}


	.good-img-swiper {
		height: 200rpx;
		width: 200rpx;
	}

	.good-img {
		width: 100%;
		height: 100%;
	}

	.good-description {
		flex: 1;
		flex-shrink: 1;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		width: 300rpx;
	}
</style>