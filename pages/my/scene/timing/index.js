import h from '../../../../utils/url.js'
var util = require('../../../../utils/util.js')
var MD5 = require('../../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    TimeStart:'请选择选择开始时间',
    TimeEnd: '请选择选择结束时间',
    SingleTime:true,
    Monday:false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  },
  onLoad: function () {

  },
  onShow() {

  },
  bindTimeChange_start(e){
    this.setData({
      TimeStart: e.detail.value
    })
  },
  bindTimeChange_end(e) {
    this.setData({
      TimeEnd: e.detail.value
    })
  },
  ChooseControl(e){
    switch(e.currentTarget.dataset.idx){
      case '0':
        this.setData({
          SingleTime: true,
          Monday: false,
          Tuesday: false,
          Wednesday: false,
          Thursday: false,
          Friday: false,
          Saturday: false,
          Sunday: false,
        })
        break
      case '1':
        this.setData({
          SingleTime: false,
          Monday: !this.data.Monday,
        })
        break
      case '2':
        this.setData({
          SingleTime: false,
          Tuesday: !this.data.Tuesday,
        })
        break
      case '3':
        this.setData({
          SingleTime: false,
          Wednesday: !this.data.Wednesday,
        })
        break
      case '4':
        this.setData({
          SingleTime: false,
          Thursday: !this.data.Thursday,
        })
        break
      case '5':
        this.setData({
          SingleTime: false,
          Friday: !this.data.Friday,
        })
        break
      case '6':
        this.setData({
          SingleTime: false,
          Saturday: !this.data.Saturday,
        })
        break
      case '7':
        this.setData({
          SingleTime: false,
          Sunday: !this.data.Sunday,
        })
        break
    }
  },
  Submit(){
    //校验
    if (this.data.TimeStart == '请选择选择开始时间'){
      wx.showToast({
        image: '../../../../images/icon/attention.png',
        title: '请选开始时间！'
      });
      return false
    }
    if (this.data.TimeEnd == '请选择选择结束时间') {
      wx.showToast({
        image: '../../../../images/icon/attention.png',
        title: '请选结束时间！'
      });
      return false
    }
    if (!this.data.SingleTime && !this.data.Monday && !this.data.Tuesday && !this.data.Wednesday && !this.data.Thursday && !this.data.Friday && !this.data.Saturday && !this.data.Sunday){
      wx.showToast({
        image: '../../../../images/icon/attention.png',
        title: '请选定时日期！'
      });
      return false
    }
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true,
    // })
    // requestPromisified({
    //   url: h.main + '/insertroom',
    //   data: {
    //     rooms: DATA
    //   },
    //   method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    // }).then((res) => {
    //   switch (res.data.result) {
    //     case 1:
    //       var pages = getCurrentPages();
    //       if (pages.length > 1) {
    //         var prePage = pages[pages.length - 2];
    //         prePage.GetCurRoomList()
    //       }
    //       wx.navigateBack()
    //       break
    //     case 0:
    //       wx.showToast({
    //         image: '../../../../images/icon/attention.png',
    //         title: '创建房间失败!'
    //       });
    //       break
    //     default:
    //       wx.showToast({
    //         image: '../../../../images/icon/attention.png',
    //         title: '服务器繁忙！'
    //       });
    //   }
    // }).catch((res) => {
    //   wx.showToast({
    //     image: '../../../../../images/icon/attention.png',
    //     title: '服务器繁忙！'
    //   });
    // })

  }

})