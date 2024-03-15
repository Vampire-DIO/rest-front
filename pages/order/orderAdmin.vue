<template>
  <view class="container">
    <view class="product-line" v-for="(product, index) in products" :key="index">
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
</template>

<script>
export default {
  data() {
    return {
      products: [
        { name: '商品1', image: '/static/test/1.jpg', price: 39.9, soldCount: 200, quantity: 0 },
        { name: '商品2', image: '/static/test/2.jpg', price: 49.9, soldCount: 150, quantity: 0 },
        // 更多商品...
      ]
    };
  },
  methods: {
    increment(index) {
      // 增加商品数量
      this.products[index].quantity++;
    },
    decrement(index) {
      // 减少商品数量
      if (this.products[index].quantity > 0) {
        this.products[index].quantity--;
      }
    }
  }
};
</script>

<style>
.container {
  padding: 10px;
}

.product-line {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100px; /* 图片宽度，根据需要调整 */
  height: 100px; /* 图片高度，与行高相同 */
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 覆盖并保持宽高比 */
}

.product-info {
  flex: 1;
  padding: 10px;
}

.product-name {
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
}

.product-details {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
}

.price {
  color: #f44336;
}

.sold-count {
  margin-left: 10px;
}

.selection {
  display: flex;
  align-items: center;
}

.minus-btn,
.plus-btn {
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 50%;
  margin: 0 5px;
}

.quantity {
  width: 40px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border: 1px solid #ddd;
  margin: 0 5px;
  display: inline-block;
}
</style>