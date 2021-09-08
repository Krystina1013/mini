// pages/member/index/index.js
const app = getApp();
const $api = require('../../../utils/api').API;
import {
  dateFormat,
  getDateByTimeStamp
} from "../../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scence: {},
    user: {},
    showPopup: false,
    startTime: "",
    currentDate: new Date().getTime(),
    dataList: {
      upRecord:'--',
      downRecord: '--',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      scence: app.getCache("scence"),
    })

  },
  getUserAttendance() {
    let date = getDateByTimeStamp(this.data.startTime)
    app.ajax($api.get_myAttendance, 'GET', {
      date
    }).then(res => {
      if(res.data){
        this.setData({
          dataList: res.data
        })
      }  
    }).catch((res)=>{
      this.setData({
        dataList: {
          upRecord:'--',
          downRecord: '--'
        }
      })
    })
  },
  openPopup() {
    this.setData({
      showPopup: true
    })
  },
  // 开始时间
  confirmDate(value) {
    let date = dateFormat("YYYY-mm-dd", new Date(value.detail));
    this.setData({
      startTime: date,
    })
    this.getUserAttendance();
    this.cancel();
  },
  cancel() {
    this.setData({
      showPopup: false,
    })
  },
  getCount() {
    app.ajax($api.dev_warning_count, "GET").then(res => {
      this.setData({
        count: res.data
      })
    })
  },
  getUser() {
    app.ajax($api.app_worker, 'GET').then(res => {
      this.setData({
        user: res.data
      })
    })
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
    this.getUser();
    this.getCount();
    let date = dateFormat("YYYY-mm-dd", new Date());
    this.setData({
      startTime: date
    })
    this.getUserAttendance();
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
    let date = dateFormat("YYYY-mm-dd", new Date());
    this.setData({
      scence: app.getCache("scence"),
      user: {},
      showPopup: false,
      startTime: date,
      currentDate: new Date().getTime(),
      dataList: {
        upRecord:'--',
        downRecord: '--',
      }
    })
    this.getUser();
    this.getCount();
    this.getUserAttendance();
    wx.stopPullDownRefresh();
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