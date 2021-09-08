const app = getApp();
const $api = require('../../../utils/api').API
import {
  getMonthWeek,
  formatTime,
} from "../../../utils/util";
let times = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentMonth: "",
    currentYear: "",
    chooseDate: "",
    days: [],
    scrollLeft: 0,
    showPopup: false,
    currentDate: new Date().getTime(),
    maxDate: new Date().getTime(),
    currentTime:0,//当前选择时间段下标
    searchData:[],
    page:1,
    pageSize:30,
    startTime:"00:00",
    endTime:"23:59",
    showTimePopup:false,
    timePopupData:[],
    pageadd:true,
    scroll:{},//滑动数据
    isIos:false,
    showMore: false,
    alarmType: 'all',
    showFilterPopup: false,
    cameraGroupId:'', // 摄像机分组
    cameraName:'', // 摄像机名称
    typeOptions: [
      // { text: '全部', value: 'all' },
      // { text: '设备离线预警', value: 'DEVICE_DOWN' },
      // { text: '陌生人预警', value: 'STRANGER' },
      // { text: '关注人员预警', value: 'CARE_MAN' },
      // { text: '区域预警', value: 'AREA' },
      // { text: '厨师帽预警', value: 'CHEF_HAT' },
      // // { text: '厨师服预警', value: 'CHEF_CLOTHE' },
      // // { text: '厨师口罩预警', value: 'FACE_MAS' },
      // { text: '老鼠预警', value: 'MOUSE' },
      // { text: '声音预警', value: 'VOICE_ALERT' }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init(new Date(),"first");
    this.getCameraList();
  },
  getCameraList() {
    app.ajax($api.csia_camera_group,"GET",{page:1,pageSize:999}).then(res=>{
      let data = [];
      data = res.data;
      if (data && data.length > 0 ) {
        data.map(item=>{
          item.text = item.name;
          item.value = item.id
        })
      }
     
      data.unshift({
        value:"",
        text:"全部",
        // hideName:"全部"
      })
      this.setData({
        typeOptions:data,
        cameraGroupId:data.length?data[0].value:""
      })
      // this.getListData();
    })
  },
  // 初始化时间日期
  init(date,type) {
    console.log(date)
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let d = type=="first"?new Date(year, month, 0):new Date(year, month, 0);
    console.log('d',d)
    let days = new Array(d.getDate());
    console.log('days',days)
    this.data.days = [];
    for (let i = 0; i < days.length; i++) {
      let eachDate = new Date(year, month - 1, i + 1);
      this.data.days.push("日一二三四五六".charAt(eachDate.getDay()));
    }
    
    for (let i = 0; i < 25; i++) {
      if(i==24){
        times.push(`23:59`);
      }else{
        times.push(`${i < 10 ? "0" + i : i}:00`);
      }
    }
    let week = getMonthWeek(year, month, day).getWeek;
    this.setData({
      days: this.data.days,
      currentMonth: `${month}`,
      currentYear: `${year}`,
      chooseDate: `${day}`,
      timePopupData:[
        {
          values:times,
          defaultIndex:0,
        },
        {
          values:times,
          defaultIndex:23,
        },
      ],
      scrollLeft: (day-1)*82+"rpx",
    })
    this.setData({
      searchData:[]})
    this.getCapture();
  },
  // 点击左边箭头滑动一周
  srcollToLeft(){
    let x;
    let day = this.data.days.length;// 当前选择月份有多少天
    if(this.data.scroll.scrollLeft<=0){
      return
    }else{
      x = (this.data.scroll.scrollWidth/day)*7
    }
    this.setData({
      scrollLeft : typeof this.data.scrollLeft=="string"?this.data.scroll.scrollLeft-x:this.data.scrollLeft-x
    })
  },
  dragend(e){
    this.setData({
      scroll:e.detail,
    })
  },
  // 点击右边箭头滑动一周
  srcollToRight(){
    let x;
    let day = this.data.days.length;// 当前选择月份有多少天
    if(this.data.scroll.scrollWidth-this.data.scroll.scrollLeft<=290){
      return
    }else{
      x = (this.data.scroll.scrollWidth/day)*7
    }
    console.log(typeof this.data.scrollLeft)
    this.setData({
      scrollLeft : typeof this.data.scrollLeft=="string"?x+this.data.scroll.scrollLeft:this.data.scrollLeft+x
    })
    console.log(this.data.scrollLeft)
  },
  // 改变日期
  handleChangeDate(e) {
    console.log(`${this.data.currentYear}-${this.data.currentMonth}-${e.target.id}`)
    console.log(new Date(`${this.data.currentYear}-${this.data.currentMonth}-${e.target.id} 00:00:00`).getTime())
    let date;
    if(this.data.isIos){
      date = new Date(`${this.data.currentYear}/${this.data.currentMonth}/${e.target.id}`).getTime()
    }else{
      date = new Date(`${this.data.currentYear}-${this.data.currentMonth}-${e.target.id}`).getTime()
    }
    let day = e.target.id;
    this.setData({
      chooseDate: day,
      page: 1,
      pageadd: true,
      searchData: [],
      currentDate:date
    })
    this.getCapture();
  },
  reset() {
    this.setData({
      startTime:"00:00",
      endTime:"23:59",
      page: 1
    })
    this.init(new Date(),"first");
  },
  changeInput(e){
    if(e.detail==""){
      this.setData({
        cameraName: ''
      })
    }else {
      this.setData({
        cameraName: e.detail
      })
    }
  },
  onClear(e) {
      this.setData({
        cameraName: '',
        page:1,
        searchData:[]
      })
      console.log(this.data.cameraName)
     this.getCapture();
  },
  sure() {
    this.setData({
      showFilterPopup: false,
      page: 1,
      searchData: [],
    })
    this.selectComponent('#dropItem').toggle(false);
    this.getCapture();
    
  },
  confirmDate(value) {
    let date = formatTime(new Date(value.detail), "date").split('-');
    this.setData({
      currentMonth: date[1] < 9 ? date[1][1] : date[1],
      currentYear: date[0],
      chooseDate: date[2],
    })

    this.cancel();
    // this.init(new Date(value.detail))
  },
  cancel() {
    this.setData({
      showPopup: false,
      showTimePopup: false,
    })
  },
  openPopup() {
    this.setData({
      showPopup: true
    })
  },
  // 改变时间段
  changeTime(e){
    if(e.detail.index[0]>e.detail.index[1]){
      wx.showToast({
        title: '开始时间不能大于结束时间',
        icon:"none"
      })
      return
    }
    this.data.timePopupData[0].defaultIndex = e.detail.index[0];
    this.data.timePopupData[1].defaultIndex = e.detail.index[1];
    this.setData({
      startTime:e.detail.value[0],
      endTime:e.detail.value[1],
      timePopupData:this.data.timePopupData,
      showTimePopup:false,
      // page: 1,
      // pageadd: true,
      // searchData: [],
    })
    // this.getCapture();
  },
  // 获取抓拍记录
  getCapture(){
    console.log(this.data.cameraName)
    this.setData({
      showMore: false
    })
    let startTime = `${this.data.currentYear}-${this.data.currentMonth }-${this.data.chooseDate} ${this.data.startTime}:00`;
    let endTime = `${this.data.currentYear}-${this.data.currentMonth }-${this.data.chooseDate} ${this.data.endTime}:00`;
    let param = {
      page:this.data.page,
      cameraGroupId:this.data.cameraGroupId,
      cameraName: this.data.cameraName,
      pageSize:this.data.pageSize,
      startTime,
      endTime
    }
    let old = this.data.searchData;
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    app.ajax($api.csia_unknownFaceTimeSearch,'POST',param).then(res=>{
      wx.hideLoading();
      let newdata = res.data.records;
      let newpage = this.data.page;
      if(res.data.records.length){
        if (this.data.pageadd) { //如果上拉就增加页面
          newpage++;
        }
        old = old.concat(newdata);
      } else {
        this.setData({
          showMore: true
        })
      }
      this.setData({
        searchData:[...old],
        page:newpage
      })
    })
  },
  toDetail(e){
    let index = e.target.id;
    console.log(this.data.searchData[index])
    wx.setStorageSync('cap', this.data.searchData[index]);
    wx.navigateTo({
      url: '/pages/capture/detail/detail',
    })
  },
  // 告警类型筛选
    typeChange(value){
      this.setData({
        cameraGroupId: value.detail,
      })
    },
  // 时段popup
  openTimePop(){
    this.setData({
      showTimePopup:true
    })
  },
    // 筛选弹窗
    openFilterPopup() {
      this.setData({
        showFilterPopup: !this.data.showFilterPopup
      })
      this.selectComponent('#dropItem').toggle(false);
    },
    onFilterClose() {
      this.setData({
        showFilterPopup: false
      })
      this.selectComponent('#dropItem').toggle(false);
    },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    wx.getSystemInfo({
      success: (result) => {
        that.setData({
          isIos:result.system.indexOf("iOS")!=-1
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // this.setData({
    //   page: 1,
    //   pageadd: false,
    //   searchData: [],
    // })
    // wx.stopPullDownRefresh();
    // this.getCapture();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      pageadd: true
    })
    this.getCapture();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})