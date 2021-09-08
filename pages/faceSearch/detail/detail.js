const app = getApp();
const $api = require('../../../utils/api').API
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = app.getCache("facesearch")
    let data1 = [];
    data.map((item)=>{
      if (item !== null) {
        switch (item.scenceUserType) {
          case 'care_user':
            item.scenceUserType = '关注人员'
          break;
          case 'worker':
            item.scenceUserType = '职工'
          break;
          case 'teacher':
            item.scenceUserType = '老师'
          break;
          case 'student':
            item.scenceUserType = '学生'
          break;
          case 'personsOther':
            item.scenceUserType = '其他人员'
          break;
        }
        data1.push(item)
      }
     
    })
    
    this.setData({
      detail: data1
    })
    // if(data.scenceUserType == 'care_user'){
    //   data.scenceUserType = ''
    // }else if(data.workerGroupName){
    //   wx.setNavigationBarTitle({
    //     title: '人员信息-职工',
    //   })
    // }else if(!data.studentNo&&!data.workerGroupName){
    //   wx.setNavigationBarTitle({
    //     title: '人员信息-教师',
    //   })
    // } else if(data.scenceUserType === '家长') {
    //   wx.setNavigationBarTitle({
    //     title: '人员信息-家长',
    //   })
    // }
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
    wx.removeStorageSync('facesearch')
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