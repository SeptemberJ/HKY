
//获取应用实例
const app = getApp()

Page({
  data: {
    ReplyContent:''
  },
  ChangeReply(e){
    this.setData({
      ReplyContent:e.detail.value
    })
  },
  SumitInfo(){

  }
})
