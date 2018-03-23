
//获取应用实例
const app = getApp()

Page({
  data: {
    IdAdd:false,
    userInfo:{},
    equipmentList2:[],
    equipmentList:[
      { 'name':'厨房1油烟机','id':0},
      {'name': '厨房2油烟机', 'id': 1},
      {'name': '厨房3油烟机', 'id': 2}
    ]
  },
  onLoad: function () {
    console.log(this.data.equipmentList)
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo
        })
        console.log(res.userInfo)
      }
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
  Add(){
    this.Cancel()
  },
  // 查看数据
  LookData(){
    wx.navigateTo({
      url: '../analysis/index'
    })
  }
})
