import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var MD5 = require('../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    DynamicList:[],
    DynamicList2:[
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
    ReleaseContentList:[],
    ReleaseContentSingle:'',
    RelpyContentSingle:'',
    ifReadyRelease:false,
    ifReadyReply:false,
    RecordTopDistance:0,
    CurReleaseInfo:''
  },
  onShow(){
    this.GetAllRelease()
  },
  //我要发布
  ToRelease(){
    wx.navigateTo({
      url: '../release/index'
    })
  },
  //我的发布
  MyRelease() {
    wx.navigateTo({
      url: '../my/index'
    })
  },
  //我的消息
  MyMessage() {
    wx.navigateTo({
      url: '../message/index'
    })
  },
  //点赞
  Zan(e) {
    let DATA = {
      fname: app.globalData.User_name,
      ratingid: e.currentTarget.dataset.dynamicId, //动态id
      ftelphone: app.globalData.User_Phone
    }
    requestPromisified({
      url: h.main + '/insertrating2',
      data: {
        ratings:DATA
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
            title: '点赞成功！',
            icon: 'success',
            duration: 1500
          })
          //刷新
          let temp = this.data.DynamicList
          temp[e.currentTarget.dataset.idx].ifHasZan = true
          temp[e.currentTarget.dataset.idx].comment_zan.push({ 'phone': app.globalData.User_Phone, 'name': app.globalData.User_name})
          this.setData({
            DynamicList: temp
          })
          break
        case 0:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '点赞失败!'
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
  // 取消点赞
  CancelZan(e) {
      let DATA = {
        ratingid: e.currentTarget.dataset.dynamicId, //动态id
        ftelphone: app.globalData.User_Phone
      }
      requestPromisified({
        url: h.main + '/deletepraise',
        data: {
          ratings: DATA
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
              title: '取消成功！',
              icon: 'success',
              duration: 1500
            })
            //刷新
            let temp = this.data.DynamicList
            temp[e.currentTarget.dataset.idx].ifHasZan = false
            this.setData({
              DynamicList: temp
            })
            break
          case 0:
            wx.showToast({
              image: '../../images/icon/attention.png',
              title: '取消失败!'
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
  //调起评论框
  ShowReleaseModal(e){
    let Data = {
      name_F: e.currentTarget.dataset.fabuName,
      ratingid: e.currentTarget.dataset.fabuId, //动态id
      ratinginfoid: '',
      ftelphone: e.currentTarget.dataset.fabuPhone  //动态发布者电话
    }
    this.setData({
      ifReadyRelease: true,
      RecordTopDistance: e.target.offsetTop,
      ReleaseContentSingle:'',  //清空之前输入
      CurReleaseInfo: Data
    })
  },
  //调起回复框
  ShowReplyModal(e) {
    console.log(e.currentTarget.dataset.nameF + '---' + e.currentTarget.dataset.nameZ +'---'+  app.globalData.User_name)
    if (e.currentTarget.dataset.nameF == app.globalData.User_name && e.currentTarget.dataset.nameZ == app.globalData.User_name){
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
    }else{
      return false
    }
    
  },
  //关闭评论框
  CloseReleaseModal(){
    this.setData({
      ifReadyRelease: false
    })
    this.GetAllRelease()
    wx.pageScrollTo({
      scrollTop: this.data.RecordTopDistance - 30,
      duration: 300
    })
  },
  //关闭回复框
  CloseReplyModal() {
    this.setData({
      ifReadyReply: false
    })
    this.GetAllRelease()
    wx.pageScrollTo({
      scrollTop: this.data.RecordTopDistance - 30,
      duration: 300
    })
  },
  // GetAllRelease2(){
  //   let temp = this.data.DynamicList
  //   temp.hasZan = false
  //   this.data.DynamicList.map((item,idx)=>{
  //     if (item.phone == app.globalData.User_Phone){
  //       temp.hasZan = true
  //     }
  //   })
  // },
  //获取所有动态
  GetAllRelease() {
    wx.showLoading({
      title: '加载中',
    })
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
          let temp = res.data.ratinglist
          let ReleaseContentList = []
          temp.map((Item,Idx)=>{
            ReleaseContentList.push('')
            Item.ifHasZan = false
            Item.comment_zan.map((item_zan, item_IDX)=>{
              if (item_zan.phone == app.globalData.User_Phone){
                Item.ifHasZan = true
              }
            })
          })
          console.log(temp)
          this.setData({
            DynamicList: temp,
            ReleaseContentList: ReleaseContentList
          })
          wx.hideLoading()
          break
        case 0:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '获取动态失败'
          });
          wx.hideLoading()
          break
        default:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！'
          });
          wx.hideLoading()
      }
    }).catch((res) => {
      wx.hideLoading()
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
      console.log(res)
    })
  },
  //跳转回复
  Reply(e){
    console.log(e.currentTarget.dataset.nameF + '---' + e.currentTarget.dataset.nameZ)
    if (e.currentTarget.dataset.nameF == app.globalData.User_name){
      wx.navigateTo({
        url: '../message/index?id=' + e.currentTarget.dataset.idx
      })
    }else{
      return false
    }
    
  },
  // ChangeRelease
  ChangeRelease(e){
    let ReleaseTemp = this.data.ReleaseContentList
    ReleaseTemp[e.currentTarget.dataset.idx] = e.detail.value
    this.setData({
      ReleaseContent: ReleaseTemp
    })
  },
  //发布input框
  ChangeReleaseContent(e){
    this.setData({
      ReleaseContentSingle: e.detail.value
    })
  },
  //回复input框
  ChangeRelpyContent(e) {
    this.setData({
      RelpyContentSingle: e.detail.value
    })
  },
  //发布评论
  Submit(){
    console.log('Submit---')
    this.SendRelease(this.data.CurReleaseInfo.name_F, this.data.ReleaseContentSingle, this.data.CurReleaseInfo.ratingid, '', this.data.CurReleaseInfo.ftelphone)
  },
  //回复评论
  SubmitReply() {
    this.SendRelease(this.data.CurReleaseInfo.name_F, this.data.RelpyContentSingle, this.data.CurReleaseInfo.ratingid, this.data.CurReleaseInfo.ratinginfoid, this.data.CurReleaseInfo.ftelphone)
  },
  //发布
  SendRelease(Name_F, Remark, Ratingid, Ratinginfoid, Ftelphone){
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
      console.log(res.data)
      switch (res.data.result) {
        case 1:
          this.setData({
            ReleaseContentList:[]
          })
          wx.showToast({
            title: '评论成功！',
            icon: 'success',
            duration: 1500
          })
          //刷新
          this.GetAllRelease()
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
            title: '服务器繁忙1！'
          });
      }
    }).catch((res) => {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙2！'
      });
      // this.setData({
      //   loadingHidden: true
      // })
      console.log(res)
    })

  }
})

