const app = getApp();
const $api = require('../../../utils/api').API;
import {addMinutes,format} from "date-fns";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    words:"",
    time:"",//暂停告警时长
    uploadList:[],
    alarm:{},
    id:""
  },
  chooseImg(){
    let that = this;
    let counts = 6 - this.data.uploadList.length;
    wx.chooseImage({
      count: counts,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        if(that.data.uploadList.length<6){
          that.data.uploadList=[...that.data.uploadList,...tempFilePaths]
        }
        that.setData({
          uploadList:that.data.uploadList
        })
      }
    })
  },
  delImg(e){
    let index = e.target.id;
    this.data.uploadList.splice(index,1);
    this.setData({
      uploadList:this.data.uploadList
    })
  },
  bindInputNumber(e){
    this.setData({
      time:e.detail.value
    })
  },
  // 提交反馈
  submit(){
    
    if(!this.data.words.length){
      wx.showToast({
        title: '请填写反馈内容',
        icon:"none"
      })
      return;
    }
    wx.showLoading({
      title: '提交中',
      mask:true
    })
    let header = {
        scenceId:app.globalData.header.scenceId,
        token:app.globalData.header.token,
        // "Content-Type": "multipart/form-data",
    }
    let imgs=[];
    let that = this;
    if(!this.data.uploadList.length){
      that.addFeedBack([]);
      return
    }
    Promise.all(
      this.data.uploadList.map(img=>{
        console.log(img)
        wx.uploadFile({
          filePath: img,
          name: 'file',
          header,
          url: $api.feed_back_upFile,
          success(res){
            let data = JSON.parse(res.data);
            imgs.push(data.data)
            
            if(imgs.length==that.data.uploadList.length){
              that.addFeedBack(imgs);
            }
          }
        })
      })
    )
  },
  // 选择时间
  selectTime(e) {
    let time = e.target.dataset.id;
    this.setData({
      time: time
    })
    console.log(this.data.time)
  },
  //确定提交反馈
  addFeedBack(imgs){
    //warnSignId
    let alarm = this.data.id;
    let param = {
      id:this.data.id,
      images:imgs,
      remark:this.data.words
    }
    
    app.ajax($api.dev_device_warning_process,'PUT',param).then(res=>{
      let stopStillTime = format(addMinutes(new Date(),this.data.time),'yyyy-MM-dd HH:mm:ss');
      wx.hideLoading();
      wx.showToast({
        title: '提交成功',
        icon:"none"
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        })
      }, 1000);
      let data = {
        warnSignId:this.data.alarm.warnSignId,
        stopStillTime
      }
      console.log(data)
      if(this.data.alarm.warnType!=='CARE_MAN') return;
      app.ajax($api.dev_device_warning_stop,'POST',data).then(res=>{
        console.log(res.data)
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      alarm:app.getCache("alarm"),
      id:options.id
    })
  },
  bindTextArea(e){
    this.setData({
      words:e.detail.value
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
    wx.removeStorageSync('alarm')
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