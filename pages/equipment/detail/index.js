import * as echarts from '../../../ec-canvas/echarts';
import Promise from '../../../utils/blue'
import h from '../../../utils/url.js'
var util = require('../../../utils/util')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()
let chart = null;

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var labelRight = {
    normal: {
      position: 'right'
    }
  };
  requestPromisified({
    url: 'http://echarts.baidu.com/examples/data/asset/data/aqi-beijing.json',
    data: {
    },
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    }, // 设置请求的 header
  }).then((res) => {
    var temp = [
      ["2018-03-17", 30],
      ["2018-03-18", 14],
      ["2018-03-19", 60],
      ["2018-03-20", 38],
      ["2018-03-21", 34],
      ["2018-03-22", 44],
      ["2018-03-23", 78]
    ]
    var option = {
      title: {
        text: ''  //标题
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        data: temp.map(function (item) {
          return item[0];
        })
      },
      yAxis: {
        splitLine: {
          show: false
        }
      },
      // toolbox: {
      //   left: 'center',
      //   feature: {
      //     dataZoom: {
      //       yAxisIndex: 'none'
      //     },
      //     restore: {},
      //     saveAsImage: {}
      //   }
      // },
      // dataZoom: [{
      //   startValue: '2014-06-01'
      // }, {
      //   type: 'inside'
      // }],
      visualMap: {
        top: 0,
        right: 10,
        pieces: [{
          gt: 0,
          lte: 35,
          color: '#096'
        }, {
          gt: 35,
          lte: 75,
          color: '#ffde33'
        }, {
          gt: 75,
          lte: 115,
          color: '#ff9933'
        }, {
          gt: 115,
          lte: 150,
          color: '#cc0033'
        }, {
          gt: 150,
          lte: 250,
          color: '#660099'
        }, {
          gt: 250,
          color: '#7e0023'
        }],
        outOfRange: {
          color: '#999'
        }
      },
      series: {
        name: 'Beijing AQI',
        type: 'line',
        data: temp.map(function (item) {
          return item[1];
        }),
        markLine: {
          silent: true,
          data: [{
            yAxis: 35
          }, {
            yAxis: 75
          }]
        }
      }
    };

    chart.setOption(option);
  }).catch((res) => {
    wx.showToast({
      image: '/images/attention.png',
      title: '服务器繁忙！'
    });
    console.log(res)
  })


  return chart;
}

Page({
  data: {
    ec: {
      onInit: initChart
    },
    DataInfo:[],
    CurTab:0,
    TabMenu: ['最近7天', '最近2周','最近一个月']
  },
  onLoad: function () {
    //this.GetData()
  },
  ChangeTab(e){
    let IDX = e.currentTarget.dataset.idx
    this.setData({
      CurTab: IDX
    })

  },
  GetData(e) {
    requestPromisified({
  url:'http://echarts.baidu.com/examples/data/asset/data/aqi-beijing.json',
      data: {
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }, // 设置请求的 header
    }).then((res) => {
      this.setData({
        DataInfo:res.data
      })
    }).catch((res) => {
      wx.showToast({
        image: '/images/attention.png',
        title: '服务器繁忙！'
      });
    })
  },
})
