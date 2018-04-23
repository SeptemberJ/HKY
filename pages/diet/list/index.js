import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var MD5 = require('../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    percent: 60,
    CurKind:0,
    kindList:[
      {
        'kind_name': '常用', 'kind_icon': '../../../images/icon/cy.png', 'kind_icon_active':'../../../images/icon/cy_active.png'},
      { 'kind_name': '主食', 'kind_icon': '../../../images/icon/zs.png', 'kind_icon_active': '../../../images/icon/zs_active.png' },
      { 'kind_name': '肉蛋类', 'kind_icon': '../../../images/icon/rd.png', 'kind_icon_active': '../../../images/icon/rd_active.png' },
      { 'kind_name': '蔬菜', 'kind_icon': '../../../images/icon/sc.png', 'kind_icon_active': '../../../images/icon/sc_active.png' },
      { 'kind_name': '水果', 'kind_icon': '../../../images/icon/sg.png', 'kind_icon_active': '../../../images/icon/sg_active.png' },
      { 'kind_name': '快餐', 'kind_icon': '../../../images/icon/kc.png', 'kind_icon_active': '../../../images/icon/kc_active.png' },
      { 'kind_name': '零食', 'kind_icon': '../../../images/icon/ls.png', 'kind_icon_active': '../../../images/icon/ls_active.png' },
      { 'kind_name': '坚果', 'kind_icon': '../../../images/icon/jg.png', 'kind_icon_active': '../../../images/icon/jg_active.png' },
      { 'kind_name': '饮料饮品', 'kind_icon': '../../../images/icon/yl.png', 'kind_icon_active': '../../../images/icon/yl_active.png' },
      { 'kind_name': '饼干糕点', 'kind_icon': '../../../images/icon/bggd.png', 'kind_icon_active': '../../../images/icon/bggd_active.png' },
      { 'kind_name': '糖果', 'kind_icon': '../../../images/icon/tg.png', 'kind_icon_active':'../../../images/icon/tg_active.png' }
    ],
    foodList:[]
    
  },
  onLoad: function () {
  },
  onShow(){
    this.GetAllFood()
  },
  ChangeKind(e){
    this.setData({
      CurKind: e.currentTarget.dataset.idx
    })
  },
  GetAllFood(){
    requestPromisified({
      url: h.main + '/selecteat',
      data: {
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {
      //   'content-type': 'application/x-www-form-urlencoded',
      //   'Accept': 'application/json'
      // }, // 设置请求的 header
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          wx.hideLoading()
          this.setData({
            foodList: res.data.eatlist
          })
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../../images/icon/attention.png',
            title: '获取失败'
          });
          break
        default:
          wx.hideLoading()
          wx.showToast({
            image: '../../../images/icon/attention.png',
            title: '服务器繁忙！'
          });
      }
    }).catch((res) => {
      wx.hideLoading()
      wx.showToast({
        image: '../../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
      console.log(res)
    })
  },
})
