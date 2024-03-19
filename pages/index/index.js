// index.js
Page({
  data: {
    active: 0,
  },
  onChange(event) {
    this.setData({active: event.detail})
  },
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        // 当前页面的 tabBar 索引
        active: 0
      })
    }
  }
})
