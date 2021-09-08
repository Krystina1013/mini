// pages/capture/searchList/searchList.js
const app = getApp();
const $api = require('../../../utils/api').API
import {
  format,
  subDays
} from "date-fns";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchData: [],
    src: "",
    isClick: false,
    page: 1,
    pageSize: 30,
    pageadd: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let src = wx.getFileSystemManager().readFileSync(options.face, "base64");
    this.setData({
      src
    });
    this.getCapture();
  },
  // 获取抓拍记录
  getCapture() {
    let endTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    let startTime = format(subDays(new Date(), 7), 'yyyy-MM-dd HH:mm:ss');
    let param = {
      startTime,
      endTime,
      pic: this.data.src,
      score: 80
    }
    wx.showLoading({
      title: '加载中',
    })
    app.ajax($api.csia_unknownFaceSearch, 'POST', param).then(res => {
      wx.hideLoading();
      this.setData({
        searchData: [...res.data],
      })
    })
  },
  toDetail(e) {
    if (this.data.isClick){
      return;
    }
    this.setData({
      isClick: true
    })
    let index = e.target.id;
    console.log(this.data.searchData[index])
    wx.setStorageSync('cap', this.data.searchData[index]);
    setTimeout(() => {
      this.setData({
        isClick: false
      })
    }, 100)
    wx.navigateTo({
      url: '/pages/capture/detail/detail',
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
      searchData: [],
    })
    wx.stopPullDownRefresh();
    this.getCapture();
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