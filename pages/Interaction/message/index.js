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
    RelpyContentSingle: '',
    ifReadyReply: false,
    RecordTopDistance:0,
    CurReleaseInfo:''
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
  //回复input框
  ChangeRelpyContent(e) {
    this.setData({
      RelpyContentSingle: e.detail.value
    })
  },
  //调起回复框
  ShowReplyModal(e) {
    let Data = {
      name_F: e.currentTarget.dataset.targetName,
      ratingid: e.currentTarget.dataset.fabuId, //动态id
      ratinginfoid: e.currentTarget.dataset.idx,
      ftelphone: e.currentTarget.dataset.fabuPhone
    }
    this.setData({
      ifReadyReply: true,
      RecordTopDistance: e.target.offsetTop,
      ReplyContentSingle: '',  //清空之前输入
      CurReleaseInfo: Data
    })
  },
  //关闭回复框
  CloseReplyModal() {
    // this.setData({
    //   ifReadyReply: false
    // })
    //this.GetAllMessage()
    wx.pageScrollTo({
      scrollTop: this.data.RecordTopDistance - 30,
      duration: 300
    })
  },
  //回复评论
  SubmitReply() {
    console.log('this.data.CurReleaseInfo---')
    console.log(this.data.CurReleaseInfo)
    this.SendRelease(this.data.CurReleaseInfo.name_F, this.data.RelpyContentSingle, this.data.CurReleaseInfo.ratingid, this.data.CurReleaseInfo.ratinginfoid, this.data.CurReleaseInfo.ftelphone)
  },
  //发布
  SendRelease(Name_F, Remark, Ratingid, Ratinginfoid, Ftelphone) {
    console.log('SendRelease内部---')
    // let Idx = e.currentTarget.dataset.idx
    requestPromisified({
      url: h.main + '/insertrating1',
      data: {
        name_Z: app.globalData.User_name,
        name_F: Name_F,
        remark: Remark,
        ratingid: Ratingid, //动态id
        ratinginfoid: Ratinginfoid,
        ftelphone: app.globalData.User_Phone,
        ftelphone1: Ftelphone
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {
      //   'content-type': 'application/x-www-form-urlencoded',
      //   'Accept': 'application/json'
      // }, // 设置请求的 header
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          wx.showToast({
            title: '评论成功！',
            icon: 'success',
            duration: 1500
          })
          //刷新
          this.GetAllMessage()
          break
        case 0:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '评论失败!'
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
      // this.setData({
      //   loadingHidden: true
      // })
      console.log(res)
    })

  },


  //获取所有消息
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
