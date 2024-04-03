<template>
	<view class="order-view">
		<view class="commodity" style="display: flex; position: fixed;left: 0; right: 0;">
			<view class="order-left" style="background-color: aqua; height: 100px; width: 150rpx; overflow-y: auto;">

			</view>

			<view class="order-right" style="background-color: blue; height: 100px;flex: 1;">

			</view>

		</view>
		<u-upload :file-list="fileList" @success="onUploadSuccess">
			<template v-slot:default>
				<u-upload :fileList="uploadedImages" @afterRead="uploadAfter" @delete="deletePic" multiple
					:previewFullImage="true">
				</u-upload>
			</template>
		</u-upload>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				bgTextStyle: 'dark',
				scrollTop: '200rpx',
				bgColor: '#ff0000',
				bgColorTop: '#00ff00',
				bgColorBottom: '#0000ff',
				nbTitle: '标题',
				nbLoading: false,
				nbFrontColor: '#000000',
				nbBackgroundColor: '#ffffff',
				uploadedImages: [{
					url: 'http://106.13.196.131:9000/rest/fc90024b-a308-4f93-b615-3a8efbbaa0ee_0x300a0a0.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=V3GH8Kr0tJWhc7r4EBdI%2F20240403%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240403T055343Z&X-Amz-Expires=43200&X-Amz-SignedHeaders=host&X-Amz-Signature=5f867ac61dba86dd75a5a4689f9bf127c08d93307a2a4ef82f0726bafb1cd1ba'
				}]
			}
		},
		methods: {
			onUploadSuccess() {},
			uploadAfter() {},
			deletePic() {}
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