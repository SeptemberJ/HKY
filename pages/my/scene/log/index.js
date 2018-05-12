import h from '../../../../utils/url.js'
var util = require('../../../../utils/util.js')
var MD5 = require('../../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    LogList:[
      {'id':0,'text':'已启动','time':'2018-05-12'},
      { 'id': 1, 'text': '已启动', 'time': '2018-05-12' }
    ]
  },
  onLoad: function () {

  },
  onShow() {

  },
})