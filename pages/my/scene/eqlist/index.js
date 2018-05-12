import h from '../../../../utils/url.js'
var util = require('../../../../utils/util.js')
var MD5 = require('../../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    EQList: [{ 'icon': '../../../../images/icon/delete.png', 'name': '灯带', 'room': '玄关', 'status': 0, 'when': 0 }, { 'icon': '../../../../images/icon/delete.png', 'name': '水晶灯', 'room': '传统', 'status': 1, 'when': 2 }],
    multiIndexList:[],
    multiIndex_0: [0, 0],
    multiIndex_1: [0, 0],
    objectMultiArray: [
      [
        {
          id: 0,
          name: '打开'
        },
        {
          id: 1,
          name: '关闭'
        }
      ], [
        {
          id: 0,
          name: '立即'
        },
        {
          id: 1,
          name: '1分钟'
        },
        {
          id: 2,
          name: '2分钟'
        },
        {
          id: 3,
          name: '3分钟'
        },
        {
          id: 4,
          name: '4分钟'
        },
        {
          id: 5,
          name: '5分钟'
        }
      ]
    ],
  },
  onLoad() {
    let IndexList =[]
    this.data.EQList.map((Item,Idx)=>{
      let temp = [Item.status, Item.when]
      IndexList.push(temp)
    })
    this.setData({
      multiIndexList: IndexList
    })
  },
  onShow() {

  },
  Delete(e){
    wx.showModal({
      title: '提示',
      content: '确定移除该设备？',
      success: (res)=> {
        if (res.confirm) {
          // wx.showLoading({
          //   title: '加载中',
          //   mask: true,
          // })
          // requestPromisified({
          //   url: h.main + '/insertroom?id=' + e.currentTarget.dataset.idx,
          //   data: {
          //     id: e.currentTarget.dataset.idx
          //   },
          //   method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // }).then((res) => {
          //   switch (res.data.result) {
          //     case 1:
          //       this.GetEQlist()
          //       var pages = getCurrentPages();
          //       if (pages.length > 1) {
          //         var prePage = pages[pages.length - 2];
          //         prePage.GetCurRoomList()
          //       }
          //       wx.navigateBack()
          //       break
          //     case 0:
          //       wx.showToast({
          //         image: '../../../../images/icon/attention.png',
          //         title: '创建房间失败!'
          //       });
          //       break
          //     default:
          //       wx.showToast({
          //         image: '../../../../images/icon/attention.png',
          //         title: '服务器繁忙！'
          //       });
          //   }
          // }).catch((res) => {
          //   wx.showToast({
          //     image: '../../../../../images/icon/attention.png',
          //     title: '服务器繁忙！'
          //   });
          // })
        } else if (res.cancel) {
          
        }
      }
    })
  },
  bindMultiPickerChange(e) {
    let Temp = this.data.multiIndexList
    Temp[e.currentTarget.dataset.idx] = e.detail.value
    this.setData({
      multiIndexList: Temp
    })
  },
  //已加入的设备列表
  GetEQlist(){
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true,
    // })
    // requestPromisified({
    //   url: h.main + '/insertroom?id=' + e.currentTarget.dataset.idx,
    //   data: {
    //     id: e.currentTarget.dataset.idx
    //   },
    //   method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    // }).then((res) => {
    //   switch (res.data.result) {
    //     case 1:
    //       var pages = getCurrentPages();
    //       if (pages.length > 1) {
    //         var prePage = pages[pages.length - 2];
    //         prePage.GetCurRoomList()
    //       }
    //       wx.navigateBack()
    //       break
    //     case 0:
    //       wx.showToast({
    //         image: '../../../../images/icon/attention.png',
    //         title: '创建房间失败!'
    //       });
    //       break
    //     default:
    //       wx.showToast({
    //         image: '../../../../images/icon/attention.png',
    //         title: '服务器繁忙！'
    //       });
    //   }
    // }).catch((res) => {
    //   wx.showToast({
    //     image: '../../../../../images/icon/attention.png',
    //     title: '服务器繁忙！'
    //   });
    // })
  },
  //加入设备
  ToAddEq(){
    wx.navigateTo({
      url: '../eqadd/index',
    })
  }
})