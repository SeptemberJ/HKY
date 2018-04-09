import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var MD5 = require('../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    MessageList:[
      {
        'type':1, //0-点赞 ，1-评论
        'dynamic': { 
          'f_id': 123, 
          'f_name': '留白', 
          'f_headImg': 'https://wx.qlogo.cn/mmopen/vi_32/RTyEMrVG0UFyNMMSBTG3glDbN255dBYzrkV03envNE2ZAgjnFVFDZ3TNxSRVrfPApkFphwkN1vjibswwx00KT2w/0',
          'f_remark':'周一。。。',
          'f_picture':[],
          },  //原始动态信息
        'interaction':{
          'p_id': '123',
          'p_name':'张三',
          'p_headImg': 'https://wx.qlogo.cn/mmopen/vi_32/RTyEMrVG0UFyNMMSBTG3glDbN255dBYzrkV03envNE2ZAgjnFVFDZ3TNxSRVrfPApkFphwkN1vjibswwx00KT2w/0',
          'p_time': '2018-04-09',
          'p_remark':'张三又回复留白'
        }, //评论或点赞信息，包括那个人的信息
        'replyList2': {
          'main': { 'h_name_z': '张三', 'h_name_t': '留白', 'h_remark': '张三评论留白' },
          'reply':[
            { 'h_name_z': '留白', 'h_name_t': '张三', 'h_remark': '留白回复张三' }
          ]
        },
        'replyList': [{ 'h_name_z': '张三', 'h_name_t': '留白', 'h_remark': '张三评论留白' }, { 'h_name_z': '留白', 'h_name_t': '张三', 'h_remark': '留白回复张三' }]
      },
      {
        'type': 0, //0-点赞 ，1-评论
        'dynamic': {
          'f_id': 123,
          'f_name': '留白',
          'f_headImg': 'https://wx.qlogo.cn/mmopen/vi_32/RTyEMrVG0UFyNMMSBTG3glDbN255dBYzrkV03envNE2ZAgjnFVFDZ3TNxSRVrfPApkFphwkN1vjibswwx00KT2w/0',
          'f_remark': '周一。。。',
          'f_picture': [],
        },  //原始动态信息
        'interaction': {
          'p_id': '123',
          'p_name': '李四',
          'p_headImg': 'https://wx.qlogo.cn/mmopen/vi_32/RTyEMrVG0UFyNMMSBTG3glDbN255dBYzrkV03envNE2ZAgjnFVFDZ3TNxSRVrfPApkFphwkN1vjibswwx00KT2w/0',
          'p_time': '2018-04-09',
          'p_remark': ''
        }, //评论或点赞信息，包括那个人的信息
        'replyList': null
      }
    ],
    ReplyContent:'',
  },
  onLoad(options) {
    this.GetAllMessage()
  },
  onShow(){
    console.log('onshow---')
  },
  ChangeReply(e){
    this.setData({
      ReplyContent:e.detail.value
    })
  },
  // SumitInfo(){
  //     requestPromisified({
  //       url: h.main + '/insertrating1',
  //       data: {
  //         name_Z: app.globalData.User_name,
  //         name_F: this.data.Info.fnamez,
  //         remark: this.data.ReplyContent,
  //         ratingid: this.data.Info.ratinglist[0].id, //动态id
  //         ratinginfoid: this.data.Info.id,
  //         ftelphone: app.globalData.User_Phone,
  //       },
  //       method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
  //       // header: {
  //       //   'content-type': 'application/x-www-form-urlencoded',
  //       //   'Accept': 'application/json'
  //       // }, // 设置请求的 header
  //     }).then((res) => {
  //       console.log(res.data)
  //       switch (res.data.result) {
  //         case 1:
  //           wx.showToast({
  //             title: '回复成功！',
  //             icon: 'success',
  //             duration: 1500
  //           })
  //           //返回
  //           wx.navigateBack({
  //             delta: 1
  //           })
  //           break
  //         case 0:
  //           wx.showToast({
  //             image: '../../images/icon/attention.png',
  //             title: '回复失败!'
  //           });
  //           break
  //         default:
  //           wx.showToast({
  //             image: '../../images/icon/attention.png',
  //             title: '服务器繁忙！'
  //           });
  //       }
  //     }).catch((res) => {
  //       wx.showToast({
  //         image: '../../images/icon/attention.png',
  //         title: '服务器繁忙！'
  //       });
  //       console.log(res)
  //     })
  // },
  //获取信息
  GetInfo(ID){
    requestPromisified({
      url: h.main + '/selectratinginfo?ratinginfoid=' + ID,
      data: {
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {
      //   'content-type': 'application/x-www-form-urlencoded',
      //   'Accept': 'application/json'
      // }, // 设置请求的 header
    }).then((res) => {
      console.log(res.data)
      switch (res.data.result) {
        case 1:
          this.setData({
            Info: res.data.ratinginfo[0]
          })
          break
        case 0:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '获取信息失败!'
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
      console.log(res)
    })
  },
  //获取所有消息
  //获取信息
  GetAllMessage() {
    requestPromisified({
      url: h.main + '/selectratinginfonew?ftelphone=' + app.globalData.User_Phone,
      data: {
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {
      //   'content-type': 'application/x-www-form-urlencoded',
      //   'Accept': 'application/json'
      // }, // 设置请求的 header
    }).then((res) => {
      console.log(res.data)
      switch (res.data.result) {
        case 1:
          this.setData({
            MessageList: res.data.MessageList
          })
          break
        case 0:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '获取消息失败!'
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
      console.log(res)
    })
  }
})
