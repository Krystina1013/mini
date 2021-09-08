
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
    alarmList:[],
    page:1,
    limit:10,
    isLoaded: false,
    pageadd:true,
    warnType:{
      DEVICE_DOWN: "设备离线预警",
      STRANGER: "陌生人预警",
      CARE_MAN: "关注人员预警",
      AREA: "区域预警",
      CHEF_HAT:"厨师帽预警",
      // CHEF_CLOTHE:"厨师服预警",
      // FACE_MAS: "厨师口罩预警",
      MOUSE: "老鼠预警",
      VOICE_ALERT:'声音预警'
    },
    alarmType:'all',
    typeOptions: [
      { text: '全部', value: 'all' },
      { text: '设备离线预警', value: 'DEVICE_DOWN' },
      { text: '陌生人预警', value: 'STRANGER' },
      { text: '关注人员预警', value: 'CARE_MAN' },
      { text: '区域预警', value: 'AREA' },
      { text: '厨师帽预警', value: 'CHEF_HAT' },
      // { text: '厨师服预警', value: 'CHEF_CLOTHE' },
      // { text: '厨师口罩预警', value: 'FACE_MAS' },
      { text: '老鼠预警', value: 'MOUSE' },
      { text: '声音预警', value: 'VOICE_ALERT' }
    ],
    currentMonth: "",
    currentYear: "",
    chooseDate: "",
    maxDate: new Date().getTime(),
    currentDate: new Date().getTime(),
    startTime:"00:00",
    endTime:"23:59",
    showTimePopup:false,
    timePopupData:[],
    showPopup: false,
    showMore: false,
    showFilterPopup: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isLoaded: false
    })
    this.init()
  },
  // 全部已读
  allRead(){
    app.ajax($api.dev_warning_allRead,"PUT").then(res=>{
      wx.showToast({
        title: '全部已读标记成功',
        icon:"none"
      })
      setTimeout(()=>{
        this.setData({
          page: 1,
          pageadd: true,
          alarmList: [],
        })
        this.getListData();
      },600)
      
    })
  },
  getListData(){
    console.log(this.data.alarmType)
    this.setData({
      showMore: false
    })
    let currentMonth =this.data.currentYear?(this.data.currentMonth > 9 ?this.data.currentMonth: '0' + this.data.currentMonth):'';
    let startTime = this.data.currentYear?([this.data.currentYear,currentMonth,this.data.chooseDate].join('-') + ' '+ this.data.startTime):'';
    let endTime = this.data.currentYear?([this.data.currentYear,currentMonth ,this.data.chooseDate].join('-') + ' ' + this.data.endTime):'';
    console.log(startTime);
    let param = {};
    if (startTime) {
      param ={
        page:this.data.page,
        limit:this.data.limit,
        type: this.data.alarmType === 'all'?'':this.data.alarmType,
        startTime: startTime,
        endTime: endTime
      }
    } else {
      param ={
        page:this.data.page,
        limit:this.data.limit,
        type: this.data.alarmType === 'all'?'':this.data.alarmType,
      }
    }
    
    wx.showLoading({
      title: '加载中',
    })
    let old = this.data.alarmList;
    app.ajax($api.dev_device_warning,"GET",param).then(res=>{
      wx.hideLoading()
      let newdata = res.data.records;
      newdata.map(item=>{
        item.warnTime = item.warnTime.split(".")[0]
      })
      let newpage = this.data.page;
      if(res.data.records.length){
        if (this.data.pageadd) { //如果上拉就增加页面
          newpage++;
        }
        old = old.concat(newdata);
      } else {
        this.setData({
          pageadd: false,
          showMore: true
        })
      }
      this.setData({
        alarmList:[...old],
        page:newpage,
        isLoaded: true
      })
    })
  },
  toDetail(e){
    let index = e.target.id;
    let data = this.data.alarmList[index];
    if(data.status!="READ"){
      app.ajax($api.dev_device_read,'PUT',[data.id]).then(res=>{
        this.data.alarmList[index].status="READ";
        this.setData({
          alarmList:this.data.alarmList
        })
      })
    }
    // wx.setStorageSync('alarm', data);
    wx.navigateTo({
      url: `/pages/alarm/detail/detail?id=${data.id}`,
    })
  },
  // 告警类型筛选
  typeChange(value){
    this.setData({
      alarmType: value.detail,
    })
  },
    // 时段popup
    openTimePop(){
      if (!this.data.currentYear) {
        wx.showToast({
          title: '请先选择日期',
          icon:"none"
        })
        return
      }
      this.setData({
        showTimePopup:true
      })
    },
    confirmDate(value) {
      let date = formatTime(new Date(value.detail), "date").split('-');
      this.setData({
        currentMonth: date[1] < 9 ? date[1][1] : date[1],
        currentYear: date[0],
        chooseDate: date[2],
      })
  
      this.cancel();
      // this.init()
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
    // 筛选弹窗
    openFilterPopup() {
      this.setData({
        showFilterPopup: true
      })
    },
    onFilterClose() {
      this.setData({
        showFilterPopup: false
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
        page: 1,
        pageadd: true,
        alarmList: [],
      })
      // this.getListData();
    },
     // 初始化时间日期
  init() {
  
    
    for (let i = 0; i < 25; i++) {
      if(i==24){
        times.push(`23:59`);
      }else{
        times.push(`${i < 10 ? "0" + i : i}:00`);
      }
    }
    this.setData({
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
    })
    this.setData({
      alarmList:[],
      pageadd: true,
      page: 1
    })
    this.getListData();
  },
  reset() {
    this.setData({
      alarmType: 'all',
      currentYear:'',
      currentMonth:'',
      chooseDate: '',
      page: 1,
      startTime:'00:00',
      endTime: '23:59'

    })
    this.init();
  },
  // 确认筛选
  sure() {
    this.setData({
      page: 1,
      pageadd: true,
      alarmList: [],
      showFilterPopup: false
    })
    this.getListData()
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
    this.setData({
      page: 1,
      pageadd: true,
      alarmList: [],
      isLoaded: false
    })
    wx.stopPullDownRefresh();
    this.getListData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.pageadd) {
      this.getListData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})