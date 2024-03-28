<template>
	<view class="container" style="background-color: pink;">
		<uni-row :gutter="0">
			<uni-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1" style=" background-color: aqua;">
				<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y">
					<block v-for="(item, index) in categorys" :key="index">
						<view>
							<text>{{item.categoryName}}</text>
						</view>
					</block>
				</scroll-view>
			</uni-col>
			<uni-col :xs="16" :sm="18" :md="20" :lg="21" :xl="23">
				<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper"
					@scrolltolower="lower" @scroll="scroll">
					<block v-for="(item, index) in menus" :key="index" class="block-item">
						<view class="good-detail">
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
								<view class="good-soldNum" style="font-weight: bold;">
									已售: {{item.soldNum}}
								</view>
								<view class="good-description">
									{{item.description}}
								</view>
								<uni-number-box @change="changeValue" />
							</view>
						</view>
					</block>
				</scroll-view>
			</uni-col>
		</uni-row>


		<uni-fab v-if="cartShow" :pattern="pattern" @fabClick="showCart">

		</uni-fab>


		<u-popup :show="show" @close="close" @open="open">
			<view>
				<text>出淤泥而不染，濯清涟而不妖</text>
			</view>
			<u-empty
			        mode="car"
			        icon="http://cdn.uviewui.com/uview/empty/car.png"
			>
			</u-empty>
		</u-popup>
		<u-button @click="show = true">打开</u-button>
	</view>


</template>

<script>
	import request from '@/request.js';
	export default {
		data() {
			return {
				show: true,
				pattern: {
					backgroundColor: "pink",
					buttonColor: "pink",
					icon: "cart",
				},
				cartShow: true,
				scrollTop: 0,
				name: '',
				shopId: 15,
				getReqParam: {
					name: '',
					shopId: 15
				},
				token: '',
				categorys: [],
				menus: []
			}
		},

		onShow() {
			this.clearData();
			this.getData();
		},
		methods: {
			open() {
				this.show = true;
			},
			close() {
				this.show = false;
			},
			showCart() {
				this.cartShow = false;
				this.popupShow = true;
			},
			imageLoadError(e) {
				console.log(e)
			},
			clearData() {
				this.categorys = [];
				this.menus = [];
			},
			getData() {
				request('/menu/list?shopId=' + this.shopId, 'GET', {}, 'menu')
					.then((res) => {
						console.log('data', res);
						this.categorys = res.data;
						for (let i = res.data.length - 1; i >= 0; i--) {
							this.menus.push(
								...res.data[i].menus
							);
						}
					}).catch((err) => {
						console.log(err)
						uni.showToast({
							title: err.errMsg,
							icon: 'error',
							duration: 1500
						})
					});
				// uni.request({
				// 	url: 'http://localhost:8081/menu/list?shopId=' + this.shopId,
				// 	method: 'GET',
				// 	header: {
				// 		'token': this.token
				// 	},
				// 	success: (res) => {
				// 		console.log(res);
				// 		if (res.data.code != 0) {
				// 			uni.showToast({
				// 				title: res.data.message,
				// 				icon: 'error',
				// 				duration: 1500
				// 			})
				// 			return;
				// 		}
				// 		this.categorys = res.data.data;
				// 	},
				// 	fail: (err) => {
				// 		console.log(err);
				// 		uni.showToast({
				// 			title: err.errMsg,
				// 			icon: 'error',
				// 			duration: 1500
				// 		})
				// 	}
				// })
			},
			upper(e) {},
			scroll(e) {
				console.log(e)
			},
			lower() {

			}
		}
	}
</script>

<style>
	.good-detail {
		display: inline-flex;
		width: 100%;
		margin-bottom: 10rpx;

		animation: animated-border 1.5s infinite;
		font-family: Arial;
		font-size: 18px;
		line-height: 30px;
		font-weight: bold;
		color: white;
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