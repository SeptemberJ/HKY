import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var MD5 = require('../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    MessageCount:0,  //新消息数
  },
  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    this.GetMessage()
  },
  LogOut() {
    wx.reLaunch({
      url: '../../login/index'
    })
  },
  MyRelease() {
    wx.navigateTo({
      url: '../../Interaction/my/index'
    })
  },
  MyMessage() {
    // wx.navigateTo({
    //   url: '../../Interaction/message/index'
    // })
  },
  //获取消息
  GetMessage() {
    requestPromisified({
      url: h.main + '/selectnewinfo?ftelphone=' + app.globalData.User_Phone,
      data: {
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {
      //   'content-type': 'application/x-www-form-urlencoded',
      //   'Accept': 'application/json'
      // }, // 设置请求的 header
    }).then((res) => {
      console.log(res.data)
      switch (res.data.result) {
        case 1:
          this.setData({
            MessageCount: res.data.count
          })
          break
        case 0:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '消息获取失败!'
          });
          break
        default:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！'
          });
      }
    }).catch((res) => {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
    })
  }
})