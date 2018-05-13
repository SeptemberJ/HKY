import h from '../../../../utils/url.js'
var util = require('../../../../utils/util.js')
var MD5 = require('../../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    AutomaticName:'',
    ConditionList: [{ 'icon': '../../../../images/icon/delete.png', 'name': '时间', 'room': '', 'when': 0, 'status': 0, 'kind': 'time', 'time_start': '00:00', 'time_end': '23:59' },{ 'icon': '../../../../images/icon/delete.png', 'name': '灯带', 'room': '玄关', 'when': 0, 'status': 0, 'kind': 'aircondition' }, { 'icon': '../../../../images/icon/delete.png', 'name': '水晶灯', 'room': '传统', 'when': 1, 'status': 1,  'kind': 'light'}],
    ActionList: [{ 'icon': '../../../../images/icon/delete.png', 'name': '灯带', 'room': '玄关', 'when': 0, 'status': 0, 'kind': 'equipment' }, { 'icon': '../../../../images/icon/delete.png', 'name': '回家', 'room': '', 'when': 0, 'status': 1,  'kind': 'scene' }],
    ConditionKind:{
      'time': [
        [
          {
            id: 0,
            name: '变为'
          },
          {
            id: 1,
            name: '此时正好'
          }
        ]
      ],
      'aircondition': [
        [
          {
            id: 0,
            name: '变为'
          },
          {
            id: 1,
            name: '此时正好'
          }
        ], [
          {
            id: 0,
            name: '寒冷'
          },
          {
            id: 1,
            name: '舒适'
          },
          {
            id: 2,
            name: '炎热'
          }
        ]
      ],
      'light': [
        [
          {
            id: 0,
            name: '变为'
          },
          {
            id: 1,
            name: '此时正好'
          }
        ], [
          {
            id: 0,
            name: '昏暗'
          },
          {
            id: 1,
            name: '舒适'
          },
          {
            id: 2,
            name: '明亮'
          }
        ]
      ]
    },
    ActionKind: {
      'equipment': [
        [
          {
            id: 0,
            name: '立即'
          },
          {
            id: 1,
            name: '1分钟'
          },
          {
            id: 2,
            name: '2分钟'
          }
        ],
        [
          {
            id: 0,
            name: '打开'
          },
          {
            id: 1,
            name: '关闭'
          }
        ]
      ],
      'scene': [
        [
          {
            id: 0,
            name: '立即'
          },
          {
            id: 1,
            name: '1分钟'
          },
          {
            id: 2,
            name: '2分钟'
          }
        ],
        [
          {
            id: 0,
            name: '执行'
          }
        ]
      ]
    },
  },
  onLoad() {
    let IndexList = []
    this.data.ConditionList.map((Item, Idx) => {
      let temp = [Item.status, Item.when]
      IndexList.push(temp)
    })
    this.setData({
      multiIndexList: IndexList
    })
  },
  onShow() {

  },
  ChangeName(e){
    this.setData({
      AutomaticName: e.detail.value
    })
  },
  //改变时间
  bindTimeChange_start(e){
    let Temp = this.data.ConditionList
    Temp[e.currentTarget.dataset.idx].time_start = e.detail.value
    this.setData({
      ConditionList: Temp
    })
  },
  bindTimeChange_end(e) {
    let Temp = this.data.ConditionList
    Temp[e.currentTarget.dataset.idx].time_end = e.detail.value
    this.setData({
      ConditionList: Temp
    })
  },

  
  bindMultiPickerChange(e) {
    let Temp = this.data.ConditionList
    Temp[e.currentTarget.dataset.idx].when = e.detail.value[0]
    if (e.detail.value[1]){
      Temp[e.currentTarget.dataset.idx].status = e.detail.value[1]
    }
    this.setData({
      ConditionList: Temp
    })
  },
  bindMultiPickerChangeAction(e) {
    let Temp = this.data.ActionList
    Temp[e.currentTarget.dataset.idx].when = e.detail.value[1]
    Temp[e.currentTarget.dataset.idx].status = e.detail.value[0]
    this.setData({
      ActionList: Temp
    })
  },
  Submit(){
    console.log(this.data.ConditionList)
    console.log(this.data.ActionList)
  }
})