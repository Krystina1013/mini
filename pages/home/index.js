// pages/home/index.js
const app = getApp();
const $api = require('../../utils/api').API
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',

  },
 // 微信登录
 wechatLogin(e) {
  let that = this;
  // wx.checkSession({
  //   success: (res) => {
      let code = wx.getStorageSync('login');
      if (e.detail.errMsg && (e.detail.errMsg == "getPhoneNumber:fail:user deny" || e.detail.errMsg ==  "getPhoneNumber:fail user deny")) {
        // wx.showToast({
        //   title: '',
        //   icon: 'none'
        // })
        return;
      }
      let param = {
        openId:code.openId,
        unionId:code.unionId,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        sessionKey: code.sessionKey
      }
      wx.showLoading({
        title: '登录中',
      })
      app.ajax($api.wx_open_login_phone(app.globalData.appId), "GET", param).then(res => {
        console.log(res.data)
        that.setData({
          phone: res.data.phone
        });
        that.getScence(res.data);
      })
  //   },
  //   fail:(err) => {
      // wx.login({
      //   success(res) {
      //     app.ajax($api.wx_open_login(app.globalData.appId), "GET", {
      //       code: res.code
      //     }).then(res => {
      //       wx.setStorageSync('login', res.data)
      //       let code = res.data;
      //       if (e.detail.errMsg && e.detail.errMsg === 'getPhoneNumber:fail user deny') {
      //         // wx.showToast({
      //         //   title: '',
      //         //   icon: 'none'
      //         // })
      //         return;
      //       }
      //       let param = {
      //         openId:code.openId,
      //         unionId:code.unionId,
      //         encryptedData: e.detail.encryptedData,
      //         iv: e.detail.iv,
      //         sessionKey: code.sessionKey
      //       }
      //       wx.showLoading({
      //         title: '登录中',
      //       })
      //       app.ajax($api.wx_open_login_phone(app.globalData.appId), "GET", param).then(res => {
      //         console.log(res.data)
      //         that.setData({
      //           phone: res.data.phone
      //         });
      //         that.getScence(res.data);
      //       })
      //     })
        
    // }
  // })
      
},
// 去账号登录页面
toLogin(){
  wx.navigateTo({
    url: '/pages/login/login',
  })
},
getScence(data) {
  console.log('login',data)
  wx.setStorageSync("isAbLogin",1);
  wx.setStorageSync("user",data);
  app.ajax($api.worker_scences, 'GET').then(scence => {
    wx.hideLoading();
    if (!scence.data.length) {
      wx.showToast({
        title: '你的手机号没有关联学校，请学校管理员处理。',
        icon: "none"
      })
      return
    }
    wx.setStorageSync('scence', scence.data[0]);
    
    wx.showToast({
      title: '登录成功',
      icon: 'none'
    })
    wx.switchTab({
      url: '/pages/index/index',
    })

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
    app.login();
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