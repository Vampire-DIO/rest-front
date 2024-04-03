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
						<uni-swipe-action-item :disabled="isManager" :right-options="options" @click="swipClick($event,item)">
							<view class="good-detail" :id="item.categoryId">
								<swiper class="good-img-swiper" circular :indicator-dots="true" :autoplay="true"
									:interval="2000" :duration="500">
									<swiper-item v-for="(img, sIndex) in item.pics" :key="sIndex">
										<image class="good-img" mode="aspectFit" :src="img.url" @error="imageLoadError">
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
		
		<uni-fab :v-if="isManager" horizontal="right" :pattern="editPattern" @fabClick="addNewMenu">
		
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

		<u-modal :title="modalTitle" cancelText="取消" confirmText="保存" :showCancelButton="true" 
			:show="modalShow" 
			@cancel="modalShow=false" 
			@confirm="editSubmit" 
			:asyncClose="true">
				<u-form labelPosition="left" :model="editMenu">
					<u-form-item label="名称">
						<u-input v-model="editMenu.name"></u-input>
					</u-form-item>
					<u-form-item label="分类">
						<uni-data-select v-model="editMenu.menuCategoryId"
							:localdata="categorySelectData"></uni-data-select>
					</u-form-item>
					<u-form-item label="库存状态">
						<uni-data-select v-model="editMenu.status"
							:localdata="selectStatusData"></uni-data-select>
					</u-form-item>
					<u-form-item label="描述">
						<u-textarea v-model="editMenu.description" count placeholder="描述简介">
						</u-textarea>
					</u-form-item>
					<u-form-item label="价格">
						<u-input v-model="editMenu.price"></u-input>
					</u-form-item>
					<u-form-item label="上传图片">
						<u-upload :fileList="fileList" @afterRead="uploadAfter" @delete="deletePic" multiple
							:previewFullImage="true">
						</u-upload>
					</u-form-item>
				</u-form>
		</u-modal>
	</view>



</template>

<script>
	import uModal from "uview-ui/components/u-modal/u-modal.vue";
	import uButton from "uview-ui/components/u-button/u-button.vue";
	import request from '@/request.js';
	export default {
		components: {
			uModal,
			uButton
		},
		data() {
			return {
				modalShow: false,
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
				editPattern:{
					backgroundColor: "green",
					buttonColor: "pink",
					icon: "cloud-upload-filled",
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
				cart: [],
				categorySelectData: [],
				editMenu: {
					name: '',
					description: '',
					menuCategoryId: 0,
					price: 0,
					pictures: [],
					status: ''
				},
				fileList: [],
				// true 编辑, false 新增
				isEdit: true,
				modalTitle: '编辑菜单',
				selectStatusData:[
					{
						value: '有货',
						text: '有货'
					},
					{
						value:'售罄',
						text: '售罄'
					}
				]
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
			addNewMenu(){
				this.isEdit = false;
				this.modalTitle = '新增菜品';
				this.modalShow = true;
				this.editMenu = {
					name: '',
					description: '',
					menuCategoryId: 0,
					price: 0,
					pictures: []
				}
			},
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1);
				this.editMenu.pictures.splice(event.index,1);
			},
			async uploadAfter(event) {
				let lists = [].concat(event.file);
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
				console.log('file', this.fileList);
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					let token = uni.getStorageSync('token');
					let a = uni.uploadFile({
						url: 'http://localhost:8081/picture', // 仅为示例，非真实的接口地址
						filePath: url,
						name: 'file',
						header: {
							'token': token
						},
						success: (res) => {
							if(res.statusCode === 200){
								let data = JSON.parse(res.data);
								if (data.code === 0){
									this.editMenu.pictures.push(data.data);
								}else {
									uni.showToast({
										title: data.message,
										icon: 'error',
										duration: 1500
									})
								}
							}
							setTimeout(() => {
								resolve(res.data.data)
							}, 1000)
						}
					});
				})
			},
			editSubmit() {
				if(this.isEdit){
					// 编辑
					request('/menu','PUT',this.editMenu,'')
					.then((res)=>{
						console.log('res.data', res.data);
						uni.showToast({
							title: '保存成功',
							icon: 'success',
							duration: 1500
						})
						this.modalShow = false;
						this.getData();
					}).catch((err)=>{
						console.log(err);
						uni.showToast({
							title: err.data.message,
							icon: 'error',
							duration: 1500
						})
						this.modalShow = false;
					})
				}else {
					// 新增
					request('/menu', 'POST', this.editMenu, '')
					.then((res) => {
						uni.showToast({
							title: '保存成功',
							icon: 'success',
							duration: 1500
						})
						this.modalShow = false;
						this.getData();
					})
					.catch((err)=>{
						uni.showToast({
							title: err.data.message,
							icon: 'error',
							duration: 1500
						})
						this.modalShow = false;
					})
				}
			},
			swipClick(e,item) {
				console.log(e,item);
				if (e.index === 0) {
					// 编辑
					this.modalShow = true;
					this.modalTitle = '编辑菜单';
					this.isEdit = true;
					this.editMenu.name = item.name;
					this.editMenu.description = item.description;
					this.editMenu.price = item.price;
					this.editMenu.status = item.status;
					this.editMenu.menuCategoryId = item.categoryId;
					this.editMenu.pictures = [],
					this.editMenu.id = item.id;
					item.pics.forEach(f=>{
						let file = {
							url: f.url
						}
						this.fileList.push(file);
						this.editMenu.pictures.push(f.id);
					})
				} else {
					// 删除
					request('/menu/'+ item.id,'DELETE', {},'')
						
					.then((res)=>{
						uni.showToast({
							title: '成功',
							icon: 'success',
							duration: 1500
						});
						this.getData();
					}).catch((err)=>{
						uni.showToast({
							title: err.data.message,
							icon: 'error',
							duration: 1500
						})
					})
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
				console.log(item)
				let index = this.cart.findIndex(i => i.id === item.id);
				if (index === -1) {
					this.cart.push(item);
				} else {
					this.cart.splice(index, 1, item);;
				}
			},
			showCart() {
				this.show = true;
				let cart = this.cart.filter(item => item.quantity > 0).map(item => ({
					...item
				}));
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
						console.log('data', res.data);
						this.categorySelectData = [];
						res.data.forEach(f => {
							let data = {
								text: f.categoryName,
								value: f.categoryId
							};
							this.categorySelectData.push(data);
							if (f.menus.length != 0){
								let menuWithQunatity = f.menus.map(item=>{
									return{
										...item,
										quantity: 0
									}
								});
								f.menus = menuWithQunatity;
							}
						});
						this.categorys = res.data;
						this.menus = this.categorys[0].menus;
						this.selectCardId = this.categorys[0].categoryId;
						console.log('cateog',this.categorys)
					}).catch((err) => {
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
				request('/order', 'POST', data, 'menu')
					.then((res) => {
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