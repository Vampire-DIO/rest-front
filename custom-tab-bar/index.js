Component({
  data: {
    // 选中的 tab 
    active: null,
    // 菜单列表
    list: [
      {
        pagePath: '/pages/index/index',
        text: '首页',
        name: 'index',
        icon: 'bullhorn-o'
      },
      {
        pagePath: '/pages/menu/menu',
        text: '菜单',
        name: 'menu',
        icon: 'user-o'
      },
      {
        pagePath: '/pages/order/order',
        text: '订单',
        name: 'order',
        icon: 'logistics'
      }
    ]
  },
  methods: {
    // 标签切换
    onChange: function (event) {
      this.setData({ active: event.detail })
      wx.switchTab({
        url: this.data.list[event.detail].pagePath,
      })
    }
  }
})
