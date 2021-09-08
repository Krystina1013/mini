// pages/capture/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths:"",
    btnClick: false
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
        that.setData({
          tempFilePaths
        })
      }
    })
  },
  search(){
    if(this.data.tempFilePaths==""){
      wx.showToast({
        title: '请选择一张图片',
        icon:"none"
      })
      return;
    }
    this.setData({
      btnClick: true
    })
    
    wx.navigateTo({
      url: '/pages/capture/searchList/searchList?face='+this.data.tempFilePaths,
    })
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
      this.setData({
        btnClick: false
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