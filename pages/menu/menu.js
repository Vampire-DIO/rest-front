// index.js
import Toast from '@vant/weapp/toast/toast';
Page({
  data: {
    buttonDisabled: false,
    orderLoading: false,
    show: false,
    loading: true,
    active: 1,
    mainActiveIndex: 0,
    activeId: null,
    activeKey: 0,
    menuScrollHeight: 0,
    categorys: [],
    currentMenus: [],
    shopCardMap: [],
    cartInfo: 0,
    cartShow: true,
  },
 
  onClosePopup() {
    this.setData({
      show: false,
      cartShow: true
    })
  },
  onClickNav({ detail = {} }) {
    this.setData({
      mainActiveIndex: detail.index || 0,
    });
  },
  cartClick(event) {
    this.setData({
      cartShow: false,
      show: true
    })
    if(this.data.shopCardMap.length == 0){
      this.setData({
        buttonDisabled: true
      })
    }else {
      this.setData({
        buttonDisabled: false
      })
    }
  },

  popupClose(){
    this.setData({
      cartShow: true,
    })
  },
  shopCartMins(event) {
    let target = event.currentTarget.dataset.id;
    let categoryId = target.categoryId;
    let category = this.data.categorys.find(c => c.categoryId === categoryId);
    let menu = category.menus.find(m => m.id === target.id);
    let car = this.data.shopCardMap.find(c=> c.id === menu.id);
    if(car) {
      car.quantity -= 1;
    }
    if(car.quantity < 1) {
      let newCart = this.data.shopCardMap.filter(item => {
        return item.id !== car.id;
      })
      this.setData({
        shopCardMap: newCart,
        cartInfo: newCart.length
      });
    }
  },

  shopCartPlus(event) {
    let target = event.currentTarget.dataset.id;
    let categoryId = target.categoryId;
    let category = this.data.categorys.find(c => c.categoryId === categoryId);
    let menu = category.menus.find(m => m.id === target.id);
    let car = this.data.shopCardMap.find(c=> c.id === menu.id);
    let newCart = this.data.shopCardMap;
    if(car){
      car.quantity += 1;
    }else{
      let order = {
        ...menu,
        quantity: 1
      };
      newCart.push(order);
    }
    this.setData({
      cartInfo: this.data.shopCardMap.length,
      shopCardMap: newCart
    })
  },
  onClickItem({ detail = {} }) {
    const activeId = this.data.activeId === detail.id ? null : detail.id;
    this.setData({ activeId });
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
    });
    this.getMenus();
  },

  submitOrder(){
    this.setData({
      orderLoading: true,
      buttonDisabled: true
    });
    let menuIds = this.data.shopCardMap.map(item => {
      return{
        id: item.id,
        quantity: item.quantity
      };
    });
    if (menuIds.length == 0){
      return;
    }
    wx.request({
      url: 'http://localhost:8080/order',
      header: {
        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsb2dpbiIsImF1ZCI6InVzZXJzIiwiaXNzIjoiYXV0aDAiLCJuYW1lIjoiZGRkIiwiaWQiOjEsImVtYWlsIjoiZGVsaUBxcS5jb20ifQ.tHot5jwtcRSNg8SS0S2oEGSCnZ7Pep3ArIfR8zojstA'
      },
      data: {
        shopId: 15,
        menuIds: menuIds
      },
      method: 'POST',
      success: (res) => {
        console.log('POST 请求成功，返回数据：', res.data);
        if (res.data.code != 0){
          Toast.fail(res.data.message);
          this.setData({
            orderLoading: false,
            buttonDisabled: false
          });
          return;
        }
        this.setData({
          orderLoading: false,
          buttonDisabled: false
        });
        wx.switchTab({
          url: '/pages/order/order',
        })
      },
      fail: (err) => {
        console.error('POST 请求失败：', err);
        this.setData({
          orderLoading: false,
          buttonDisabled: false
        });
      }
    })
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
      success: (res) => {
        console.log(res);
        if (res.data.code != 0){
          Toast(res.message);
          return;
        }
        this.setData({
          categorys: res.data.data,
          currentMenus: res.data.data[0].menus,
          menuScrollHeight: res.data.data[0].menus.length * 128 - 128,
          activeKey: res.data.data.categoryId
        })
        console.log(this.data.currentMenus)
        wx.hideLoading()
      },
      fail: () => {
        Toast('接口异常');
        wx.hideLoading()
      }
    })
  },
  categoryChange(event) {
    this.setData({
      currentMenus: this.data.categorys[event.detail].menus
    })
  },
  onChange(event) {
    this.setData({ active: event.detail })
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
