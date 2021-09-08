const app = getApp();
const $api = require('../../../utils/api').API
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData:[],
    src:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let src = wx.getFileSystemManager().readFileSync(options.src, "base64");
    this.setData({src})
    this.getFace()
  },
  getFace(){
    wx.showLoading({
      title: '加载中',
    })
    app.ajax($api.app_scenceUser_face,"POST",{base: this.data.src}).then(res=>{
      wx.hideLoading()
      console.log(res.data)
      this.setData({
        listData:res.data
      })
    })
  },
  toDetail(e){
    let index = e.target.id;
    wx.setStorageSync('face', this.data.listData[index]);
    wx.navigateTo({
      url: '/pages/faceSearch/detail/detail',
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