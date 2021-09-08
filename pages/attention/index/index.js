// pages/attention/attention.js
const app = getApp();
const $api = require('../../../utils/api').API
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue:"",
    activeKey:0,
    groupData:[],
    personList:[],
    currentGroupId:"",
    name:"",
    page: 1,
    pageSize: 30,
    pageadd: true,
  },
  changeInput(e){
    if(e.detail==""){
      this.onSearch({detail:""});
    }
  },
  // 搜索
  onSearch(val){
    this.setData({
      name:val.detail,
      page:1,
      personList:[],
      pageadd:false
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getListData();
  },
  toDetail(e){
    let index = e.target.id;
    let info = this.data.personList[index];
    let group = this.data.groupData[this.data.activeKey].name;
    let param = {
      info,group
    }
    wx.setStorageSync('info',param)
    wx.navigateTo({
      url: `/pages/attention/detail/detail`,
    })
  },
  // 清空
  onClear(){
    this.setData({
      name:"",
      page:1,
      personList:[],
      pageadd:false
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getListData();
  },
  // 切换分组
  onChange(val){
    let index = val.detail;
    this.setData({
      currentGroupId:this.data.groupData[index].id,
      page:1,
      personList:[],
      pageadd:false,
      activeKey:index
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getListData();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    this.getGroup();
  },
  getGroup(){
    wx.showLoading({
      title: '加载中',
      icon:"none"
    })
    app.ajax($api.csia_alertTask,"GET",{page:1,pageSize:999}).then(res=>{
      let data = res.data.records;
      data.map(item=>{
        item.hideName = item.name.length>5?item.name.substring(0,5)+"...":item.name;
      })
      data.unshift({
        id:"",
        name:"全部",
        hideName:"全部"
      })
      this.setData({
        groupData:data,
        currentGroupId:data.length?data[0].id:""
      })
      this.getListData();
    })
  },

  getListData(){
    let param = {
      name:this.data.name,
      page:this.data.page,
      pageSize:this.data.pageSize,
      alertTaskId:this.data.currentGroupId
    }
    let old = this.data.personList;
    wx.showLoading({
      title: '加载中',
    })
    app.ajax($api.csia_alertPhoto_page,"POST",param).then(res=>{
      wx.hideLoading()
      let newdata = res.data.records;
      let newpage = this.data.page;
      if(res.data.records.length){
        if (this.data.pageadd) { //如果上拉就增加页面
          newpage++;
        }
        old = old.concat(newdata);
      }
      this.setData({
        personList:[...old],
        page:newpage
      })
    }).catch(err=>{
      wx.hideLoading()
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
    this.setData({
      page: 1,
      pageadd: false,
      personList: [],
    })
    this.getGroup();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(12)
    this.setData({
      pageadd: true
    })
    this.getListData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})