 //app.js
 const $api = require('./utils/api').API
 App({
   onLaunch: function () {
     if (this.getCache("isAbLogin")) return
     this.login();
   },
   login() {
     let that = this;
     wx.login({
       success(res) {
         that.ajax($api.wx_open_login(that.globalData.appId), "GET", {
           code: res.code
         }).then(res => {
           wx.setStorageSync('login', res.data)
         })
       }
     })
   },
   globalData: {
     header: {
       'content-type': 'application/json',
       'scenceId': '',
       token: ""
     },
     appId: 'wxe38af15aedadd7d0'
   },
   // 获取缓存
   getCache: function (key) {
     try {
       var value = wx.getStorageSync(key);
       if (value) {
         return value;
       } else {
         wx.getStorage({
           key: key,
           success: function (res) {
             value = res.data;
             return value;
           }
         })
       }
     } catch (e) {
       return null;
     }
   },
   ajax: function (url = '', methods = 'GET', data = {}, isAbLogin) {
     let that = this;
     if (this.getCache('user')) {
       this.globalData.header.token = this.getCache('user').token || ''
     } else {
       this.globalData.header.token = ''
     }

     if (this.getCache('scence')) {
       this.globalData.header.scenceId = this.getCache('scence').id || ''
     } else {
       this.globalData.header.scenceId = ''
     }
     return new Promise(function (resolve, reject) {
       wx.request({
         url: url,
         data,
         method: methods,
         header: that.globalData.header,
         success(res) {
           let code = res.data.code;
           if (code == 401) {
             wx.showToast({
               title: "登录失效请重新登录",
               icon: 'none'
             })
             setTimeout(() => {
               wx.reLaunch({
                 url: '/pages/home/index',
               })
             }, 1000)
             reject(res)
           } else if (code == 200) {
             resolve(res.data)
           } else {
             wx.hideLoading()
             wx.showToast({
               title: res.data.message || '网络错误',
               icon: 'none'
             })
             if (code == 403) {
              setTimeout(() => {
                wx.reLaunch({
                  url: '/pages/home/index',
                })
              }, 1000)
             }
             reject(res)
           }
         },
         fail(err) {
           wx.hideLoading()
           if (err.errMsg.indexOf("request:fail") != -1) {
             wx.showToast({
               title: "网络异常",
               icon: 'none'
             })
             return
           }
           wx.showToast({
             title: err.errMsg,
             icon: 'none'
           })
           reject(err)
         }
       })
     })
   },
 })