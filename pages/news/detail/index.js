// pages/news/detail/index.js
const app = getApp();
const $api = require('../../../utils/api').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({id:options.id})
    this.getList();
  },
 getList(){
    wx.showLoading({
      title: '加载中',
    })
    let param={
      id : this.data.id,
    }
    app.ajax($api.app_sMessageDetail,'get',param).then(res=>{
      wx.hideLoading();
      let searchData = res.data;
      // searchData.content = searchData.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto"')
      searchData.content = searchData.content.replace(/(\<img|\<p)/gi, function ($0, $1) {
        return {
          "<img": '<img style="max-width:100%;height:auto" ',
          "<p": '<p style="text-indent: 24px;" ',
          "<article":"<div",
          "</article": "</div",
          "<header": "<div",
          "</header": "</div"
        }[$1];
      });
      this.setData({
        searchData:searchData,
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