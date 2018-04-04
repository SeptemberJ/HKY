import h from '../../utils/url.js'
var util = require('../../utils/util.js')
var MD5 = require('../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    User_Phone:'',
    User_Psd:'',
    BordeName: false,
    BordePsd: false,
    loadingHidden:true
    
  },
  onLoad: function () {
    console.log('onLoad---')
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        console.log(res.userInfo)
        this.setData({
          userInfo: res.userInfo
        })
      }
    })
  },
  //border焦点
  changeBorderColor_name(){
    this.setData({
      BordeName: true
    })
  },
  changeBorderColor_pds() {
    this.setData({
      BordePsd: true
    })
  },
  NormalBorder(){
    this.setData({
        BordeName: false,
        BordePsd: false
    })
  },
  //input Change
  ChangeUser_Phone(e) {
    this.setData({
      User_Phone: e.detail.value
    })
  },
  ChangeUser_Psd(e) {
    this.setData({
      User_Psd: e.detail.value
    })
  },
  //跳转注册
  GoSign(){
    wx.navigateTo({
      url: '../sign/index'
    })
  },
  //调查问卷
  ToQuestionnaire(ID){
    wx.redirectTo({
      url: '../questionnaire/index?id=' + ID
    })
  },
  //跳过问卷
  SkipQuestionnaire() {
    wx.switchTab({
      url: '../index/index'
    })
  },
  //登录
  Login(){
    //验证
    if (!this.data.User_Phone){
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '请输入手机号!'
      });
      return false
    }
    if (!this.data.User_Psd) {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '请输入密码!'
      });
      return false
    }
    this.setData({
      loadingHidden:false
    })
    let DATA = {
      ftelphone: this.data.User_Phone,
      password: MD5.hexMD5(this.data.User_Psd),
      head_img: this.data.userInfo.avatarUrl
    }
    requestPromisified({
      url: h.main + '/login',
      data: {
        logins: DATA
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {
      //   'content-type': 'application/x-www-form-urlencoded',
      //   'Accept': 'application/json'
      // }, // 设置请求的 header
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          wx.showToast({
            title: '登录成功！',
            icon: 'success',
            duration: 1500
          })
          if (res.data.collectionlist.length>0){
            this.ToQuestionnaire(res.data.collectionlist[0].id)
          }else{
            this.SkipQuestionnaire()
          }
          app.globalData.User_Phone = this.data.User_Phone
          app.globalData.User_name = res.data.registerlist[0].fname
          break
        case 0:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '登录失败'
          });
          break
        default:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！'
          });
      }
      this.setData({
        loadingHidden: true
      })
    }).catch((res) => {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
      this.setData({
        loadingHidden: true
      })
      console.log(res)
    })
    
  },
})
