const app = getApp();
const $api = require('../../../utils/api').API
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{},
    showBig: false,
    id:"",
    warnType:{
      DEVICE_DOWN: "设备离线预警",
      STRANGER: "陌生人预警",
      CARE_MAN: "关注人员预警",
      AREA: "区域预警",
      CHEF_HAT:"厨师帽预警",
      // CHEF_CLOTHE:"厨师服预警",
      // FACE_MAS: "厨师口罩预警",
      MOUSE: "老鼠预警",
      VOICE_ALERT:'声音预警'
    }
  },
  feedback(){
    wx.navigateTo({
      url: '/pages/alarm/feedback/feedback?id='+this.data.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    
  },
  //音频播放
  voiceClick() {
    let audioCtx = wx.createAudioContext('audioUrl');
    audioCtx.play()
  },
  getDetail(){
    app.ajax($api.dev_device_warning_detail,"GET",{id:this.data.id}).then(res=>{
      console.log(res.data)
      res.data.warnTime = res.data.warnTime.split(".")[0]
      this.setData({
        detail:res.data
      })
      wx.setStorageSync('alarm', res.data)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 放大图片
   **/
  bigImg(event){
    var $this = this;
    this.setData({
      showBig: true
    })
    var imgUrl = event.currentTarget.dataset.imgurl;
    console.log(event.currentTarget.dataset.imgurl)
    wx.previewImage({
      current: imgUrl, // 当前显示图片的http链接
      urls: [imgUrl] // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.showBig) {
      this.setData({
        showBig: false
      })
      return
    }
    this.getDetail();
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