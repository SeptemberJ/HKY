import * as echarts from '../../../ec-canvas/echarts';

const app = getApp();

function initChart_Calorie(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    color: ['#91c7ae', '#c23531', '#ffdb5c'],
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    // legend: {
    //   orient: 'vertical',
    //   x: 'left',
    //   data: ['直达']
    // },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        // selectedMode: 'single',
        radius: [15, '80%'],

        label: {
          normal: {
            position: 'inner'
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [
          { value: 335, name: '早餐', selected: false },
          { value: 679, name: '午餐' },
          { value: 1548, name: '晚餐' }
        ]
      },
    ]
  };

  chart.setOption(option);
  return chart;
}

function initChart_Nutrient(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    color: ['#91c7ae', '#c23531', '#ffdb5c'],
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    // legend: {
    //   orient: 'vertical',
    //   x: 'left',
    //   data: ['直达']
    // },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        // selectedMode: 'single',
        radius: [15, '80%'],

        label: {
          normal: {
            position: 'inner'
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [
          { value: 1548, name: '', selected: false },
          { value: 679, name: '' },
          { value: 120, name: '' }
        ]
      },
    ]
  };

  chart.setOption(option);
  return chart;
}

Page({
  data: {
    ec_Calorie: {
      onInit: initChart_Calorie
    },
    ec_Nutrient: {
      onInit: initChart_Nutrient
    },
    reportData: {
      'report_date':'2018-01-01',  //报告日期
      'report_calorie':{           //卡路里分析
        'calorie_amount': 1235,    //卡路里摄入总量
        'calorie_breakfast':{'amount':60,'percent':'25'}, //早餐 摄入总量 三餐中占比（%号不带）
        'calorie_lunch': { 'amount': 120, 'percent': '50' },//午餐
        'calorie_dinner': { 'amount': 60, 'percent': '25' }//晚餐
      },
      'report_nutrient': {    //营养元素分析
        'nutrient_carbohydrate': { 'amount': 60, 'percent': '25' },//碳水 摄入总量 三餐中占比（%号不带）
        'nutrient_fat': { 'amount': 120, 'percent': '50' },//脂肪
        'nutrient_protein': { 'amount': 60, 'percent': '25' }///蛋白质
      },
      'report_ranking': {  //三种元素含量排名 
        'rank_carbohydrate':[  //碳水
          {'food_name':'绿茶','food_amount':300},  //食物  含量
          { 'food_name': '蛋糕', 'food_amount': 200 }
        ],
        'rank_fat': [  //脂肪
          { 'food_name': '绿茶', 'food_amount': 300 },
          { 'food_name': '蛋糕', 'food_amount': 200 }
        ],
        'rank_protein': [ //蛋白质
          { 'food_name': '绿茶', 'food_amount': 300 },
          { 'food_name': '蛋糕', 'food_amount': 200 }
        ]
      }
    }
  },

  onLoad(options) {
    this.setData({
      reporDate: options.date
    })
  }
});
