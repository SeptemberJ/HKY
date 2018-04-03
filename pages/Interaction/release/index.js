import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var MD5 = require('../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    releaseContent:'',
    tempFilePaths: [],
    copyTempFilePaths: [],
    Canwork: false,
    loadingHidden:true
  },
  ChangeContent(e){
    this.setData({
      releaseContent: e.detail.value
    })
  },
  ChooseUploadFiles(){
    let temp = this.data.tempFilePaths
    wx.chooseImage({
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          tempFilePaths:  temp.concat(res.tempFilePaths),
          copyTempFilePaths: temp.concat(res.tempFilePaths)
        })
        console.log(res)
      }
    })
  },
  //删除图片
  DeleteFile(e) {
    let IDX = e.currentTarget.dataset.idx
    let AfterSource = this.data.tempFilePaths
    AfterSource.splice(IDX, 1)
    this.setData({
      tempFilePaths: AfterSource,
      copyTempFilePaths: AfterSource
    })
  },
  //提交
  SumitInfo: function () {
    // this.UploadImg()
    let DATA = {
      ftelphone: app.globalData.User_Phone,
      fname: app.globalData.userInfo.nickName,
      remark: this.data.releaseContent,
      comment_picture: this.data.tempFilePaths,
    }
    requestPromisified({
      url: h.main + '/insertrating',
      data: {
        ratings: DATA
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {
      //   'content-type': 'application/x-www-form-urlencoded',
      //   'Accept': 'application/json'
      // }, // 设置请求的 header
    }).then((res) => {
      // switch (res.data.result) {
      //   case 1:
      //     wx.hideLoading()
      //     wx.showToast({
      //       title: '新增成功！',
      //       icon: 'success',
      //       duration: 1500
      //     })
      //     //返回
      //     wx.navigateBack();
      //     break
      //   case 0:
      //     wx.hideLoading()
      //     wx.showToast({
      //       image: '../../../images/icon/attention.png',
      //       title: '新增失败'
      //     });
      //     break
      //   default:
      //     wx.hideLoading()
      //     wx.showToast({
      //       image: '../../../images/icon/attention.png',
      //       title: '服务器繁忙！'
      //     });
      // }
    }).catch((res) => {
      wx.hideLoading()
      wx.showToast({
        image: '../../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
      console.log(res)
    })
  },
  UploadImg: function () {
    this.setData({
      loadingHidden: false,
      Canwork: true
    })
    wx.uploadFile({
      url: h.main + '/page/Insertimg.do',//仅为示例，非真实的接口地址
      filePath: this.data.tempFilePaths.splice(0, 1)[0],
      name: 'file',
      formData: {
        id: this.data.id,
        QCode: this.data.QCode,
        Note: this.data.Note
      },
      header: {
        'content-type': 'multipart/form-data',
      },
      success: (res) => {
        console.log('图片上传backInfo-----')
        console.log(res)
        console.log(this.data.Note)
        if (res.data == 1) {
          if (this.data.tempFilePaths.length > 0) {
            this.UploadImg()
          } else {
            this.setData({
              loadingHidden: true,
              //Canwork: true
            })
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 1500
            })
            setTimeout(() => {
              wx.navigateBack()
            }, 1500)

          }
        } else {
          this.setData({
            loadingHidden: true,
            Canwork: false,
            tempFilePaths: this.data.copyTempFilePaths
          })
          wx.showToast({
            image: '/images/attention.png',
            title: '图片上传失败！'
          });
          return false
        }
      },
      fail: (res) => {
        console.log('图片上传失败backInfo-----')
        console.log(res)
        this.setData({
          loadingHidden: true,
          Canwork: false
        })
        return false
      },
      complete: (res) => {
      }
    })
  }
})
