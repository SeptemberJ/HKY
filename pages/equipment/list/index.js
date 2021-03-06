import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var MD5 = require('../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    AQI:'',
    Level:'',
    IdAdd:false,
    Equipment_Name:'',
    Equipment_Code_F: '',
    Equipment_Code_S: '',
    userInfo:{},
    equipmentList2:[],
    equipmentList:[],
  },
  onLoad: function () {
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo
        })
      }
    })
  },
  onShow: function () {
    console.log('onshow---')
    this.GetAQI()
    //this.GetEquipmentList()
  },
  //input change
  ChangeEquipment_Name(e){
    this.setData({
      Equipment_Name: e.detail.value
    })
  },
  ChangeEquipment_Code_F(e) {
    this.setData({
      Equipment_Code_F: e.detail.value
    })
  },
  ChangeEquipment_Code_S(e) {
    this.setData({
      Equipment_Code_S: e.detail.value
    })
  },
  ToAccount(){
    wx.navigateTo({
      url: '../../Account/index'
    })
  },
  ToAdd(){
    this.setData({
      IdAdd: true
    })
  },
  Cancel(){
    this.setData({
      IdAdd:false
    })
  },
  //删除设备
  Delete(e){
    let ID = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确定删除该设备?',
      success: (res)=> {
        if (res.confirm) {
          requestPromisified({
            url: h.main + '/deletenoqrcode?qrcodeid=' + ID,
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
                wx.showToast({
                  title: '删除成功！',
                  icon: 'success',
                  duration: 1500
                })
                this.GetEquipmentList()
                break
              case 0:
                wx.showToast({
                  image: '../../../images/icon/attention.png',
                  title: '删除失败'
                });
                break
              default:
                wx.showToast({
                  image: '../../../images/icon/attention.png',
                  title: '服务器繁忙！'
                });
            }
          }).catch((res) => {
            wx.showToast({
              image: '../../../images/icon/attention.png',
              title: '服务器繁忙！'
            });
            console.log(res)
          })
        } else if (res.cancel) {
          return false
        }
      }
    })
  },
  //新增设备
  AddEquipment(){
    //校验
    if (!this.data.Equipment_Name || !this.data.Equipment_Code_F || !this.data.Equipment_Code_S){
      wx.showToast({
        image: '../../../images/icon/attention.png',
        title: '请填写相关信息！'
      });
      return false
    }
    let DATA = {
      second_name: this.data.Equipment_Name,
      master_control: this.data.Equipment_Code_F,
      second_qrcode: this.data.Equipment_Code_S,
      ftelphone: app.globalData.User_Phone
    }
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + '/selectqrcode',
      data: {
        qrcodes: DATA
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
          wx.showToast({
            title: '新增成功！',
            icon: 'success',
            duration: 1500
          })
          this.Cancel()
          //刷新列表
          this.GetEquipmentList()
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../../images/icon/attention.png',
            title: '新增失败'
          });
          break
        default:
          wx.hideLoading()
          wx.showToast({
            image: '../../../images/icon/attention.png',
            title: '服务器繁忙！'
          });
      }
    }).catch((res)=>{
      wx.hideLoading()
      wx.showToast({
        image: '../../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
      console.log(res)
    })
  },
  //设备列表
  GetEquipmentList(){
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + '/selectallqrcode?ftelphone=' + app.globalData.User_Phone,
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
          //刷新列表
          this.setData({
            equipmentList: res.data.qrcodelist
          })
          wx.hideLoading()
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../../images/icon/attention.png',
            title: '设备列表获取失败'
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
  // 查看数据
  LookData(e){
    wx.navigateTo({
      url: '../analysis/index?id=' + e.currentTarget.dataset.id + '&name=' + e.currentTarget.dataset.name
    })
  },
  //AQI查询
  GetAQI(){
    requestPromisified({
      url: h.main + '/selectAQI',
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
          this.setData({
            AQI: res.data.aqilist[0].aqi,
            Level: res.data.aqilist[0].number
          })
          app.globalData.AQI = res.data.aqilist[0].aqi
          this.GetEquipmentList()
          break
        case 0:
          wx.showToast({
            image: '../../../images/icon/attention.png',
            title: 'AQI获取失败'
          });
          break
        default:
          wx.showToast({
            image: '../../../images/icon/attention.png',
            title: '服务器繁忙！'
          });
      }
    }).catch((res) => {
      wx.showToast({
        image: '../../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
      console.log(res)
    })
  },
})
