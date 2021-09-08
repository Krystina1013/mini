const app = getApp();
const $api = require('../../../utils/api').API;
import {
  getTimeByTimeStamp
} from "../../../utils/util";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.getCache("cap"))
    let data = app.getCache("cap");
    console.log(data);
    data.timestamp = data.time;
    data.time = getTimeByTimeStamp(data.time);
    
    this.setData({
      detail: data
    })
  },
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
  playVideo() {
    let param = {
      id: this.data.detail.cameraId,
      timestamp:this.data.detail.timestamp
    }
    app.ajax($api.csia_camera_playBackTime, "GET", param).then(res => {
      console.log(res.data)
      if(!res.data||!res.data.length){
        wx.showToast({
          title: '暂无视频',
          icon:"none"
        })
      }else{
        let url = res.data[0].m3u8Url;
        wx.setStorageSync('url', url)
        wx.navigateTo({
          url: '/pages/capture/video/video',
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
    wx.removeStorageSync('cap')
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