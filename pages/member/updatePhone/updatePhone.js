// pages/member/updatePhone/updatePhone.js
const app = getApp();
const $api = require('../../../utils/api').API
let timer = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countDown: 60,
    buttonText: '发送验证码',
    isDiabled: false,
    phone:"",
    verifyCode:"",
    oldPhone:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let old = options.phone;
    let phone = options.phone.split("");
    phone.splice(3,4,"****");
    this.setData({
      phone:phone.join(""),
      oldPhone:old
    })
  },
  // 发送验证码
  sendCode() {
    wx.showLoading()
    let that = this;
    this.setData({
      isDiabled: true
    });
    app.ajax($api.open_sendAuthCode_sms, 'GET', {
      phone: this.data.oldPhone
    }).then(res => {
      wx.hideLoading()
      
      if (this.data.isDiabled) {
        timer = setInterval(() => {
          if (that.data.countDown > 0) {
            that.setData({
              buttonText: that.data.countDown -= 1
            })
          } else {
            that.setData({
              buttonText: '发送验证码',
              isDiabled: false,
              countDown: 60,
            })
            clearInterval(timer)
          }
        }, 1000)
      }
    })
  },
  onChange(event) {
    this.setData({
      verifyCode:event.detail
    })
  },
  update(){
    let param ={
      phone:this.data.oldPhone,
      verifyCode:this.data.verifyCode
    }
    wx.showLoading({
      title: '提交中',
    })
    app.ajax($api.app_worker_update,'PUT',param).then(res=>{
      wx.hideLoading()
      wx.showToast({
        title: '修改成功！请重新登录',
        icon:"none"
      })
      setTimeout(() => {
        // wx.clearStorageSync()
        // app.login();
        wx.removeStorageSync('user')
        wx.removeStorageSync('scence')
        wx.removeStorageSync('isAbLogin')
        wx.reLaunch({
          url: '/pages/home/index',
        })
      }, 1000);
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