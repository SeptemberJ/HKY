
//获取应用实例
const app = getApp()

Page({
  data: {
    dataList:[
      { 'kind': 'PM2.5', 'value': '35', 'img': '../../../images/icon/pm2.5.png', 'unit':'μg/m³'},
      { 'kind': 'CO2', 'value': '350', 'img': '../../../images/icon/co2.png', 'unit':'ppm'},
      { 'kind': 'CO', 'value': '0.1', 'img': '../../../images/icon/CO.png', 'unit': 'ppm'},
      { 'kind': '甲醛', 'value': '0.06', 'img': '../../../images/icon/CH₂O.png', 'unit': 'mg/m3' },
      { 'kind': '温度', 'value': '15', 'img': '../../../images/icon/temperature.png', 'unit': '°C' },
      { 'kind': 'VOCs', 'value': '0.2', 'img': '../../../images/icon/steamer.png', 'unit': 'mg/m3' }
    ]
  },
  onLoad: function () {

  },
  ToDetail(){
    wx.navigateTo({
      url: '../detail/index'
    })
  }
})
