<template>
	<view class="order-view">
		<view class="commodity" style="display: flex; position: fixed;left: 0; right: 0;">
			<view class="order-left" style="background-color: aqua; height: 100px; width: 150rpx; overflow-y: auto;">
				
			</view>
			
			<view class="order-right" style="background-color: blue; height: 100px;flex: 1;">
				
			</view>
			<u-modal v-model="modalShow" content="aasdasd"></u-modal>
					<u-button @click="modalShow = true">
						打开模态框
					</u-button>
		</view>	
	</view>
</template>

<script>
	export default {
		data() {
			return {
				modalShow:true,
				bgTextStyle: 'dark',
				scrollTop: '200rpx',
				bgColor: '#ff0000',
				bgColorTop: '#00ff00',
				bgColorBottom: '#0000ff',
				nbTitle: '标题',
				nbLoading: false,
				nbFrontColor: '#000000',
				nbBackgroundColor: '#ffffff'
			}
		},
		methods: {
			
		},
		onTabItemTap: function(item) {
			console.log(item)
		},
		onLoad() {
			this.checkLogin('index');
		}
	}
</script>

<style>
	.container {
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
	}
</style>