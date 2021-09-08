// pages/realTimeMonito/detail/index.js
const app = getApp();
const $api = require('../../../utils/api').API
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    videoUrl:"",
    videoContext:null,
    setInter: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id =options.id;
    this.setData({
      name: options.name,
    })
    this.getDataList(id)
  },
  // 获取数据
  getDataList(id){
    wx.showLoading({
      title: '加载中',
    })
    app.ajax($api.csia_camera_play,'GET',{id:id}).then(res=>{
      wx.hideLoading();
      this.setData({
        videoUrl: res.data.hlsUrl,
      })
      this.setInter = null;
      this.setInter = setInterval(() => {
        wx.createVideoContext('myVideo').play();
      }, 60*1000);
    })
  },
  timeUpdate(detail) {
    console.log(detail)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // if(this.videoContext) {
    //   this.videoContext.play();
    // }
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // this.videoContext.stop();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      videoUrl: null,
    })
    this.setInter = null;
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