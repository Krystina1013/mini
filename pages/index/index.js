//index.js
//获取应用实例
const app = getApp();
const $api = require('../../utils/api').API
Page({
  data: {
    opts: {
      lazyLoad: true // 延迟加载组件
    },
    swiper: [],
    onStudent:0,
    studentIs2:false,
    studentDeg:0,
    mjIs2:false,
    mjDeg:0,
    sxjIs2:false,
    sxjDeg:0,
    offStudent:0,
    onSxj:0,
    offSxj:0,
    onMj:0,
    offMj:0,
    scence: {},
    unRead: 0,
    isRealVideo:"0",
    useSnapRecords:'0',
    isCheckAttendance:"0",
    useSnapRecords: true,
    isCheckAttendance:true,
    mjHidden: false,
    scenceUserId:'',
    newsData:[],
    // messageCount:'',
    hasAlarm: true
  },
  // 通知跳转
  toNews() {
    wx.switchTab({
      url: '/pages/news/notification/index?scenceUserId='+this.data.scenceUserId,
    })
  },
  //事件处理函数
  getBanner() {
    app.ajax($api.app_banner, 'GET').then(res => {
      this.setData({
        swiper: res.data
      })
    })
  },
  onLoad: function () {
    this.getBanner();
    if (!app.getCache("isAbLogin")) return
    this.setData({
      scence: app.getCache("scence")
    })
    console.log(this.data.scence)
    wx.setNavigationBarTitle({
      title: this.data.scence.name
    })
    this.getUser();
    this.initAlarm();
    this.getNewsList();
    this.initStudent();
    this.initDevice();
  },
  // 学生统计
  initStudent(){
    app.ajax($api.app_student_number, 'GET').then(data => {
      if (data.data) {
        this.setData({
          onStudent:data.data.USED || 0,
          offStudent:data.data.DISABLE || 0,         
        })
        this.setData({
          studentIs2: this.data.onStudent<=this.data.offStudent
        })
        if (this.data.offStudent === 0) {
          this.setData({
            studentDeg:180,
            studentIs2:false,
          })
        }
        if (this.data.onStudent === 0) {
          this.setData({
            studentDeg:0,
            studentIs2: true
          })
        }
        if (this.data.onStudent !== 0 && this.data.offStudent !== 0){
          let studentDeg = (this.data.onStudent/(this.data.offStudent + this.data.onStudent)) * 360;
          this.setData({
            studentDeg: parseInt(studentDeg)>180?parseInt(studentDeg)-180:parseInt(studentDeg)
          })     
        }
      }
    })
  },
  // 门禁设备统计
  initDevice() {
    app.ajax($api.app_mj_number, 'GET').then(data => {
      if (data.data) {
        this.setData({
          onMj:data.data.online || 0,
          offMj:data.data.offline || 0,
        })
        this.setData({
          mjIs2:this.data.offMj>=this.data.onMj
        })
        if (this.data.offMj === 0) {
          this.setData({
            mjDeg:180,
            mjIs2:false    
          })
        }
        if (this.data.onMj === 0) {
          this.setData({
            mjDeg:0,
            mjIs2: true
          })
        }
        if (this.data.onMj !== 0 && this.data.offMj !== 0){
          let mjDeg = parseInt((this.data.onMj/(this.data.offMj + this.data.onMj)) * 360);
          this.setData({
            mjDeg: mjDeg>180?mjDeg-180:mjDeg
          })
        }
      } else {
        this.setData({
          mjHidden: true
        })
      }
    })
    // 摄像机
    app.ajax($api.app_sxj_number, 'GET').then(data => {
      if (data.data) {
        this.setData({
          onSxj:data.data.online || 0,
          offSxj:data.data.offline || 0,
        })
        this.setData({
          sxjIs2:this.data.offSxj>=this.data.onSxj
        })
        if (this.data.offSxj === 0) {
          this.setData({
            sxjDeg:180,
            sxjIs2:false
          })
        }
        if (this.data.onSxj === 0) {
          this.setData({
            sxjDeg:0,
            sxjIs2: true
          })
        }
        if (this.data.onSxj !== 0 && this.data.offSxj !== 0){
         let sxjDeg = parseInt((this.data.onSxj/(this.data.offSxj + this.data.onSxj)) * 360);
         this.setData({
           sxjDeg: sxjDeg>180?sxjDeg-180:sxjDeg
         })
        }
      }
    })
  },
    
  // 消息统计
  // unreadMessageCount(){
  //   if(!this.data.scenceUserId) {
  //     return
  //   }
  //   let param={
  //     scenceUserId:this.data.scenceUserId
  //   }
  //   app.ajax($api.app_sMessageCount,'get',param).then(res=>{
  //     this.setData({
  //       messageCount:res.data.unreadCount,
  //     })
  //   })
  // },

  getNewsList(){
    let param = {
      page: 1,
      limit:2,
      scenceUserId: this.data.scenceUserId,
    }
    app.ajax($api.app_sPageMessage, "GET", param).then(res => {
      let newdata = res.data.records.splice(0,2);
      newdata.map((item)=>{
        item.content = item.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto"')
      })
      this.setData({
        newsData: newdata
      })
    })
  },
  getUnRead() {
    app.ajax($api.dev_device_warning_unread, "GET").then(res => {
      let count = 0;
      if (res.data > 99) {
        count = "99+"
      } else {
        count = res.data;
      }
      this.setData({
        unRead: count
      })
    })
  },

  // 预警统计
  initAlarm() {
    app.ajax($api.app_alarm_number, 'GET').then(data => {
      if (data.data && JSON.stringify(data.data) != "{}") {
        this.setData({
          hasAlarm: true
        })   
        this.initChart(data.data);
      } else {
        this.setData({
          hasAlarm: false
        })
      }
    })   
  },
  // 条形图
  initChart(alarmData) {
    const self = this;
    self.chartComponent = self.selectComponent('#bar');
    self.chartComponent.init((canvas, width, height, F2) => {
      let Global = F2.Global;
      let warnType = {
        VOICE_ALERT:'声音预警',
        MOUSE: "老鼠预警",
        AREA: "区域预警",
        CHEF_HAT:"厨师帽预警",
        CARE_MAN: "关注人员预警",
        STRANGER: "陌生人预警",
        NOT_BACK:'未归预警',
        LATE_BACK:'晚归预警',
        DEVICE_DOWN: "设备离线预警",
      };
      let data = [];
      for(let item in warnType){
        data.push({
          country: warnType[item], population: alarmData[item] || 0 })
      }
      var  chart = new F2.Chart({
        el: canvas,
        width,
        height
      });
    chart.source(data, {
      population: null
    });
    chart.coord({
      transposed: true,
    });
    chart.legend(false)
    chart.axis('country', {
      line:{
          lineDash: null,
          stroke: '#a2aab2',
          lineWidth: 1
      },
      tickLine: {
        lineWidth: 1,
        stroke: '#a2aab2',
        length: 5,// 刻度线长度
      },
      label:{
        size:'12',
        fill: '#6A7E92',
      },
      grid: null
    });
    
    chart.axis('population', {
      line: {
        lineDash: null,
        stroke: '#a2aab2',
        lineWidth: 1
    },
    tickLine: {
      lineWidth: 1,
      stroke: '#a2aab2',
      length: 5,// 刻度线长度
    },
    label:{
      lineWidth: 1,
      fill: '#6A7E92',
    },
      grid: null,
      label: function label(text, index, total) {
        var textCfg = {};
        if (index === 0) {
          textCfg.textAlign = 'left';
        } else if (index === total - 1) {
          textCfg.textAlign = 'right';
        }
        return textCfg;
      }
    });
    chart.tooltip({
      showItemMarker: true,
      color:'#666',
      background: {
        radius: 2,
        fill: '#efefef',
        padding: [3, 5]
      },
      nameStyle: {
        fontSize: 12,
        fill: '#666',
      }, // toolt
      valueStyle: {
        fontSize: 14,
        fill: '#666',
      },
      tooltipMarkerStyle: {
        fill: '#666',
        fillOpacity: 0.1
      },
      onShow: function onShow(ev) {
        var items = ev.items;
      }
    });
    data.map(function(obj) {
      chart.guide().text({
        position: [obj.country, obj.population],
        content: obj.population,
        style: {
          textAlign: 'left',
          fill:'#333',
          textBaseline: 'middle'
        },
        offsetX: 2
      });
    });
    chart.interval().size(20).position('country*population').color('country', ['#66b1ff']).adjust('stack');
    chart.render();
    return chart;
  })
  },

   // 是否登录
   handleLogin(e) {
    if (!app.getCache("isAbLogin")) {
      wx.showModal({
        title: '提示',
        content: '请先登录！',
        success(res) {
          if (res.confirm) {
            // wx.clearStorage();
            // app.login();
            wx.removeStorageSync('user')
            wx.removeStorageSync('scence')
            wx.removeStorageSync('isAbLogin')
            wx.reLaunch({
              url: '/pages/home/index',
            })
          } else if (res.cancel) {
          
          }
        }
      })
      return
    }
    let id = Number(e.target.dataset.id);
    switch (id) {
      case 1:
        wx.navigateTo({
          url: '/pages/attention/index/index',
        })
        break;
      case 2:
        wx.navigateTo({
          url: '/pages/capture/index/index',
        })
        break;
      case 3:
        wx.navigateTo({
          url: '/pages/alarm/index/index',
        })
        break;
      case 4:
        wx.navigateTo({
          url: '/pages/faceSearch/index/index',
        })
        break;
      case 5:
        wx.navigateTo({
          url: '/pages/realTimeMonito/list/index',
        })
        break;
       case 6:
          wx.navigateTo({
            url: '/pages/dataInfo/index',
          })
          break;
        case 7:
          wx.navigateTo({
            url: '/pages/checkIn/workerCheck/index',
          })
        break;
        case 8:
          wx.navigateTo({
            url: '/pages/news/notification/index?scenceUserId='+this.data.scenceUserId,
          })
        break;
        case 9:
          wx.navigateTo({
            url: '/pages/addressBook/index?scenceUserId='+this.data.scenceUserId,
          })
        break;

      default:
        break;
    }
  },
  getUser() {
    app.ajax($api.app_worker, "GET").then(res => {
		// 判断是否能看到实时视频
      this.setData({
        isRealVideo: res.data.isRealVideo,
        useSnapRecords:res.data.useSnapRecords,
        isCheckAttendance:res.data.isCheckAttendance,
      })
      this.setData({
        scenceUserId:res.data.scenceUserId
      })
      wx.setStorageSync("scenceUserId",res.data.scenceUserId);
      // this.unreadMessageCount()
    })
  },
  getScence() {
    app.ajax($api.worker_scences, "GET").then(scence => {
      wx.setStorageSync('scence', scence.data[0])
      app.globalData.header.scenceId = scence.data[0].id;
    })
  },

  onShow: function () {
    this.getUser();
    this.initAlarm();
    this.getNewsList();
    this.initStudent();
    this.initDevice();
    this.getUnRead();
    // this.unreadMessageCount();
  },
  
   /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
    onPullDownRefresh: function () {
      wx.stopPullDownRefresh();
      this.getUser();
      this.initAlarm();
      this.getNewsList();
      this.initStudent();
      this.initDevice();
      this.getUnRead();
      // this.unreadMessageCount();
    },

    // 跳转网页  
    toDetail(e) {
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/news/detail/index?id=' + id,
      })
    },
})