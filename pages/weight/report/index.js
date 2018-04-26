import * as echarts from '../../../ec-canvas/echarts';
import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var MD5 = require('../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
const app = getApp();

Page({
  data: {
    CurSwitch: 0,
    HeathDataIndex:'',
    // shapeType: 5,
    distance:0
  },

  onShow() {
    this.GetHeathIndex()

  },
  Switch(){
    this.setData({
      CurSwitch: this.data.CurSwitch == 0?1:0
    })
  },
  GetHeathIndex(){
      //获取消息
      requestPromisified({
        url: h.main + '/selecthealthreport?ftelphone=' + app.globalData.User_Phone,
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
            let Info = res.data.healthreport[0]
            this.setData({
              HeathDataIndex: Info
            })
            switch (Info.type) {
              case '1':
                this.setData({
                  distance: Info.BMI * (142 / 18.5) + 142 * (Info.type - 1)
                })
                break
              case '2':
                this.setData({
                  distance: (Info.BMI - 18.5) * (142 / (24.0 - 18.5)) + 142 * (Info.type - 1)
                })
                break
              case '3':
                this.setData({
                  distance: (Info.BMI - 24.0) * (142 / (28.0 - 24.0)) + 142 * (Info.type - 1)
                })
                break
              case '4':
                this.setData({
                  distance: (Info.BMI - 28.0) * (142 / (30.0 - 28.0)) + 142 * (Info.type - 1)
                })
                break
              case '5':
                this.setData({
                  distance: (Info.BMI - 30.0) * (142 / (50.0 - 30.0)) + 142 * (Info.type - 1) > 710 ? 680 : (Info.BMI - 30.0) * (142 / (50.0 - 30.0)) + 142 * (Info.type - 1)
                })
                break
            }

            break
          case 0:
            wx.showToast({
              image: '../../../images/icon/attention.png',
              title: '消息获取失败!'
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
      })
    }
});
