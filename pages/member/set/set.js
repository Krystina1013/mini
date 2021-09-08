// pages/member/set/set.js
const app = getApp();
const $api = require('../../../utils/api').API
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{},
    tempFilePaths:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUser();
  },
  getUser(){
    app.ajax($api.app_worker,'GET').then(res=>{
      wx.hideLoading()
      this.setData({
        user:res.data
      })
    })
  },
  loginOut() {
    wx.showModal({
      title: '提示',
      content: '确定退出登录吗？',
      success(res) {
        if (res.confirm) {
          // wx.clearStorage();
          wx.removeStorageSync('user')
          wx.removeStorageSync('scence')
          wx.removeStorageSync('isAbLogin')
          // app.login();
          wx.reLaunch({
            url: '/pages/home/index',
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  chooseImg(){
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths)
        let src = wx.getFileSystemManager().readFileSync(tempFilePaths[0], "base64");
        that.setData({
          tempFilePaths:src
        })
        that.upload();
      }
    })
  },
  upload(){
    wx.showLoading({
      title: '上传中',
    })
    app.ajax($api.app_worker_update,"PUT",{face:this.data.tempFilePaths}).then(res=>{
      this.getUser();
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