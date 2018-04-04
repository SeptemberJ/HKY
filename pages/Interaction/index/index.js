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
    ],
    ReleaseContent:''
  },
  onShow(){
    this.GetAllRelease()
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
  Zan(){

  },
  GetAllRelease2(){
    let temp = this.data.DynamicList
    temp.hasZan = false
    this.data.DynamicList.map((item,idx)=>{
      if (item.phone == app.globalData.User_Phone){
        temp.hasZan = true
      }
    })
  },
  GetAllRelease() {
    requestPromisified({
      url: h.main + '/selectrating',
      data: {
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {
      //   'content-type': 'application/x-www-form-urlencoded',
      //   'Accept': 'application/json'
      // }, // 设置请求的 header
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          this.setData({
            DynamicList: res.data.ratinglist
          })
          break
        case 0:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '获取动态失败'
          });
          break
        default:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！'
          });
      }
    }).catch((res) => {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
      this.setData({
        loadingHidden: true
      })
      console.log(res)
    })
  },
  Reply(e){
    console.log(e.currentTarget.dataset.nameF + '---' + e.currentTarget.dataset.nameZ)
    if (e.currentTarget.dataset.nameF == e.currentTarget.dataset.nameZ){
      wx.navigateTo({
        url: '../message/index'
      })
    }else{
      return false
    }
    
  },
  // ChangeRelease
  ChangeRelease(e){
    this.setData({
      ReleaseContent: e.detail.value
    })
  },
  SendRelease(e){
    requestPromisified({
      url: h.main + '/insertrating1',
      data: {
        name_Z: app.globalData.User_name,
        name_F: e.currentTarget.dataset.fabuName,
        remark: this.data.ReleaseContent,
        ratingid: e.currentTarget.dataset.fabuId, //动态id
        ratinginfoid:'',
        ftelphone: app.globalData.User_Phone,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {
      //   'content-type': 'application/x-www-form-urlencoded',
      //   'Accept': 'application/json'
      // }, // 设置请求的 header
    }).then((res) => {
      // switch (res.data.result) {
      //   case 1:
      //     this.setData({
      //       DynamicList: res.data.ratinglist
      //     })
      //     break
      //   case 0:
      //     wx.showToast({
      //       image: '../../images/icon/attention.png',
      //       title: '获取动态失败'
      //     });
      //     break
      //   default:
      //     wx.showToast({
      //       image: '../../images/icon/attention.png',
      //       title: '服务器繁忙！'
      //     });
      // }
    }).catch((res) => {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
      this.setData({
        loadingHidden: true
      })
      console.log(res)
    })

  }
})

