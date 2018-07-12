import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var MD5 = require('../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    equipmentList2: [{ 'icon': '', 'name': '智能升降器', 'id': '2' }, { 'icon': '', 'name': '声控开关', 'id': '2' }],
    equipmentList:[],
    IdModify: false,
    EQid:'',
    Equipment_Name: '',
    defaulttype: false,

  },
  onShow: function(){
    this.GetEquipmentList()
  },

  EditEquipment(e){
    this.setData({
      IdModify: true,
      EQid: e.currentTarget.dataset.id,
      Equipment_Name: e.currentTarget.dataset.name,
      defaulttype: e.currentTarget.dataset.defaulttype == 1?true:false,
    })
  },
  //input change
  ChangeEquipment_Name(e) {
    this.setData({
      Equipment_Name: e.detail.value
    })
  },
  switch1Change: function (e) {
    this.setData({
      defaulttype: e.detail.value
    })
  },
  ToAdd() {
    wx.navigateTo({
      url: '../add/index'
    })
  },
  Cancel() {
    this.setData({
      IdModify: false
    })
  },
  //修改设备
  ModifyEquipment(e){
    if (this.data.Equipment_Name.trim() == '') {
      wx.showModal({
        title: '提示',
        content: '输入设备名！',
        showCancel: false
      })
      return false
    }
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + '/updateregistermachine1',
      data: {
        second_name: this.data.Equipment_Name,
        id:this.data.EQid,
        defaulttype:this.data.defaulttype?1:0
      },
      method: 'POST', 
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          wx.hideLoading()
          wx.showToast({
            title: '修改成功！',
            icon: 'success',
            duration: 1500
          })
          this.setData({
            IdModify: false
          })
          this.GetEquipmentList()
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../../images/icon/attention.png',
            title: '修改失败！'
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
  //设备列表
  GetEquipmentList() {
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + '/selectregisteruser?homeid=' + app.globalData.CurHomeId,
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
            equipmentList: res.data.registermachine
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
  LookData(e) {
    wx.navigateTo({
      url: '../analysis/index?id=' + e.currentTarget.dataset.id + '&name=' + e.currentTarget.dataset.name
    })
  },
  //删除设备
  Delete(e) {
    let ID = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确定删除该设备?',
      success: (res) => {
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
})
