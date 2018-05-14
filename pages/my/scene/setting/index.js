import h from '../../../../utils/url.js'
var util = require('../../../../utils/util.js')
var MD5 = require('../../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    Type:0,
    CurSceneId:null,
    RoomId:'',
    IconList: [],
    Scene_Icon: '',
    Scene_Icon_index: [0],
    SceneInfo:{
      Scene_name:'',
      Scene_Room_Icon: '',
      Scene_timing:{
        time_start:'',
        time_end:'',
        time_control:''
      },
      Scene_EQList:[],
      Scene_AutomaticList: [],
    }
  },
  onLoad(options) {
    if (options.sceneid){
      this.GetSceneInfo(options.sceneid)
      // let temp = this.data.SceneInfo
      // temp.Scene_Room_Icon = app.globalData.SceneIconList[0].img
      this.setData({
        IconList: app.globalData.SceneIconList,
        Type: options.type, //0新增  1-修改
        RoomId: options.roomid ? options.roomid : ''
      })
    }else{
      let temp = options.sceneInfo?options.sceneInfo:this.data.SceneInfo
      temp.Scene_Room_Icon = app.globalData.SceneIconList[0].img
      this.setData({
        IconList: app.globalData.SceneIconList,
        Scene_Icon: app.globalData.SceneIconList[0].img,
        SceneInfo: temp,
        Type: options.type, //0新增  1-修改
        RoomId: options.roomid ? options.roomid:''
      })
    }



    // let temp = options.sceneInfo?options.sceneInfo:this.data.SceneInfo
    // temp.Scene_Room_Icon = app.globalData.SceneIconList[0].img
    // this.setData({
    //   IconList: app.globalData.SceneIconList,
    //   Scene_Icon: app.globalData.SceneIconList[0].img,
    //   SceneInfo: temp,
    //   Type: options.type, //0新增  1-修改
    //   RoomId: options.roomid ? options.roomid:''
    // })
  },
  onShow() {

  },
  ToTiming(){
    wx.navigateTo({
      url: '../timing/index',
    })
  },
  ToEQList() {
    wx.navigateTo({
      url: '../eqlist/index?sceneid=' + this.data.CurSceneId,
    })
  },
  ToLinkage() {
    wx.navigateTo({
      url: '../ldlist/index',
    })
  },
  ToLog() {
    wx.navigateTo({
      url: '../log/index',
    })
  },
  //选择图片
  bindChange: function (e) {
    let temp = this.data.SceneInfo
    temp.Scene_Room_Icon = this.data.IconList[e.detail.value[0]].img
    this.setData({
      Scene_Icon: this.data.IconList[e.detail.value[0]].img,
      SceneInfo: temp
    })
  },
  //改变场景名称
  ChangeSceneName(e){
    let temp = this.data.SceneInfo
    temp.Scene_name = e.detail.value
    this.setData({
      Scene_EQList: temp
    })
  },
  //更新定时
  UpdateTiming(TimingInfo){
    let temp = this.data.SceneInfo
    temp.Scene_timing = TimingInfo
    this.setData({
      Scene_EQList: temp
    })
  },
  //更新设备组合
  UpdateChoosedEQList(ChoosedEQList){
    let temp = this.data.SceneInfo
    temp.Scene_EQList = ChoosedEQList
    this.setData({
      Scene_EQList: temp
    })
  },
  Submit2(){
    if(this.data.Type == 0){
      this.Submit_add()
    }
  },
  Submit(){
    console.log(this.data.SceneInfo)
    //校验
    if (this.data.SceneInfo.Scene_name == '') {
      wx.showToast({
        image: '../../../../images/icon/attention.png',
        title: '请填写名称!'
      });
      return false
    }
    if (this.data.SceneInfo.Scene_timing.time_start == ''){
      wx.showToast({
        image: '../../../../images/icon/attention.png',
        title: '请先定时!'
      });
      return false
    }
    if (this.data.SceneInfo.Scene_EQList.length==0 && this.data.SceneInfo.Scene_AutomaticList.length==0){
      wx.showToast({
        image: '../../../../images/icon/attention.png',
        title: '请绑定设备或联动!'
      }); 
      return false
    }
    wx.showLoading({
      title: '加载中',
    })

    let DATA = this.data.SceneInfo
    requestPromisified({
      url: h.main + '/insertscenario',
      data: {
        id: app.globalData.CurHomeId,
        roomid: this.data.RoomId,
        scenarios: DATA
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          wx.showToast({
            title: '添加成功！',
            icon: 'success',
            duration: 1500
          })
          //this.ChangeCurHome(res.data.id, ScanHomeName)
          wx.navigateBack()
          wx.hideLoading()
          break
        case 2:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '已添加过!',
            duration: 2000
          });
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '添加失败!'
          });
          break
        default:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '添加失败!'
          });
      }
    }).catch((res) => {
      wx.hideLoading()
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: 'S服务器繁忙！'
      });
      console.log(res)
    })
    
  },
  //获取创建信息
  GetSceneInfo(ID){
    requestPromisified({
      url: h.main + '/selectnoscenario?id=' + ID,
      data: {
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    }).then((res) => {
      console.log(res.data.scenario)
      switch (res.data.result) {
        case 1:
          this.setData({
            SceneInfo: res.data.scenario.scenarios,
            CurSceneId: res.data.scenario.id,
          })
          wx.hideLoading()
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '获取失败!'
          });
          break
        default:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！!'
          });
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
  //删除场景
  DeleteScene(){
    wx.showModal({
      title: '提示',
      content: '确定删除该场景?',
      success: (res)=> {
        if (res.confirm) {
          requestPromisified({
            url: h.main + '/?id=' + this.data.CurSceneId,
            data: {
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          }).then((res) => {
            switch (res.data.result) {
              case 1:
                wx.showToast({
                  title: '删除成功!',
                  icon: 'success',
                  duration: 1500,
                })
                break
              case 0:
                wx.hideLoading()
                wx.showToast({
                  image: '../../images/icon/attention.png',
                  title: '删除失败!'
                });
                break
              default:
                wx.hideLoading()
                wx.showToast({
                  image: '../../images/icon/attention.png',
                  title: '服务器繁忙！!'
                });
            }
          }).catch((res) => {
            wx.hideLoading()
            wx.showToast({
              image: '../../images/icon/attention.png',
              title: '服务器繁忙！'
            });
            console.log(res)
          })
        } else if (res.cancel) {
        }
      }
    })
  }
})