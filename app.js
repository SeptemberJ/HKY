import h from './utils/url.js'
var util = require('./utils/util.js')
var requestPromisified = util.wxPromisify(wx.request)
//app.js
App({
  onLaunch: function () {
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 本机信息
    wx.getSystemInfo({
      success: (res)=> {
        this.globalData.width = res.windowWidth
      }
    }),
      wx.login({
        success: (res) => {
          wx.getUserInfo({
            success: (res) => {
              this.globalData.userInfo = res.userInfo
            }
          })
        }
      })
    //定位
    this.GetLocation()
    this.GetRoomIconList()
    this.GetSceneIconList()
    this.GetCookingMethod()
  },
  
  GetLocation(){
    wx.getLocation({
      type: 'wgs84',
      success:(res)=> {
        console.log(res)
        this.globalData.latitude = res.latitude
        this.globalData.longitude = res.longitude
        //this.convertCity(res.latitude, res.longitude, this)
      },
      fail: (res) => {
        wx.showToast({
          image: '../images/icon/attention.png',
          title: '定位未授权!'
        });
      }
    })
  },
  // 经纬度转换城市
  convertCity: function (Lat, Lng, _this) {
    var requestConvertPromisified = util.wxPromisify(wx.request);
    requestConvertPromisified({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=2ojY8H4BNgtoDyzXfNKTE87OCpNNm1yH&location=' + Lat + ',' + Lng + '&output=json',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((res) => {
      _this.globalData.city = res.data.result.addressComponent.city
    }).catch((res) => {
    })
  },
  globalData: {
    width:'',
    userInfo: null,
    User_Phone: '',
    User_name:'',
    Add_count:'',
    IfHasWirteQuestionnaire:'',
    QuestionnaireId:'', //问卷id
    city:'',
    Add_date: util.formatTime(new Date()),
    AQI:'',
    MessageCount:0,
    latitude:'',
    longitude:'',
    ifHasInfo:false,  //是否填写过身高体重
    HomeList:[],
    CurHomeRole:0,
    CurHomeName:null,
    CurHomeId: null,
    RoomIconList:[], //房间icon
    SceneIconList:[],//场景icon
    CookingMethodList: [] //烹饪方式
  },
  //获取房间图标
  GetRoomIconList() {
    requestPromisified({
      url: h.main + '/selectroomimg',
      data: {
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          this.globalData.RoomIconList = res.data.roomimglist,
          wx.hideLoading()
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '获取图标失败'
          });
          break
        default:
          wx.hideLoading()
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '服务器繁忙！'
          });
      }
      }).catch((res) => {
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          image: '../../../images/icon/attention.png',
          title: '服务器繁忙！'
        });
    })
  },
  //获取场景图标
  GetSceneIconList() {
    requestPromisified({
      url: h.main + '/selectscenarioimg',
      data: {
      },
      method: 'POST',
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          this.globalData.SceneIconList = res.data.scenariolist,
            wx.hideLoading()
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '获取图标失败'
          });
          break
        default:
          wx.hideLoading()
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '服务器繁忙！'
          });
      }
      }).catch((res) => {
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          image: '../../../images/icon/attention.png',
          title: '服务器繁忙！'
        });
    })
  },
  //获取烹饪方式
  GetCookingMethod() {
    requestPromisified({
      url: h.main + '/selectcookingtype',
      data: {
      },
      method: 'POST',
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          wx.hideLoading()
          let AfterCombine = []
          res.data.cooklist.map((Item,Idx)=>{
            let obj ={}
            obj.name = Item.typename
            obj.value = Item.typename
            AfterCombine.push(obj)
          })
          this.globalData.CookingMethodList = AfterCombine
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: './images/icon/attention.png',
            title: '烹饪方式获取失败'
          });
          break
        default:
          wx.hideLoading()
          wx.showToast({
            image: './images/icon/attention.png',
            title: '服务器繁忙！'
          });
      }
    }).catch((res) => {
      console.log(res)
      wx.hideLoading()
      wx.showToast({
        image: './images/icon/attention.png',
        title: '服务器繁忙！'
      })
    });
  }
})