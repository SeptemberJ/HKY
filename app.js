import h from './utils/url.js'
var util = require('./utils/util.js')
var requestPromisified = util.wxPromisify(wx.request)
//app.js
App({
  onLaunch: function () {
    // wx.getSetting({
    //   success(res) {
    //     if (!res.authSetting['scope.userLocation']) {
    //       wx.openSetting({
    //         success: (res) => {
    //           res.authSetting = {
    //             "scope.userInfo": true,
    //             "scope.userLocation": true
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 本机信息
    wx.getSystemInfo({
      success: (res)=> {
        this.globalData.width = res.windowWidth
      }
    })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    //定位
    this.GetLocation()
  },
  GetLocation(){
    wx.getLocation({
      type: 'wgs84',
      success:(res)=> {
        console.log(res)
        this.globalData.latitude = res.latitude
        this.globalData.longitude = res.longitude
        //this.convertCity(res.latitude, res.longitude, this)
      },
      fail: (res) => {
        wx.showToast({
          image: '../images/icon/attention.png',
          title: '定位未授权!'
        });
      }
    })
  },
  // 经纬度转换城市
  convertCity: function (Lat, Lng, _this) {
    var requestConvertPromisified = util.wxPromisify(wx.request);
    requestConvertPromisified({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=2ojY8H4BNgtoDyzXfNKTE87OCpNNm1yH&location=' + Lat + ',' + Lng + '&output=json',
      // url: 'https://api.map.baidu.com/telematics/v3/weather?ak=2ojY8H4BNgtoDyzXfNKTE87OCpNNm1yH&location=上海市普陀区' + '&output=json',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((res) => {
      _this.globalData.city = res.data.result.addressComponent.city
    }).catch((res) => {
    })
  },
  globalData: {
    width:'',
    userInfo: null,
    User_Phone: '18234567893', //18234567890',
    User_name:'',
    Add_count:'',
    city:'',
    Add_date: util.formatTime(new Date()),
    AQI:'',
    MessageCount:0,
    latitude:'',
    longitude:'',
    ifHasInfo:false,  //是否填写过身高体重
  }
})