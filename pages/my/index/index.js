import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var MD5 = require('../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {}
  },
  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  LogOut() {
    wx.reLaunch({
      url: '../login/index'
    })
  },
  MyRelease() {
    wx.navigateTo({
      url: '../../Interaction/my/index'
    })
  },
  MyMessage() {
    wx.navigateTo({
      url: '../../Interaction/message/index'
    })
  },
})