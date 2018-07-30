import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var MD5 = require('../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)

const app = getApp();
var rate = 0;
var doubleColumnCanvasWidth = 0;
var doubleColumnCanvasHeight = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ifRestore: false,
    ctx:null,
    ctxData:null,
    ItemData:null,
    Distance: 0,
    CanvasWidth: 400,
    CanvasHeight: 300,
    PaddingLeft: 40,
    PaddingTop: 10,
    AxisXWidth: 20,
    LineWidth: 1,
    LineLong: 5,
    count: 4,
    Rate: null,
    ItemData: null,
    ChoosedIdx: 0,
    ips: [],
    StartRend: 0,
    // doubleColumnCanvasData: {
    //   canvasId: 'doubleColumn',
    // },
    // doubleColumnTitle: "",
    // doubleColumnUnit: [
    //   { color: "#13CE66", title: "" },
    //   { color: "#FFA848", title: "" }
    // ],
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
    var temp = []
   
    var ctx = wx.createCanvasContext('myCanvasAxis');
    var ctxData = wx.createCanvasContext('myCanvasData');
    
    this.setData({
      ctx: ctx,
      ctxData: ctxData,
      CanvasHeight: app.globalData.systemInfo.screenHeight - 200 - 150

    })
    wx.getStorage({
      key: 'equipmentInfo',
      success: (res) => {
        switch (res.data.Kind) {
          case 'AQI':
            this.setData({
              Unit: '--',
            })
            break
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
              Unit: 'ppm',
            })
            break
          case '温度':
            this.setData({
              Unit: '℃',
            })
            break
          case 'VOCs':
            this.setData({
              Unit: '--',
            })
            break
        }
        this.setData({
          Kind: res.data.Kind,
          EquipmentId: res.data.EquipmentId,
          EquipmentName: res.data.EquipmentName,
        })
      }
    })
    this.GetDataFn(6);
    
  },
  onShow: function () {
    this.setData({
      ctx: wx.createCanvasContext('myCanvasAxis'),
      ctxData: wx.createCanvasContext('myCanvasData'),
    })
  },

  // Y轴
  DrawAxisY: function (ctx, ItemLong, ItemData) {
    ctx.setLineWidth(this.data.LineWidth);
    ctx.setStrokeStyle("#000");
    ctx.beginPath();
    ctx.moveTo((this.data.PaddingLeft - this.data.LineWidth - this.data.LineLong), 0);
    ctx.lineTo((this.data.PaddingLeft - this.data.LineWidth - this.data.LineLong), this.data.CanvasHeight);
    ctx.stroke();
    for (var i = 0; i < 5; i++) {
      ctx.moveTo(this.data.PaddingLeft - this.data.LineWidth - this.data.LineLong, this.data.PaddingTop + (i * ItemLong));
      ctx.lineTo(this.data.PaddingLeft - this.data.LineWidth + (i * ItemLong), this.data.PaddingTop + (i * ItemLong));
      ctx.closePath();
      ctx.font = "bold 12px Arial ";
      // ctx.fillStyle = 'white';
      ctx.fillText(ItemData * (5 - i), 0, this.data.PaddingTop + (i * ItemLong) + 5);
      ctx.stroke();
    }
    ctx.draw();
  },


  DrawDataArea: function (ctx, Rate,Data) {
    console.log(Data)
    ctx.beginPath();
    ctx.setStrokeStyle("#0077FF");
    //折线
    Data.map((item, idx) => {
      ctx.save();
      ctx.restore();
      if (idx == 0) {
        ctx.moveTo((this.data.AxisXWidth / 2), this.data.CanvasHeight - item.y * Rate);
        console.log((this.data.AxisXWidth / 2))
      } else {
        ctx.lineTo(this.data.AxisXWidth * (idx + 1) - (this.data.AxisXWidth / 2), this.data.CanvasHeight - item.y * Rate);
        ctx.stroke();
      }
      //结点样式
      ctx.beginPath();
      ctx.setFillStyle('#0077FF')
      ctx.arc(this.data.AxisXWidth * (idx + 1) - (this.data.AxisXWidth / 2), this.data.CanvasHeight - item.y * Rate, 2, 0, 2 * Math.PI);
      ctx.stroke();
    })
    //结点样式
    // Data.map((item, idx) => {
    //   ctx.beginPath();
    //   ctx.setFillStyle('#0077FF')
    //   ctx.arc(this.data.AxisXWidth * (idx + 1) - (this.data.AxisXWidth / 2), this.data.CanvasHeight - item.y * Rate, 2, 0, 2 * Math.PI);
    //   ctx.stroke();
    // })
    //竖线
    ctx.save();
    ctx.restore();
    var AxisX = 1 + this.data.AxisXWidth * (this.data.ChoosedIdx + 1) - this.data.AxisXWidth / 2;
    var AxisY = this.data.CanvasHeight - this.data.ips[this.data.ChoosedIdx].y * this.data.Rate - 70;
    ctx.setLineDash([5, 5]);
    ctx.setStrokeStyle("#ccc");
    //ctx.restore();
    ctx.moveTo(AxisX, AxisY);
    ctx.lineTo(AxisX, this.data.CanvasHeight);
    ctx.stroke();
    ctx.closePath();

    ctx.draw();

  },

  Scroll: function (e) {
    console.log('Scroll-----------------')
    // console.log(e)
    this.setData({
      Distance: e.detail.scrollLeft,
      ScrollLeft: e.detail.scrollLeft,
      StartRend: Math.round(e.detail.scrollLeft / this.data.AxisXWidth)
    })
    let which = Math.round(e.detail.scrollLeft / this.data.AxisXWidth)
    console.log('which---' + which + '---' + this.data.ips[which].x)
    this.DrawLine(this.data.ips, which)
  },
  Render: function () {
    let t = this.data.StartRend
    this.data.ctxData.clearRect(0, 0, 300, this.data.CanvasHeight);
    this.setData({
      StartRend: t + 5,
      Distance: this.data.AxisXWidth * (t +5),
    })
    this.DrawLine(this.data.ips, this.data.StartRend)
  },
  /**
    * item点击事件
    */
  onIpItemClick: function (event) {
    var ctxData = wx.createCanvasContext('myCanvasData');
    var Idx = event.currentTarget.dataset.idx;
    this.setData({
      ChoosedIdx: Idx,
    });
    console.log('ChoosedIdx--' + Idx)
    console.log('this.data.StartRend--' + this.data.StartRend)
    this.DrawLine(this.data.ips, this.data.StartRend)
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
      Day: DAY,
      ChoosedIdx: 0,
      ifRestore: true,
      StartRend: 0,
    })
    this.GetDataFn(DAY)
  },
  DrawLine2: function (DATA) {
    console.log(DATA)
    var ctx = wx.createCanvasContext('myCanvasData');
    DATA.map((item, idx) => {
      if (idx == 0) {
        ctx.moveTo((this.data.AxisXWidth / 2), this.data.CanvasHeight - item.y * this.data.Rate);
      } else {
        ctx.lineTo(this.data.AxisXWidth * (idx + 1) - (this.data.AxisXWidth / 2), this.data.CanvasHeight - item.y * this.data.Rate);
        ctx.stroke();
      }
    })
    ctx.draw();
  },


  DrawLine: function (DATA, StartRendIdx) {
    console.log('DrawLine---')
    console.log('StartRendIdx---' + StartRendIdx)
    console.log(DATA)
    let RenderData = DATA.slice(StartRendIdx, StartRendIdx + 36);
    console.log(RenderData)
    console.log(RenderData[0].x)
    console.log(RenderData[0].y)
    let ctx = this.data.ctxData;
    let AxisXWidth = this.data.AxisXWidth;
    let CanvasHeight = this.data.CanvasHeight;
    let Rate = this.data.Rate;
    ctx.beginPath();
    ctx.setStrokeStyle("#3498db");
    RenderData.map((item, idx) => {
      if (idx == 0) {
        ctx.moveTo((AxisXWidth / 2), CanvasHeight - item.y * Rate);
      } else {
        ctx.lineTo(AxisXWidth * (idx) + (AxisXWidth / 2), CanvasHeight - item.y * Rate);
        ctx.stroke();
      }
      //结点
      ctx.beginPath();
      ctx.setFillStyle('#3498db');
      ctx.arc(AxisXWidth * (idx) + (AxisXWidth / 2), this.data.CanvasHeight - item.y * Rate, 1, 0, 2 * Math.PI);
      ctx.stroke();
    })
    //ctx.closePath();
    //结点
    // ctx.beginPath();
    // ctx.setFillStyle('#0077FF')
    // RenderData.map((item, idx) => {
    //   ctx.restore();
    //   ctx.setFillStyle('#0077FF')
    //   ctx.arc(AxisXWidth * (idx) + (AxisXWidth / 2), this.data.CanvasHeight - item.y * Rate, 2, 0, 2 * Math.PI);
    //   ctx.stroke();
    // })
    //ctx.closePath();
    //竖线
    ctx.save();
    ctx.restore();
    var AxisX = 1 + AxisXWidth * (this.data.ChoosedIdx + 1 - this.data.StartRend) - AxisXWidth / 2;
    var AxisY = this.data.CanvasHeight - this.data.ips[this.data.ChoosedIdx].y * this.data.Rate - 70;
    ctx.setLineDash([5, 5]);
    ctx.setStrokeStyle("#ccc");
    ctx.moveTo(AxisX, AxisY);
    ctx.lineTo(AxisX, this.data.CanvasHeight);

    ctx.stroke();
    // ctx.save();
    // ctx.restore();
    // var AxisX = 1 + this.data.AxisXWidth * (this.data.ChoosedIdx + 1) - this.data.AxisXWidth / 2;
    // var AxisY = this.data.CanvasHeight - this.data.ips[this.data.ChoosedIdx].y * this.data.Rate - 70;
    // ctx.setLineDash([5, 5]);
    // ctx.setStrokeStyle("#ccc");
    // //ctx.restore();
    // ctx.moveTo(AxisX, AxisY);
    // ctx.lineTo(AxisX, this.data.CanvasHeight);
    // ctx.stroke();
    // ctx.closePath();

    ctx.closePath();
    ctx.draw();
  },
  GetDataFn(DAY) {
    wx.getStorage({
      key: 'equipmentInfo',
      success: (res) => {
        var DATA = {
          day: DAY,
          qrcodeid: res.data.EquipmentId,
          kind: res.data.Kind,
        }
        // wx.showLoading({
        //   title: '加载中',
        // })
        requestPromisified({
          url: h.main + '/selectnoqrcode1',
          data: {
            qrcodes: DATA
          },
          method: 'POST',
        }).then((res) => {
          //console.log(LimitRange[DATA.kind])
          this.setData({
            Number: parseInt(res.data.malist[0].number),
          })
          var temp = [];
          var one = res.data.qrcodelist.slice(0);
          var temp2 = res.data.qrcodelist.slice(0);
          var double = res.data.qrcodelist.slice(0);
          double.map((item, idx) => {
            let Obj = {
              x: idx + 1,
              y: item[1],
              title: item[0],
            }
            temp.push(Obj)
          })
          temp2.sort(function (a, b) {
            return -(a[1] - b[1]);
          });
          var NewMaxdata = temp2[0][1]
          this.setData({
            ips: temp,
            Rate: (this.data.CanvasHeight - this.data.PaddingTop) / NewMaxdata
          })
          console.log('NewMaxdata---' + NewMaxdata)
          console.log(temp)
          var NewItemData = Math.ceil(NewMaxdata / (this.data.count + 1));
          this.DrawAxisY(this.data.ctx, (this.data.CanvasHeight - this.data.PaddingTop) / (this.data.count + 1), NewItemData)
          this.DrawLine(temp, this.data.StartRend)
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
