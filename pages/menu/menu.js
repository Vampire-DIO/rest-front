// index.js
Page({
  data: {
    loading: true,
    active: 1,
    mainActiveIndex: 0,
    activeId: null,
    activeKey: 0,
    menuScrollHeight: 0,
    menus: new Map(),
    categorys: [],
    currentMenus:[]
  },

  

  onClickNav({ detail = {} }) {
    this.setData({
      mainActiveIndex: detail.index || 0,
    });
  },

  onClickItem({ detail = {} }) {
    const activeId = this.data.activeId === detail.id ? null : detail.id;

    this.setData({ activeId });
  },
  onLoad: function(){
    wx.showLoading({
      title: '加载中',
    });
    this.getMenus();
  },
  getMenus() {
    wx.request({
      url: 'http://localhost:8080/menu/list',
      data: {
        shopId: 15
      },
      header: {
        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsb2dpbiIsImF1ZCI6InVzZXJzIiwiaXNzIjoiYXV0aDAiLCJuYW1lIjoiZGRkIiwiaWQiOjEsImVtYWlsIjoiZGVsaUBxcS5jb20ifQ.tHot5jwtcRSNg8SS0S2oEGSCnZ7Pep3ArIfR8zojstA'
      },
      success:(res) => {
          console.log(res);
          let map = res.data.data.reduce((acc,item) => {
            acc[item.categoryId] = item.menus;
            return acc;
          }, {});
          console.log(map);
          this.setData({
            menus: map,
            categorys: res.data.data,
            currentMenus: res.data.data[0].menus,
            menuScrollHeight: res.data.data[0].menus.length * 128 - 128,
            activeKey: res.data.data.categoryId
          })
          wx.hideLoading()
      }
    })
  },
  categoryChange(event) {
    this.setData({
      currentMenus : this.data.categorys[event.detail].menus
    })
  },
  onChange(event) {
    this.setData({active: event.detail})
  },
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        // 当前页面的 tabBar 索引
        active: 1
      })
    }
  }
})
