// import Promise from '../../../utils/blue'
import h from '../../utils/url.js'
var util = require('../../utils/util.js')
var MD5 = require('../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    User_Name:'',
    User_Phone:'',
    User_Psd:'',
    User_PsdAgain:'',
    loadingHidden:true
  },
  onLoad() {
  },
  //input change
  ChangeUser_Name(e){
    this.setData({
      User_Name:e.detail.value
    })
  },
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
  Confirm_Psd(e) {
    this.setData({
      User_PsdAgain: e.detail.value
    })
  },
  //返回登录
  ToLogin() {
    wx.navigateTo({
      url: '../login/index'
    })
  },
  //注册
  Sign(){
    //校验
    if (this.data.User_Name == '' || this.data.User_Psd == '' || this.data.User_PsdAgain == '' || this.data.User_Phone == ''){
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '请填写相关信息！',
        duration: 2000,
      });
      return false
    }
    if (!(/^1[34578]\d{9}$/).test(this.data.User_Phone)){
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '手机号格式！',
        duration: 2000,
      });
      return false
    }
    if (this.data.User_Psd != this.data.User_PsdAgain){
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '密码不一致',
        duration: 2000,
      });
      return false
    }
    let DATA = {
      fname: this.data.User_Name,
      ftelphone: this.data.User_Phone,
      password: MD5.hexMD5(this.data.User_Psd),
      laiyuan :1
    }
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + '/register',
      data: {
        registers: DATA
      },
      method: 'POST',
    }).then((res) => {
      switch (res.data.result){
        case 1:
          wx.hideLoading()
          wx.showToast({
            title: '注册成功！',
            icon: 'success',
            duration: 2000,
          })
          this.ToLogin()
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '注册失败!',
            duration: 2000,
          });
          break
        case 2:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '用户名重复!',
            duration: 2000,
          });
          break
        case 3:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '手机号重复！',
            duration: 2000,
          });
          break
        default:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！',
            duration: 2000,
          });
      }
      }).catch((res) => {
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          image: '../../images/icon/attention.png',
          title: '服务器繁忙！',
          duration: 2000,
        });
    })
  }
})
