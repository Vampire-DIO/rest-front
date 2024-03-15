<template>
	<view class="bodys">
		<view class="scroll_box" id="scroll_box">
			<scroll-view :style="{ height: scrollHeight + 'px' }" scroll-y='true' class="left_box "
				:scroll-into-view="leftIntoView">
				<view class="left_item" v-for="(item,i) in leftArray" :key='i' @click="onLeft" :data-index="i"
					:id="'left-'+i" :class="{select:i == leftIndex}">
					{{item}}
				</view>
			</scroll-view>
			<scroll-view :style="{ height: scrollHeight + 'px' }" @scroll="mainScroll" :scroll-into-view="scrollInto"
				scroll-y='true' class="right_box" scroll-with-animation="true">
				<slot></slot>
				<view class="right_item" v-for="(item,i) in rightArray" :key='i' :id="'item-'+i">
					<view class="rigth_title">
						{{item.title}}
					</view>
					
					<view class="lis" v-for="(product,j) in item.list" :key='j'>
						<!-- 商品图片 -->
						<view class="product-image">
						  <image :src="product.image" class="image"></image>
						</view>
						<!-- 商品信息 -->
						<view class="product-info">
						  <!-- 商品名称 -->
						  <view class="product-name">{{ product.name }}</view>
						  <!-- 商品价格和已售数量 -->
						  <view class="product-details">
						    <text class="price">￥{{ product.price }}</text>
						    <text class="sold-count">已售{{ product.soldCount }}件</text>
						  </view>
						  <!-- 选择框和数量控制 -->
						  <view class="selection">
						    <view class="minus-btn" @click="decrement(index)">-</view>
						    <view class="quantity">{{ product.quantity }}</view>
						    <view class="plus-btn" @click="increment(index)">+</view>
						  </view>
						</view>
					</view>
				</view>
				<view class="fill-last" :style="{ height: fillHeight + 'px' }"></view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "side-navigation",
		data() {
			return {
				leftArray: [],
				rightArray: [],
				scrollHeight: 400,
				scrollInto: "",
				leftIndex: 0,
				topArr: [],
				scrollTopSize: 0,
				fillHeight: 0, // 填充高度，用于最后一项低于滚动区域时使用
			}
		},
		computed: {
			/* 计算左侧滚动位置定位 */
			leftIntoView() {
				return `left-${this.leftIndex > 3 ? this.leftIndex - 3 : 0}`;
			}
		},
		mounted() {
			/* 等待DOM挂载完成 */
			this.$nextTick(() => {
				/* 在非H5平台，nextTick回调后有概率获取到错误的元素高度，则添加200ms的延迟来减少BUG的产生 */
				setTimeout(() => {
					/* 等待滚动区域初始化完成 */
					this.initScrollView().then(() => {
						/* 获取列表数据，你的代码从此处开始 */
						this.getListData();
					});
				}, 200);
			});
		},
		methods: {
			/* 初始化滚动区域 */
			initScrollView() {
				return new Promise((resolve, reject) => {
					let view = uni.createSelectorQuery().select('#scroll_box');
					view.boundingClientRect(res => {
						console.log(res);
						this.scrollTopSize = res.top;
						this.scrollHeight = res.height;
						this.$nextTick(() => {
							resolve();
						});
					}).exec();
				});
			},
			// 获取数据
			getListData() {
				new Promise((resolve, reject) => {
					uni.showLoading();
					setTimeout(() => {
						let [left, main] = [
							[],
							[]
						];

						for (let i = 0; i < 25; i++) {
							left.push(`${i + 1}类商品`);

							let list = [];
							let r = Math.floor(Math.random() * 10);
							r = r < 1 ? 3 : r;
							for (let j = 0; j < r; j++) {
								let url = "/static/test/" + (j+1) + ".jpg";
								let name = "商品" + j;
								let price = "39.9";
								let soldCount = j + 50;
								
								list.push(j);
							}
							main.push({
								title: `第${i + 1}类商品标题`,
								list
							});
						}

						// 将请求接口返回的数据传递给 Promise 对象的 then 函数。
						resolve({
							left,
							main
						});
					}, 1000);
				}).then(res => {
					uni.hideLoading();
					this.leftArray = res.left;
					this.rightArray = res.main;
					// DOM 挂载后 再调用 getElementTop 获取高度的方法。
					this.$nextTick(() => {
						this.getElementTop();
					});
				});
			},
			// 获取元素顶部信息
			getElementTop() {
				new Promise((resolve, reject) => {
					let view = uni.createSelectorQuery().selectAll('.right_item');
					view.boundingClientRect(data => {
						resolve(data);
					}).exec();
				}).then(res => {
					console.log(res);
					let topArr = res.map(item => {
						return item.top - this.scrollTopSize; /* 减去滚动容器距离顶部的距离 */
					});
					this.topArr = topArr;

					/* 获取最后一项的高度，设置填充高度。判断和填充时做了 +-20 的操作，是为了滚动时更好的定位 */
					let last = res[res.length - 1].height;
					if (last - 20 < this.scrollHeight) {
						this.fillHeight = this.scrollHeight - last + 20;
					}
				});
			},
			// 点击左侧导航
			onLeft(e) {
				const index = e.currentTarget.dataset.index;
				// this.leftIndex = index
				this.scrollInto = `item-${index}`
			},
			// 右侧滑动
			mainScroll(e) {
				let top = e.detail.scrollTop;
				let index = 0;
				/* 查找当前滚动距离 */
				for (let i = this.topArr.length - 1; i >= 0; i--) {
					/* 在部分安卓设备上，因手机逻辑分辨率与rpx单位计算不是整数，滚动距离与有误差，增加2px来完善该问题 */
					if (top + 2 >= this.topArr[i]) {
						index = i;
						break;
					}
				}
				this.leftIndex = index < 0 ? 0 : index;
			},
		},

	}
</script>

<style>
	page,.bodys {
		height: 100%;
	}

	.scroll_box {
		display: flex;
		height: 100%;
	}

	.left_box {
		width: 30%;
		border-right: 1px solid #e2e7c8;
		background-color: #fae3ef;
	}

	.left_item {
		height: 80rpx;
		display: grid;
		place-items: center;
	}

	.lis {
		height: 200rpx;
		border-radius: 10rpx;
		background: #808080;
		color: #FFFFFF;
		text-align: center;
		line-height: 200rpx;
		margin-bottom: 10rpx;
	}

	.select {
		  border-color: #007bff; 
		  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.1); 
		  background-color: #f8f9fa; 
	}
</style>

