// pages/realTimeMonito/list/index.js
const app = getApp();
const $api = require('../../../utils/api').API
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    searchData:[],
    showMore:false,
    page:1,
    pageSize:30,
    pageadd:true,
    groupId:''
  },
  getGroup(){
    wx.showLoading({
      title: '加载中',
      icon:"none"
    })
    app.ajax($api.csia_camera_group,"GET",{page:1,pageSize:999}).then(res=>{
      let data = res.data;
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
      // this.getListData();
    })
  },
  // 切换分组
  onChange(val){
    let index = val.detail;
    this.setData({
      groupId:this.data.groupData[index].id,
      page:1,
      personList:[],
      pageadd:false,
      activeKey:index
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getList();
  },
  getList(){
    wx.showLoading({
      title: '加载中',
    })
    let old = this.data.searchData;
    let param={
      page:this.data.page,
      pageSize:this.data.pageSize,
      name:this.data.name,
      groupId: this.data.groupId
    }
    app.ajax($api.csia_camera_page,'POST',param).then(res=>{
      wx.hideLoading();
      let newdata = res.data;
      // let newpage = this.data.page;
      // if(res.data.records.length){
      //   if (this.data.pageadd) { //如果上拉就增加页面
      //     newpage++;
      //   }
      //   old = old.concat(newdata);
      // } else {
      //   this.setData({
      //     showMore: true
      //   })
      // }
      this.setData({
        searchData:newdata,
        // page:newpage
      })
    })
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
      // page:1,
      searchData:[],
      // pageadd:false
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getList();
  },
   // 清空
   onClear(){
    this.setData({
      name:"",
      // page:1,
      searchData:[],
      // pageadd:false
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getList();
  },
  toDetail(e){

    if (e.target.dataset.status !== 'on') {
      wx.showToast({
        title: '摄像头无法播放！',
        icon: "none"
      })
      return;
    }
    let id = e.target.id;
    let name = e.target.dataset.name;
    wx.navigateTo({
      url: '/pages/realTimeMonito/detail/index?id=' + id + "&name=" + name,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
    this.getGroup()
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
    // this.setData({
    //   pageadd: true
    // })
    this.getList();
  //  下拉之后，不回弹，原因是一直没停止下拉，可以使用停止下拉效果的api
    wx.stopPullDownRefresh();
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