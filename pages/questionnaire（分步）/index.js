
//获取应用实例
const app = getApp()

Page({
  data: {
    questionList2:[
      { 'type': 'Single', 'qusetion': '您家里几口人？', 'answer': [{ 'value': '1人', 'control': [], 'id': 0 }, { 'value': '2人', 'control': [], 'id': 1 }, { 'value': '3人', 'control': [], 'id': 2 }, { 'value': '3人及以上', 'control': [], 'id': 3 }]},
      { 'type': 'Single', 'qusetion': '您做饭会开启抽油烟机吗？', 'answer': [{ 'value': '开', 'control': [], 'id': 0 }, { 'value': '偶尔开', 'control': [], 'id': 1 }, { 'value': '不开', 'control': [], 'id': 2}, { 'value': '未装油烟机', 'control': [3,4] }]},
      { 'type': 'Single', 'qusetion': '您家中抽油烟机的品牌？', 'answer': [{ 'value': '老板', 'control': [] }, { 'value': '方太', 'control': [] }, { 'value': '美的', 'control': [] }, { 'value': '华帝', 'control': [] }, { 'value': '其他', 'control': [] }] },
      { 'type': 'Single', 'qusetion': '您家中抽油烟机已使用了多少年？', 'answer': [{ 'value': '一年以内', 'control': [] }, { 'value': '2~3年', 'control': [] }, { 'value': '3~4年', 'control': [] }, { 'value': '5~6年及以上', 'control': [] }, { 'value': '7年及以上', 'control': [] }] },
    ],
    questionList: [
      { 'type': 'Single', 'qusetion': '您家里几口人？', 'answer': [{ 'value': '1人', 'id': 0 }, { 'value': '2人', 'id': 1 }, { 'value': '3人', 'id': 2 }, { 'value': '3人及以上', 'id': 3}] },
      { 'type': 'Multiple', 'qusetion': '您家中有哪些易感人群（多选）？', 'answer': [{ 'value': '老人', 'id': 0 }, { 'value': '儿童', 'id': 1 }, { 'value': '孕妇', 'id': 2 }, { 'value': '无', 'id': 3 }] },
      { 'type': 'Single', 'qusetion': '您做饭会开启抽油烟机吗？', 'answer': [{ 'value': '开', 'id': 0 }, { 'value': '偶尔开', 'id': 1 }, { 'value': '不开', 'id': 2 }, { 'value': '未装油烟机', 'id': 3 }], 'control': { 'value':'未装油烟机','list':[4,5]}},
      { 'type': 'Single', 'qusetion': '您家中抽油烟机的品牌？', 'answer': [{ 'value': '老板', 'id': 0 }, { 'value': '方太', 'id': 1 }, { 'value': '美的', 'id': 2 }, { 'value': '华帝', 'id': 3 }, { 'value': '其他', 'id': 4}] },
      { 'type': 'Single', 'qusetion': '您家中抽油烟机已使用了多少年？', 'answer': [{ 'value': '一年以内', 'id': 0 }, { 'value': '2~3年', 'id': 1 }, { 'value': '3~4年', 'id': 2 }, { 'value': '5~6年及以上', 'id': 3 }, { 'value': '7年及以上', 'id': 4}] },
      { 'type': 'Single', 'qusetion': '您的厨房是什么格局？（附图）', 'answer': [{ 'value': '一字型 ', 'img': '../../images/picture/图片1.png', 'id': 0 }, { 'value': 'L字型', 'img': '../../images/picture/图片2.png', 'id': 1 }, { 'value': 'U字型', 'img': '../../images/picture/图片3.png', 'id': 2 }] },
    ],
    Curchecked:'2人',
    submitForm:[],
    ifShowList:[],
    CurStep:0,
    StepList:[]
  },
  onLoad: function () {
    let obj
    let temp = this.data.questionList.slice(0)
    let len = this.data.questionList.length/2
    let submitFormTemp = []
    let ifShowListTemp = []
    let StepListTemp = []
    //每5条一个步骤
    for(let i = 0;i<len;i++){
      let eachArray = temp.splice(0, 2)
      StepListTemp.push(eachArray)
    }
    console.log(StepListTemp)
    this.data.questionList.map((item,idx)=>{
      if (item.type == 'Single'){
        obj = ''
      }else{
        obj = []
      }
      submitFormTemp.push(obj)
      ifShowListTemp.push(true)
    })
    console.log('初始---')
    console.log(submitFormTemp)
    this.setData({
      submitForm: submitFormTemp,
      ifShowList: ifShowListTemp,
      StepList: StepListTemp
    })
  },
  ChangeRadio: function(e){
    let submitFormTemp = this.data.submitForm
    let ifShowListTemp = this.data.ifShowList
    let IDX = e.currentTarget.dataset.idx
    submitFormTemp[IDX] = e.detail.value
    if (this.data.questionList[IDX].control) {
      console.log('has control---')
      if (e.detail.value == this.data.questionList[IDX].control.value) {
        this.data.questionList[IDX].control.list.map((item, idx) => {
          ifShowListTemp[item - 1] = false
          submitFormTemp[item - 1] = null
        })
      } else {
        this.data.questionList[IDX].control.list.map((item, idx) => {
          ifShowListTemp[item - 1] = true
        })
      }
    }
    this.setData({
      submitForm: submitFormTemp,
      ifShowList: ifShowListTemp
    })
    console.log('单选---')
    console.log(this.data.submitForm)
    console.log(this.data.ifShowList)
    
  },
  ChangeCheckbox: function (e) {
    console.log(e)
    let temp = this.data.submitForm
    temp[e.currentTarget.dataset.idx].value = e.detail.value
    temp[e.currentTarget.dataset.idx].checked = !temp[e.currentTarget.dataset.idx].checked
    this.setData({
      submitForm: temp
    })
    console.log('多选---')
    console.log(this.data.submitForm)
    console.log(this.data.ifShowList)
  },
  NextStep: function () {
    let Cur = this.data.CurStep
    if (this.data.CurStep < this.data.StepList.length -1){
      Cur++
    }
    this.setData({
      CurStep: Cur
    })
  },
  PreStep: function () {
    let Cur = this.data.CurStep
    if (this.data.CurStep >0) {
      Cur--
    }
    this.setData({
      CurStep: Cur
    })
  },
  Submit: function(){
    console.log(this.data.submitForm)
  }
})
