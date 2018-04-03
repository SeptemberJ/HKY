import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var MD5 = require('../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    DynamicList:[
      {
        'id': 0,
        'comment_time': '2018-04-03',
        'comment_name': '留白',
        'comment_avatar': '../../../images/icon/my.png',
        'comment_content': '发布内容。。。',
        'comment_picture': ['../../../images/icon/my.png', '../../../images/icon/my.png'],
        'comment_zan': [{ 'phone': '18234567890', 'name': '留白' }, { 'phone': '18234567891', 'name': '张三' },{ 'phone': '18234567892', 'name': '李四' }],
        'comment_list': [
          {
            'main': { 'id':0,'people_name': '张三', 'people_content': '张三评论内容' }, 'reply': [{ 'name_Z': '留白', 'name_F': '张三', 'hf_content': '留白回复张三内容' }, { 'name_Z': '张三', 'name_F': '留白', 'hf_content': '张三回复留白内容' }]
          },
          {
            'main': { 'id': 1,'people_name': '李四', 'people_content': '李四评论内容' }, 'reply': [{ 'name_Z': '留白', 'name_F': '李四', 'hf_content': '留白回复李四内容' }, { 'name_Z': '李四', 'name_F': '留白', 'hf_content': '李四回复留白内容' }]
          },
          {
            'main': { 'id': 1, 'people_name': '王五', 'people_content': '王五评论内容' }, 'reply': [{ 'name_Z': '留白', 'name_F': '王五', 'hf_content': '留白回复王五内容' }, { 'name_Z': '王五', 'name_F': '留白', 'hf_content': '王五回复留白内容' }]
          }
        ],
      }
    ]
  },
  ToRelease(){
    wx.navigateTo({
      url: '../release/index'
    })
  },
  MyRelease() {
    wx.navigateTo({
      url: '../my/index'
    })
  },
  MyMessage() {
    wx.navigateTo({
      url: '../message/index'
    })
  },
})

