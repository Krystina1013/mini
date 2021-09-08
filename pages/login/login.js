// pages/login/phone/index.js
let timer = null;
const app = getApp();
const $api = require('../../utils/api').API
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countDown: 60,
    buttonText: '获取验证码',
    isDiabled: true,
    isArgee: false,
    phone: '',
    authCode: '',
    showLogin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let phone = options.phone;
    let authCode = options.authCode;
    let that = this;
    if(phone != null && authCode != null && phone != undefined && authCode != undefined){
      this.setData({
        showLogin: false
      })
      that.data.phone = phone;
      that.data.authCode = authCode;
      that.login();
    }else {
      this.setData({
        showLogin: true
      })
    }

  },
  // 发送验证码
  sendCode() {
    wx.showLoading()
    let that = this;
    if(!/^1[3456789][0-9]{9}$/.test(this.data.phone)) {
      wx.showToast({
            title: '手机号码不正确,请重新输入！',
            icon: 'none'
          })
          return;
    }
    this.setData({
      isDiabled: true
    });
    app.ajax($api.open_sendAuthCode_sms, 'GET', {
      phone: this.data.phone
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
              buttonText: '获取验证码',
              isDiabled: false,
              countDown: 60,
            })
            clearInterval(timer)
          }
        }, 1000)
      }
    })
  },
  // 同意协议
  chooseArgee() {
    this.setData({
      isArgee: !this.data.isArgee
    })
  },
  bindKeyInput(e) {
    if (e.detail.value.length == 11) {
      this.setData({
        isDiabled: false
      })
    } else {
      this.setData({
        isDiabled: true
      })
    }
    this.setData({
      phone: e.detail.value
    })
  },
  bindKeyCode(e) {
    this.setData({
      authCode: e.detail.value
    })
  },
  // 登录
  login() {
    // if (!this.data.isArgee) {
    //   wx.showToast({
    //     title: '请先同意《一石酷码通服务条款》及《使用协议》',
    //     icon: 'none'
    //   })
    //   return
    // }
    let param = {
      phone: this.data.phone,
      authCode: this.data.authCode,
    }
    wx.showLoading();

    app.ajax($api.open_login_sms, "POST", param).then(res => {

      this.getScence(res.data)
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
  // 微信登录
  wechatLogin(e) {
    let that = this;
    wx.checkSession({
      success: (res) => {
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
      },
      fail:(err) => {
        wx.login({
          success(res) {
            app.ajax($api.wx_open_login(app.globalData.appId), "GET", {
              code: res.code
            }).then(res => {
              wx.setStorageSync('login', res.data)
              let code = res.data;
              if (e.detail.errMsg && e.detail.errMsg === 'getPhoneNumber:fail user deny') {
                // wx.showToast({
                //   title: '',
                //   icon: 'none'
                // })
                return;
              }
              let param = {
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
            })
          }
        })
      }
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
//     setInterval(function() {    downTime = new Date('2018/12/05 17:13:00').getTime() - new Date().getTime()
// })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // clearInterval(timer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(timer)
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