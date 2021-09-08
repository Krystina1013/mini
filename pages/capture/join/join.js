const app = getApp();
const $api = require('../../../utils/api').API
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    remark: "",
    faceUrl: "",
    showGroup: false,   
    columns:[],
    groupData:[],
    groupId:"",//选择分组id
    groupName:"请选择分组",//选择分组名字
  },
  openAction() {
    this.setData({
      showGroup: true
    });
  },
  onClose() {
    this.setData({
      showGroup: false
    });
  },
  onSelect(e) {
    console.log(e)
  },
  // 选择的分组
  confirm(e){
    let index = e.detail.index;
    console.log(e)
    this.setData({
      groupId:this.data.groupData[index].id,
      groupName: e.detail.value,
      showGroup:false
    })
  },
  onChangeName(e){
    this.setData({
      name:e.detail
    })
  },
  onChangeRemark(e){
    this.setData({
      remark:e.detail
    })
  },
  //确认添加到关注人员
  submit(){
    if(this.data.name==""){
      wx.showToast({
        title: '请输入姓名',
        icon:"none"
      })
      return;
    }
    if(this.data.groupId==""){
      wx.showToast({
        title: '请选择分组',
        icon:"none"
      })
      return;
    }

    let param = {
      id:this.data.groupId,
      alertFaceBodies:[
        {
          faceUrl:this.data.faceUrl,
          name:this.data.name,
          remark:this.data.remark
        }
      ]
    }
    console.log(param)
    wx.showLoading({
      title:"提交中"
    })
    app.ajax($api.csia_alertPhoto_byFaceUrl,"POST",param).then(res=>{
      wx.hideLoading()
      console.log(res.data)
      wx.showToast({
        title: '添加成功！',
        icon:"none"
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        })
      }, 1000);
    })
  },
  onChange(){},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = app.getCache("cap");
    this.setData({
      faceUrl:data.faceInfo.faceUrl
    })
    this.getGroup();
  },
  getGroup(){
    app.ajax($api.csia_alertTask,"GET",{page:1,pageSize:999}).then(res=>{
      let data = res.data.records;
      data.map(item=>{
        this.data.columns.push(item.name)
      })
      this.setData({
        groupData:data,
        columns:this.data.columns
      })
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