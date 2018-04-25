import * as echarts from '../../../ec-canvas/echarts';

const app = getApp();

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    backgroundColor: "#ffffff",
    color: ["#37A2DA", "#73a373", "#ffdb5c", "#ea7e53" , "#c23531"],
    series: [{
      name: '体重',
      type: 'gauge',
      min: 0,
      max: 150,
      detail: {
        formatter: '{value}'
      },
      axisLine: {
        show: true,
        lineStyle: {
          width: 10,
          shadowBlur: 0,
          color: [
            [0.2, '#67e0e3'],
            [0.4, '#73a373'],
            [0.6, '#ffdb5c'],
            [0.8, '#ea7e53'],
            [1, '#c23531']
          ]
        }
      },
      splitLine: { // 分隔线
        length: 15, // 属性length控制线长
        // lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
        //   width: 3,
        //   color: '#fff',
        //   shadowColor: '#fff', //默认透明
        //   shadowBlur: 10
        // }
      },
      data: [{
        value: 50,
        name: '公斤',
      }]

    }]
  };

  chart.setOption(option, true);

  return chart;
}

Page({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    ec: {
      onInit: initChart
    }
  },

  onReady() {
  }
});
