// pages/checkIn/classCheck.js
const app = getApp();
const $api = require('../../../utils/api').API;
import {
  dateFormat,
  getDateByTimeStamp
} from "../../../utils/util";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toDayDate: new Date(),
    showPopup: false,
    startTime: getDateByTimeStamp(new Date().getTime()), // 时间
    currentDate: new Date().getTime(), // 时间
    active:'0',
    activeName: '0',
    dataForm: {},
    lateList: [],
    earlyList: [],
    nocardList: [],
    latebackList: [],
    normalDownList:[],
    normalUpList:[],
    nobackList: [],
    studentType: '',
    type: '早退',
    classIds: '',
    className: '',
    totalCount:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      classIds: options.id,
      className: options.name,
    })
    wx.setNavigationBarTitle({
      title: options.name
    })
  },
  // 统计
  getClassList() {
    let date = getDateByTimeStamp(this.data.currentDate)
   
    let params = {
      page:1,
      limit:1000,
      date: date,
      classIds:this.data.classIds,
      studentType: this.data.studentType,
    }
    app.ajax($api.get_recordAbstract, 'GET', params).then(res => {
      this.setData({
        dataForm:res.data.records[0]
      })
    })
  },
  //全部考勤
  getAllrecordList() {
    let date = getDateByTimeStamp(this.data.currentDate)
    app.ajax($api.get_allrecordList, 'GET', {
      date, classIds: this.data.classIds,
    }).then(res => {
      this.setData({
        lateList: res.data.迟到,
        earlyList: res.data.早退,
        nocardList: res.data.未打卡,
        latebackList: res.data.晚归,
        nobackList: res.data.未归,
        normalDownList: res.data.正常放学,
        normalUpList: res.data.正常上学,
      })
    })
  },
  // 走读生考勤
  getRecordList() {
    let date = getDateByTimeStamp(this.data.currentDate)
    app.ajax($api.get_recordList, 'GET', {
      date, classIds: this.data.classIds,
    }).then(res => {
      console.log(res.data)
      this.setData({
        normalUpList: res.data.正常上学,
        lateList: res.data.迟到,
        normalDownList: res.data.正常放学,
        earlyList: res.data.早退,
        nocardList: res.data.未打卡,
        // latebackList: res.data.晚归,
        // nobackList: res.data.未归,
      })
    })
  },
// 住校生考勤
  getRecordListRes() {
    let date = getDateByTimeStamp(this.data.currentDate)
    console.log('aaaa', this.data.currentDate)
    app.ajax($api.get_recordListRes, 'GET', {
      date, classIds: this.data.classIds,
    }).then(res => {
      console.log(res.data)

      this.setData({
        normalUpList: res.data.正常上学,
        lateList: res.data.迟到,
        normalDownList: res.data.正常放学,
        earlyList: res.data.早退,
        nocardList: res.data.未打卡,
        latebackList: res.data.晚归,
        nobackList: res.data.未归,
      })
    })
  },

  openPopup() {
    this.setData({
      showPopup: true
    })
  },
  cancel() {
    this.setData({
      showPopup: false,
    })
  },
  // 开始时间
  confirmDate(value) {
    let date = dateFormat("YYYY-mm-dd", new Date(value.detail));
    this.setData({
      startTime: date,
      currentDate: new Date(value.detail).getTime()
    })
   //判断当前是哪个标签下
    this.onClickAll();
    this.cancel();
  },
  // 切换全部/走读生/住宿生
  onClick(e) {
    this.setData({
      active:e.detail.name,
      // startTime:getDateByTimeStamp(new Date().getTime()), // 时间
      lateList: [],
      earlyList: [],
      nocardList: [],
      latebackList: [],
      normalDownList:[],
      normalUpList:[],
      nobackList: [],
    })
    this.onClickAll();
  },
  // 切换判断
  onClickAll(){
    this.setData({
      dataForm: {},
      lateList: [],
      earlyList: [],
      nocardList: [],
      latebackList: [],
      nobackList: [],
    })
    if (this.data.active == 0) {
      this.setData({
        studentType:'',
      })
      this.getAllrecordList()
    } else if(this.data.active == 1){
      this.setData({
        studentType:'走读生',
      })
      this.getRecordList()
    }else{
      this.setData({
        studentType:'住宿生',
      })
      this.getRecordListRes()
    }
    this.getClassList()
  },
  onChange(event) {
    this.setData({
      activeName: event.detail,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    this.getAllrecordList()
    this.getClassList()
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})