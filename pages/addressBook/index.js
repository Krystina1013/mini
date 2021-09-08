// pages/addressBook/index.js
const app = getApp();
const $api = require('../../utils/api').API

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:0,
    teacherGroup:[],
    teacher_G:'',
    teacherName:'',
    teacherBook:[],
    workerGroup:[],
    worker_G:'',
    workerName:'',
    workerBook:[],
  },

  // 切换教师/职工/tab
  onClick(e){
    if(e.detail.name == 0){
      this.setData({
        workerName:'',
      })
      this.getTeacherGroup()
      this.getTeacherBook()
    } else if (e.detail.name == 1) {
      this.setData({
        teacherName:'',
      })
      this.getWorkerGroup()
      this.getWorkerBook()
    }
  },

  getTeacherGroup(){
    app.ajax($api.app_teacherGroup,'GET').then(res=>{
      var list = [];
      for (var key in res.data) {
        list.push({
          id:key,
          name:res.data[key]
        });
      }
      list.unshift({
        id:"",
        name:"全部",
      })
      this.setData({
        teacherGroup:list
      })
    })
  },
  getTeacherBook() {
    wx.showLoading({
      title: '加载中',
    })
    let params = {
      groupId:this.data.teacher_G,
      name: this.data.teacherName
    }
    app.ajax($api.app_teacherContacts,'GET',params).then(res=>{
      wx.hideLoading();
      this.setData({
        teacherBook:res.data
      })
    })
  },
    // 拨打电话
    freeTell(e){
      let phone = e.currentTarget.dataset.phone;
      wx.makePhoneCall({
        phoneNumber: phone,
      })
  
    },
  onSearchT(e){
    this.setData({
      teacherName:e.detail
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getTeacherBook();
  },
  onChangeT(e){
    this.setData({
      teacher_G: this.data.teacherGroup[e.detail].id,
    });
    wx.showLoading({
      title: '加载中',
    })
    this.getTeacherBook()
  },
  onClearT(){
    this.setData({
      teacherName:"",
      teacherBook:[],
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getTeacherBook();
  },

  getWorkerGroup() {
    app.ajax($api.app_workerGroup,'GET').then(res=>{
      var list = [];
      for (var key in res.data) {
        list.push({
          id:key,
          name:res.data[key]
        });
      }
       list.unshift({
        id:"",
        name:"全部",
      })
      this.setData({
        workerGroup:list
      })
    })
  },
  getWorkerBook(){
    wx.showLoading({
      title: '加载中',
    })
    let params = {
      groupId:this.data.worker_G,
      name: this.data.workerName
    }
    app.ajax($api.app_contacts,'GET',params).then(res=>{
      wx.hideLoading();
      this.setData({
        workerBook:res.data
      })
    })
  },
  onSearchW(e){
    this.setData({
      workerName:e.detail
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getWorkerBook();
  },
  onChangeW(e){
    this.setData({
      worker_G: this.data.workerGroup[e.detail].id,
    });
    wx.showLoading({
      title: '加载中',
    })
    this.getWorkerBook()
  },
  onClearW(){
    this.setData({
      workerName:"",
      workerBook:[],
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getWorkerBook();
  },
  onChange(event) {
    this.setData({
      activeName: event.detail,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getTeacherGroup()
    this.getTeacherBook()
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