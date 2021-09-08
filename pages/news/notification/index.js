// pages/news/notification/index.js
const app = getApp();
const $api = require('../../../utils/api').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listTotal: 0,
    page: 1,
    limit: 20,
    dataList: [],
    pageadd: true,
    isOnload:false,
    loading: true,
    scenceUserId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      scenceUserId: options.scenceUserId
    })
    this.getList(1)
  },
  getList(type) {
    let param = {
      page: this.data.page,
      limit: this.data.limit,
      scenceUserId: wx.getStorageSync("scenceUserId")
    }
    let old = this.data.dataList;
    app.ajax($api.app_sPageMessage, "GET", param).then(res => {
      if(type = 1) {
        this.setData({
          isOnload: true
        })
      }
      let newdata = res.data.records;
      let newpage = this.data.page;
      if (res.data.records.length) {
        if (this.data.pageadd) { //如果上拉就增加页面
          newpage++;
        }
        old = old.concat(newdata);
      } else {
        this.setData({
          pageadd: false
        })
      }
      this.setData({
        dataList: [...old],
        page: newpage,
        listTotal: res.data.total,
        loading: false
      })
    })
  },
  // 跳转网页  
  toDetail(e) {
    let index = e.currentTarget.dataset.id;
    let data = this.data.dataList[index];
    this.data.dataList[index].isRead="1";
        this.setData({
          dataList:this.data.dataList
        })
    wx.navigateTo({
      url: '/pages/news/detail/index?id=' + data.id,
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
    this.setData({
      listTotal: 0,
      page: 1,
      limit: 20,
      dataList: [],
      pageadd: true,
      isOnload: false,
      loading: true,
      scenceUserId: wx.getStorageSync("scenceUserId")
    })
    this.getList(1)
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
    wx.stopPullDownRefresh();
    this.setData({
      page: 1,
      pageadd: true,
      dataList: [],
      loading: true
    })
    wx.stopPullDownRefresh();
    this.getList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.pageadd) {
      this.getList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})