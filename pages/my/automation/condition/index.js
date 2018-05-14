import h from '../../../../utils/url.js'
var util = require('../../../../utils/util.js')
var MD5 = require('../../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    IfchooseTime:false,
  },
  onLoad() {
    this.GetCurSensor(app.globalData.CurHomeId)

  },
  onShow() {

  },
  //时间切换
  ChooseTimeBlock(e) {
    this.setData({
      IfchooseTime: !this.data.IfchooseTime
    })
  },
  //选择切换
  Choose(e) {
    let Temp = this.data.SensorList
    Temp[e.currentTarget.dataset.idx].choosed = !this.data.SensorList[e.currentTarget.dataset.idx].choosed
    this.setData({
      SensorList: Temp
    })
  },
  //获取当前家下传感器列表
  GetCurSensor(CurHomeId) {
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
          Temp.map((Item, Idx) => {
            Item.choosed = false
          })
          this.setData({
            SensorList: Temp
          })
          break
        case 0:
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '传感器获取失败!'
          });
          break
        default:
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: 'D传感器服务器繁忙！'
          });
      }
    }).catch((res) => {
      wx.showToast({
        image: '../../../../images/icon/attention.png',
        title: '传感器服务器繁忙！'
      });
    })
  },
  //Submit
  Submit(){
    let ChoosedList = []
    this.data.SensorList.map((Item,Idx)=>{
      if (Item.choosed){
        ChoosedList.push(Item)
      }
    })
    if (this.data.IfchooseTime){
      let obj = {
        'icon': '../../../../images/icon/delete.png', 'name': '时间', 'room': '', 'when': 0, 'status': 0, 'kind': 'time', 'time_start': '00:00', 'time_end': '23:59' }
      ChoosedList.push(obj)
    }
    console.log(ChoosedList)
    // requestPromisified({
    //   url: h.main + '/selectregisteruser?',
    //   data: {
    //   },
    //   method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //   // header: {
    //   //   'content-type': 'application/x-www-form-urlencoded',
    //   //   'Accept': 'application/json'
    //   // }, // 设置请求的 header
    // }).then((res) => {
    //   console.log(res.data)
    //   switch (res.data.result) {
    //     case 1:
    //       wx.showToast({
    //         title: '保存成功！',
    //         icon: 'success',
    //         duration: 1500
    //       })
    //       break
    //     case 0:
    //       wx.showToast({
    //         image: '../../../../images/icon/attention.png',
    //         title: '条件保存失败!'
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
    //     image: '../../../../images/icon/attention.png',
    //     title: '服务器繁忙！'
    //   });
    // })
  }
})