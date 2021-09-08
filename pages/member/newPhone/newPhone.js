// pages/member/newPhone/newPhone.js
const app = getApp();
const $api = require('../../../utils/api').API
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:"",
    oldPhone:""
  },
  bindPhone(e){
    this.setData({
      phone:e.detail.value
    })
  },
  next(){
    if(this.data.phone==""){
      wx.showToast({
        title: '请填写新的手机号',
        icon: 'none'
      })
      return;
    }
    if(!(/^1[3456789][0-9]{9}$/.test(this.data.phone))){ 
      wx.showToast({
        title: '手机号码不正确，请重新输入！',
        icon: 'none'
      })
      return; 
    } 
    wx.navigateTo({
      url: '/pages/member/updatePhone/updatePhone?phone='+this.data.phone,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let phone = app.getCache("user").phone.split("");
    phone.splice(3,4,"****");
    this.setData({
      oldPhone:phone.join("")
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