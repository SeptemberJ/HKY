import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var MD5 = require('../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    EquipmentId:'',
    dataList:[
      { 'kind': 'PM2.5', 'value': '', 'img': '../../../images/icon/pm2.5.png', 'unit':'μg/m³'},
      { 'kind': 'CO2', 'value': '', 'img': '../../../images/icon/co2.png', 'unit':'ppm'},
      { 'kind': 'CO', 'value': '', 'img': '../../../images/icon/CO.png', 'unit': 'ppm'},
      { 'kind': '甲醛', 'value': '', 'img': '../../../images/icon/CH₂O.png', 'unit': 'mg/m3' },
      { 'kind': '温度', 'value': '', 'img': '../../../images/icon/temperature.png', 'unit': '°C' },
      { 'kind': 'VOCs', 'value': '', 'img': '../../../images/icon/steamer.png', 'unit': 'mg/m3' }
    ]
  },
  onLoad: function (options) {
    this.GetCurData(options.id)
    this.setData({
      EquipmentId: options.id,
      EquipmentName: options.name
    })
  },
  ToDetail(e){
    let Info = {
      Kind: e.currentTarget.dataset.kind,
      EquipmentId: this.data.EquipmentId,
    }
    wx.setStorage({
      key: "equipmentInfo",
      data: Info
    })
    wx.navigateTo({
      url: '../detail/index'
    })
  },
  //获取当前监测数据
  GetCurData(ID) {
    requestPromisified({
      url: h.main + '/selectnoqrcode?qrcodeid=' + ID,
      data: {
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {
      //   'content-type': 'application/x-www-form-urlencoded',
      //   'Accept': 'application/json'
      // }, // 设置请求的 header
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          let temp = this.data.dataList.slice(0)
          temp.map((item,idx)=>{
            switch (item.kind){
              case 'PM2.5':
                item.value = res.data.qrcodelist[0].PM25
                break
              case 'CO2':
                item.value = res.data.qrcodelist[0].CO2
                break
              case 'CO':
                item.value = res.data.qrcodelist[0].CO
                break
              case '甲醛':
                item.value = res.data.qrcodelist[0].formaldehyde
                break
              case '温度':
                item.value = res.data.qrcodelist[0].temperature
                break
              case 'VOCs':
                item.value = res.data.qrcodelist[0].VOCs
                break
            }
          })
          this.setData({
            dataList: temp
          })
          break
        case 0:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '获取监测数据失败'
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
      console.log(res)
    })
  },
})
