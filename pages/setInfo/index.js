import h from '../../utils/url.js'
var util = require('../../utils/util.js')
var MD5 = require('../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    CurSwitch:0,
    Cur_date: util.formatTime(new Date()),
    WeightCircumference: {
      sex: 0,
      age: '',
      height: '',
      weight_now: '',
      weight_target: '',
      fat: '',
    },
    BodyCircumference:{
      waist: '',
      bust: '',
      hipline: '',
      arm: '',
      thigh: '',
      leg: '',
    }
    
  },
  // Switch
  Switch() {
    this.setData({
      CurSwitch: this.data.CurSwitch == 0 ? 1 : 0
    })
  },
  // ChangeCur_date
  ChangeCur_date(e){
    this.setData({
      Cur_date: e.detail.value
    })
  },
  // input changes
  ChangeBodyCircumference(e){
    let temp = this.data.BodyCircumference
    temp[e.currentTarget.dataset.type] = e.detail.value
    this.setData({
      BodyCircumference: temp
    })
  },
  SubmitBodyCircumference(){
    console.log(this.data.BodyCircumference)
  }
})