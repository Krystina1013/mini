// pages/checkIn/index.js
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
    activeName: '',
    dataForm: {},
    lateList: [],
    earlyList: [],
    nocardList: [],
    latebackList: [],
    nobackList: [],
    // 教职工
    dataFormWorker: {},
    workerLateList: [],
    workerEarlyList: [],
    workerNocardList: [],
    workerLatebackList: [],
    workerNobackList: [],
    // 学生班级
    classTree: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 列表点击
  onChange(event) {
    this.setData({
      activeName: event.detail,
    });
  },
  // 教职工统计
  getWorkerStatistcs() {
    let date = getDateByTimeStamp(this.data.currentDate)
    app.ajax($api.get_workerStatistcs, 'GET', {
      date
    }).then(res => {
      this.setData({
        dataFormWorker: res.data
      })
    })
  },
  // 教职工列表
  getWorkerCheckList() {
    let date = getDateByTimeStamp(this.data.currentDate)
    app.ajax($api.get_workerCheck, 'GET', {
      date
    }).then(res => {
      this.setData({
        workerLateList: res.data.迟到,
        workerEarlyList: res.data.早退,
        workerNocardList: res.data.未打卡,
        workerLatebackList: res.data.正常上班,
        workerNobackList: res.data.正常下班,
      })
    })
  },
  // 学生
  getClassTree() {
    app.ajax($api.get_class_tree, 'GET', {}).then(res => {
      let data = res.data;
      let arr = [];
      let obj = this.iterator_self(data)
      for (let i in obj) {
        arr.push(...obj[i].children)
      }
      this.setData({
        classTree: arr
      })
    })
  },
  // 递归需要的tree数据
  iterator_self(arr) {
    let obj = [];
    for (let key in arr) {
      const name = key;
      let children = [];
      if (JSON.stringify(arr[key]) != "{}") {
        if (arr[key] instanceof Array != true) {
          children = this.iterator_self(arr[key]);
        }
      }
      if (JSON.stringify(arr[key]) != "{}") {
        if (arr[key] instanceof Array) {
          for (let v = 0; v < arr[key].length; v++) {
            children.push({
              name: arr[key][v].className,
              id: arr[key][v].id
            });
          }
        }
        obj.push({
          name,
          children,
        });
      }
    }
    return obj;
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
    this.getWorkerStatistcs();
    this.getWorkerCheckList();
    this.cancel();
  },


  onChange1(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  // 切换教职工和学生
  onClick(event) {
    if (event.detail.name == 1) {
      this.getClassTree();
    } else {
      this.getWorkerStatistcs();
      this.getWorkerCheckList();
    }
  },
  classNameClick(e) {
    let obj = e.currentTarget.dataset.obj;
    wx.navigateTo({
      url: '/pages/checkIn/classCheck/index?name=' + obj.name+"&id="+obj.id,
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
    this.getWorkerStatistcs();
    this.getWorkerCheckList();
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