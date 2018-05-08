import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var MD5 = require('../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    Equipment_Name: '',
    Equipment_Code_F: '',
    Equipment_Code_S: '',
    
  },
  //input change
  ChangeEquipment_Name(e) {
    this.setData({
      Equipment_Name: e.detail.value
    })
  },
  ChangeEquipment_Code_F(e) {
    this.setData({
      Equipment_Code_F: e.detail.value
    })
  },
  ChangeEquipment_Code_S(e) {
    this.setData({
      Equipment_Code_S: e.detail.value
    })
  },
  //扫码
  Scan_Code_F() {
    wx.scanCode({
      success: (res) => {
        this.setData({
          Equipment_Code_F: res.result
        })
      }
    })
  },
  Scan_Code_S(){
    wx.scanCode({
      success: (res) => {
        this.setData({
          Equipment_Code_S: res.result
        })
      }
    })
  },
  //新增设备
  AddEquipment() {
    //校验
    if (!this.data.Equipment_Name || !this.data.Equipment_Code_F || !this.data.Equipment_Code_S) {
      wx.showToast({
        image: '../../../images/icon/attention.png',
        title: '请填写相关信息！'
      });
      return false
    }
    let DATA = {
      second_name: this.data.Equipment_Name,
      master_control: this.data.Equipment_Code_F,
      second_qrcode: this.data.Equipment_Code_S,
      ftelphone: app.globalData.User_Phone,
      homeid: app.globalData.CurHomeId,
    }
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + '/selectqrcode',
      data: {
        qrcodes: DATA
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {
      //   'content-type': 'application/x-www-form-urlencoded',
      //   'Accept': 'application/json'
      // }, // 设置请求的 header
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          wx.hideLoading()
          wx.showToast({
            title: '新增成功！',
            icon: 'success',
            duration: 1500
          })
          //返回
          wx.navigateBack();
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../../images/icon/attention.png',
            title: '新增失败'
          });
          break
        default:
          wx.hideLoading()
          wx.showToast({
            image: '../../../images/icon/attention.png',
            title: '服务器繁忙！'
          });
      }
    }).catch((res) => {
      wx.hideLoading()
      wx.showToast({
        image: '../../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
      console.log(res)
    })
  },

  })