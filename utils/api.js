// const v3 = 'https://backend.lenfocus.com/user';
// const v2 = 'https://backend.lenfocus.com/dev';
// const v9 = 'https://backend.lenfocus.com/ktwelve';
const v3 = 'http://139.196.14.225:8083/user';
const v2 = 'http://139.196.14.225:8082/dev';
const v9 = 'http://139.196.14.225:8089/ktwelve';
// const v9 = 'http://192.168.3.9:8089/ktwelve';
// const v3 = 'http://192.168.8.224:8083/user';
// const v2 = 'http://192.168.3.57:8082/dev';
// const v9 = 'http://192.168.8.224:8089/ktwelve';

// const v2 = 'http://192.168.3.241:8082/dev';
// const v3 = 'http://192.168.3.241:8083/user';
// const v9 = 'http://192.168.3.44:8089/ktwelve';
const API = {
  worker_scences:`${v9}/app/hs-scence/worker/scences`,//场景
  open_sendAuthCode_sms:`${v3}/app/open/send-auth-code/sms`,//发送验证码
  open_login_sms:`${v3}/app/open/wx/login/sms`,//短信登录
  scence_user_link:`${v3}/app/scence-user-link`,//用户场景
  open_banner:`${v3}/app/open/banner`,//轮播图
  csia_alertTask:`${v2}/app/csia/alertTask`,//重点人员库
  csia_alertPhoto_page:`${v2}/app/csia/alertPhoto/page`,//重点人员列表
  csia_unknownFaceTimeSearch:`${v9}/app/csia/face/unknownFaceTimeSearch`,//抓拍记录
  csia_unknownFaceSearch:`${v9}/app/csia/face/unknownFaceSearch`,//抓拍记录-按图
  csia_alertPhoto_byFaceUrl:`${v2}/app/csia/alertPhoto/alertPhoto/byFaceUrl`,//抓拍记录-加入关注人
  csia_camera_playBackTime:`${v2}/app/csia/camera/playBackTime`,//抓拍记录-查看视频
  csia_camera_page:`${v2}/app/csia/camera/out/page`, // 分页查询摄像头
  csia_camera_group:`${v9}/app/csia/camera/tree`, // 摄像头分组信息
  
  csia_camera_play:`${v9}/app/csia/camera/play`, // 查看视频

  dev_device_warning:`${v2}/app/dev-device-warning/page/worker`,//告警
  dev_device_read:`${v2}/app/dev-device-warning/read`,//告警已读
  dev_device_warning_unread:`${v2}/app/dev-device-warning/count/warning/unread/worker`,//告警-未读消息数
  dev_device_warning_process:`${v2}/app/dev-device-warning/process`,//告警-处理
  dev_device_warning_detail:`${v2}/app/dev-device-warning/warn/byId`,//告警-详情
  dev_device_warning_stop:`${v2}/app/dev-device-warning/stop/warn`,//告警-处理告警时长
  feed_back_upFile:`${v3}/app/feed-back/upFile`,//上传图片
  app_worker:`${v9}/app/worker`,//用户信息
  app_banner:`${v9}/app/open/banner/worker`,//banner
  app_scenceUser_face:`${v9}/app/scence-user/faces`,//以图找人
  app_worker_update:`${v9}/app/worker`,//修改用户
  dev_warning_count:`${v2}/app/dev-device-warning/warn/count`,//预警处理次数
  dev_warning_allRead:`${v2}/app/dev-device-warning/all/read/worker`,//预警-全部已读
  app_student_number:`${v9}/app/weixin/student/statusCount`,//学生统计数据
  app_mj_number:`${v2}/app/dev-device-info/statusCount`,//门禁设备统计数据
  app_sxj_number:`${v2}/app/csia/camera/statusCount`,//摄像头设备统计数据
  app_alarm_number:`${v2}/app/dev-device-warning/warnCountToday`,//预警统计数据
  app_sMessageCount:`${v9}/app/worker/sMessageCount`, //小程序消息数量
  app_sPageMessage:`${v9}/app/worker/sPageMessage`, //小程序消息列表
  app_sMessageDetail:`${v9}/app/worker/sMessageDetail`, //消息详情
  app_workerGroup:`${v9}/app/worker/workerGroup`, //工作人员职工分组
  app_contacts:`${v9}/app/worker/workerContact`, // 职工通讯录
  app_teacherGroup:`${v9}/app/teacher/teacherGroup`, //教师人员分组
  app_teacherContacts:`${v9}/app/teacher/teacherContact`, // 教师通讯录
  get_myAttendance:`${v9}/app/attendance-record/myAttendance`,// 我的考勤
  get_workerStatistcs:`${v9}/app/attendance-record/worker/statistcs`,// 教职工考勤统计
  get_workerCheck:`${v9}/app/attendance-record/worker`,// 教职工考勤统计
  get_studentClassCheck:`${v9}/app/attendance-record/student/class`,// 学生考勤
  get_class_tree:`${v9}/app/class/class-tree`,// 班级信息
  
  get_recordAbstract:`${v9}/app/attendance-record/student/statistcs`,//考勤统计
  get_allrecordList:`${v9}/app/attendance-record/student/all/group`, //全部考勤列表
  get_recordList:`${v9}/app/attendance-record/student/group`,//走读学生考勤列表
  get_recordListRes:`${v9}/app/attendance-record/student/resident/group`,//住校生学生考勤列表


  wx_open_login:(appid)=>{
    return `${v3}/wx/open/user/${appid}/login`
  },//微信登录获取code
  wx_open_login_phone:(appid)=>{
    return `${v3}/wx/open/user/${appid}/info`
  },//微信登录
};
module.exports = {
  API: API
}