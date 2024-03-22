// pages/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0,
    active: 2,
    steps: [
      {
        text: '买家下单',
        desc: '描述信息',
      },
      {
        text: '商家接单',
        desc: '描述信息',
      },
      {
        text: '商家出单',
        desc: '描述信息',
      },
      {
        text: '交易完成',
        desc: '描述信息',
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  onChange(event) {
    this.setData({active: event.detail})
  },
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        // 当前页面的 tabBar 索引
        active: 2
      })
    }
  }
})