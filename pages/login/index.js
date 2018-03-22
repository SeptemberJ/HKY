
//获取应用实例
const app = getApp()

Page({
  data: {
    BordeName: false,
    BordePsd: false
    
  },
  onLoad: function () {

  },
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
  GoSign(){
    wx.navigateTo({
      url: '../sign/index'
    })
  },
  Login(){
    wx.navigateTo({
      url: '../questionnaire/index'
    })
  }
})
