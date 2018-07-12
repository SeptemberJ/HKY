import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var MD5 = require('../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)

const app = getApp();
var rate = 0;
var canvasWidth = 0;
var canvasHeight = 0;
var DATA = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lineCanvasData: {
      canvasId: 'lineAreaCanvas',
    },
    Kind: 'PM2.5',
    Unit: '',
    EquipmentId: '',
    EquipmentName:'',
    Number:'',
    DataInfo: [],
    CurTab: 0,
    TabMenu: ['近6h', '近12h', '近24h'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(app.globalData.systemInfo);
    var systemInfo = app.globalData.systemInfo;
    rate = systemInfo.screenWidth / 750;
    var updateData = {};
    canvasWidth = systemInfo.screenWidth - rate * 64;
    canvasHeight = rate * 306 + rate * 44 + rate * 34 + rate * 22;

    var yMax = 100;
    var yMin = 0;
    var xMax = 30;
    var xMin = 0;
    updateData['lineCanvasData.canvasWidth'] = canvasWidth;
    updateData['lineCanvasData.axisPadd'] = { left: rate * 5, top: rate * 44, right: rate * 5 };
    updateData['lineCanvasData.axisMargin'] = { bottom: rate * 34, left: rate * 26 };
    updateData['lineCanvasData.yAxis.fontSize'] = rate * 22;
    updateData['lineCanvasData.yAxis.fontColor'] = '#637280';
    updateData['lineCanvasData.yAxis.lineColor'] = '#DCE0E6';
    updateData['lineCanvasData.yAxis.lineWidth'] = rate * 2;
    updateData['lineCanvasData.yAxis.dataWidth'] = rate * 62;
    updateData['lineCanvasData.yAxis.isShow'] = true;
    updateData['lineCanvasData.yAxis.isDash'] = true;
    updateData['lineCanvasData.yAxis.minData'] = yMin;
    updateData['lineCanvasData.yAxis.maxData'] = yMax;
    updateData['lineCanvasData.yAxis.padd'] = rate * 306 / (yMax - yMin);

    updateData['lineCanvasData.xAxis.dataHeight'] = rate * 26;
    updateData['lineCanvasData.xAxis.fontSize'] = rate * 22;
    updateData['lineCanvasData.xAxis.fontColor'] = '#637280';
    updateData['lineCanvasData.xAxis.lineColor'] = '#DCE0E6';
    updateData['lineCanvasData.xAxis.lineWidth'] = rate * 2;
    updateData['lineCanvasData.xAxis.minData'] = xMin;
    updateData['lineCanvasData.xAxis.maxData'] = xMax;
    updateData['lineCanvasData.xAxis.padd'] = (canvasWidth - rate * 103) / (xMax - xMin);

    updateData['lineCanvasData.point'] = { size: rate * 4, isShow: false };
    updateData['lineCanvasData.canvasHeight'] = canvasHeight;
    updateData['lineCanvasData.enableScroll'] = true;


    this.setData(updateData);
    //----------------------------
    wx.getStorage({
      key: 'equipmentInfo',
      success: (res) => {
        switch (res.data.Kind) {
          case 'PM2.5':
            this.setData({
              Unit: 'μg/m³',
            })
            break
          case 'CO2':
            this.setData({
              Unit: 'ppm',
            })
            break
          case 'CO':
            this.setData({
              Unit: 'ppm',
            })
            break
          case '甲醛':
            this.setData({
              Unit: 'mg/m³',
            })
            break
          case '温度':
            this.setData({
              Unit: '℃',
            })
            break
          case 'VOCs':
            this.setData({
              Unit: '等级',
            })
            break
        }
        this.setData({
          Kind: res.data.Kind,
          EquipmentId: res.data.EquipmentId,
          EquipmentName: res.data.EquipmentName,
          Number: res.data.Data,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.GetDataFn(6)
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //console.log("22222");
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  ChangeTab(e){
    let IDX = e.currentTarget.dataset.idx
    let DAY
    switch (IDX) {
      case 0:
        DAY = 6
        break
      case 1:
        DAY = 12
        break
      case 2:
        DAY = 24
        break
    }
    this.setData({
      CurTab: IDX,
      Day: DAY
    })
    this.GetDataFn(DAY)
  },
  GetDataFn(DAY) {
    wx.getStorage({
      key: 'equipmentInfo',
      success: (res) => {
        DATA = {
          day: DAY,
          qrcodeid: res.data.EquipmentId,
          kind: res.data.Kind,
        }
        wx.showLoading({
          title: '加载中',
        })
        requestPromisified({
          url: h.main + '/selectnoqrcode1',
          data: {
            qrcodes: DATA
          },
          method: 'POST',
        }).then((res) => {
          //console.log(LimitRange[DATA.kind])
          
          let DataY = []
          let DataX = []
          let temp = res.data.qrcodelist.slice(0)
          let temp2 = res.data.qrcodelist.slice(0)
          temp.map((item, idx) => {
            let objY = {
              x: idx,
              y: item[1],
              title: ""
            }
            let objX = {
              x: idx,
              y: 0,
              title: ''
            }
            DataY.push(objY)
            DataX.push(objX)
          })
          //---------------------
          var systemInfo = app.globalData.systemInfo;
          rate = systemInfo.screenWidth / 750;
          var updateData = {};
          canvasWidth = systemInfo.screenWidth - rate * 64;
          canvasHeight = rate * 306 + rate * 44 + rate * 34 + rate * 22;

          temp2.sort(function (a, b) {
            return -(a[1] - b[1]);
          });
          let Maxdata = temp2[0][1]
          let len = Math.ceil(Maxdata / 4);

          console.log(temp2)

          var yMax = len * 4;
          var yMin = 0;
          var xMax = 30;
          var xMin = 0;
          var series = [{
            data: DataY
          }];
          var xAxisData = DataX;
          
          console.log(Maxdata)
          console.log(len)
          var yAxisData = [
            { x: 0, y: 0, title: '0' },
            { x: 0, y: len, title: len },
            { x: 0, y: len * 2, title: len * 2 },
            { x: 0, y: len * 3, title: len * 3 },
            { x: 0, y: len * 4, title: len * 4 },
          ];
          // var yAxisData = [
          //   { x: 0, y: 0, title: '0' },
          //   { x: 0, y: 10, title: '10' },
          //   { x: 0, y: 20, title: '20' },
          //   { x: 0, y: 30, title: '30' },
          //   { x: 0, y: 40, title: '40' },
          //   { x: 0, y: 50, title: '50' }
          // ];
          yMax = Maxdata;
          yMin = 0;
          xMax = 6;
          xMin = 0;
          updateData['lineCanvasData.xAxis.minData'] = xMin;
          updateData['lineCanvasData.xAxis.maxData'] = xMax;
          updateData['lineCanvasData.xAxis.padd'] = (canvasWidth - rate * 98) / (xMax - xMin);
          updateData['lineCanvasData.point'] = { size: rate * 4, isShow: true };
          updateData['lineCanvasData.yAxis.minData'] = yMin;
          updateData['lineCanvasData.yAxis.maxData'] = yMax;
          updateData['lineCanvasData.yAxis.padd'] = rate * 306 / (yMax - yMin);
          updateData['lineCanvasData.series'] = series;
          updateData['lineCanvasData.xAxis.data'] = xAxisData;
          updateData['lineCanvasData.yAxis.data'] = yAxisData;
          this.setData(updateData);
          //---------------------
          wx.hideLoading()
        }).catch((res) => {
          wx.hideLoading()
          wx.showToast({
            image: '../../../images/attention.png',
            title: '服务器繁忙！'
          });
          console.log(res)
        })
      }
    })
  },
  




})
