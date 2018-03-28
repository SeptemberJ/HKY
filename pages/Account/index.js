
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo:{}
  },
  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  LogOut(){
    wx.reLaunch({
      url: '../login/index'
    })
  }
})
