import h from '../../../../utils/url.js'
var util = require('../../../../utils/util.js')
var MD5 = require('../../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    EQList:[]
  },
  onLoad(){

  },
  onShow() {
    //this.GetCurEQList(app.globalData.CurHomeId)
    this.GetCurEQList('68efa6a3-24f9-49de-9336-fb5cb9549ea0')

  },
  //选择切换
  Choose(e){
    let Temp = this.data.EQList
    Temp[e.currentTarget.dataset.idx].choosed = !this.data.EQList[e.currentTarget.dataset.idx].choosed
    this.setData({
      EQList: Temp
    })
  },
  //获取当前家下设备列表
  GetCurEQList(CurHomeId) {
    requestPromisified({
      url: h.main + '/selectregisteruser?homeid=' + CurHomeId,
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
          let Temp = res.data.registermachine
          Temp.map((Item,Idx)=>{
            Item.choosed = false
          })
          this.setData({
            EQList: Temp
          })
          break
        case 0:
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '设备获取失败!'
          });
          break
        default:
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: 'D家设备服务器繁忙！'
          });
      }
    }).catch((res) => {
      wx.showToast({
        image: '../../../../images/icon/attention.png',
        title: '家设备服务器繁忙！'
      });
    })
  },
})