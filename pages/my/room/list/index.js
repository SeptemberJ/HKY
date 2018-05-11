import h from '../../../../utils/url.js'
var util = require('../../../../utils/util.js')
var MD5 = require('../../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    Cur_tab: 0,
    EQList:[],
    RoomName:'',
    RoomId:null,
  },
  onLoad(options){
    this.setData({
      RoomId: options.roomid,
      RoomName: options.roomname
    })
  },
  onShow(){
    this.GetRoomEQlIST()
  },
  ChangeTab(e){
    this.setData({
      Cur_tab: e.currentTarget.dataset.idx
    })
  },
  AddEquipment(){
    wx.navigateTo({
      url: '../../../equipment/add/index?roomid=' + this.data.RoomId,
    })
  },
  //获取房间设备
  GetRoomEQlIST(e) {
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + '/selectroommachine?roomid=' + this.data.RoomId,
      data: {
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          this.setData({
            EQList: res.data.roommachine
          })
          wx.hideLoading()
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '删除失败'
          });
          break
        default:
          wx.hideLoading()
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '服务器繁忙！'
          });
      }
    }).catch((res) => {
      wx.hideLoading()
      wx.showToast({
        image: '../../../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
      console.log(res)
    })
  },
})