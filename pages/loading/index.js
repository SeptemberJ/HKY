import h from '../../utils/url.js'
var util = require('../../utils/util.js')
var MD5 = require('../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {

  },
  onLoad(){
    wx.showLoading({
      title: '加载中',
    })
    wx.getStorage({
      key: 'UserInfo',
      success: (res) => {
        app.globalData.User_Phone = res.data.User_Phone
        app.globalData.User_name = res.data.User_name
        console.log(app.globalData.User_Phone)
        wx.switchTab({
          url: '../index/index'
        })
      },
      fail: (res) => {
        wx.navigateTo({
          url: '../login/index'
        })
      },
      complete: (res) => {
        wx.hideLoading()
      },
    })
  },
})