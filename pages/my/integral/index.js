import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var MD5 = require('../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    Cur_tab:0,
    getRecordList:[
      { 'Activity_name': '登录', 'Activity_date': '2018-004-23', 'Activity_add': 5 },
      { 'Activity_name': '注册', 'Activity_date': '2018-004-23','Activity_add':100},
    ],
    costRecordList:[]
  },
  ChangeTab(){
    this.setData({
      Cur_tab: this.data.Cur_tab == 0?1:0
    })
  }
  })