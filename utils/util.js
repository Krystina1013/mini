const formatTime = (date, type) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return type == 'date' ? [year, month, day].map(formatNumber).join('-') : [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const getMonthWeek = (a, b, c) => {
  /**
   * a = d = 当前日期
   * b = 6 - w = 当前周的还有几天过完(不算今天)
   * a + b 的和在除以7 就是当天是当前月份的第几周
   */
  var date = new Date(a, parseInt(b) - 1, c),
    w = date.getDay(),
    d = date.getDate();
  if (w == 0) {
    w = 7;
  }
  var config = {
    getMonth: date.getMonth() + 1,
    getYear: date.getFullYear(),
    getWeek: Math.ceil((d + 6 - w) / 7),
  }
  return config;
};


/**
 * 时间戳转年-月-日 时:分:秒的格式
 * @param nS 时间戳
 */
const getTimeByTimeStamp=(nS)=>{
  //将时间戳（十三位时间搓，也就是带毫秒的时间搓）转换成时间格式
  // d.cTime = 1539083829787
  let date = new Date(nS);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;
  let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  let minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  let second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  date = year + '-' + month + '-' + day + " " + hour + ":" + minute + ":" + second;
  return date;
}
const getDateByTimeStamp=(nS)=>{
  //将时间戳（十三位时间搓，也就是带毫秒的时间搓）转换成时间格式
  // d.cTime = 1539083829787
  let date = new Date(nS);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;
  date = year + '-' + month + '-' + day;
  return date;
}
/**
 *  时间戳转年-月-日 时:分:秒的格式 可以配置"YYYY-mm-dd HH:MM:SS",
 * @param  fmt 格式（YYYY-mm-dd HH:MM:SS） date时间戳
 */
const dateFormat=(fmt, date)=> {
  let ret;
  const opt = {
      "Y+": date.getFullYear().toString(),        // 年
      "m+": (date.getMonth() + 1).toString(),     // 月
      "d+": date.getDate().toString(),            // 日
      "H+": date.getHours().toString(),           // 时
      "M+": date.getMinutes().toString(),         // 分
      "S+": date.getSeconds().toString()          // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
      };
  };
  return fmt;
}

module.exports = {
  formatTime: formatTime,
  getMonthWeek,
  getTimeByTimeStamp,
  getDateByTimeStamp,
  dateFormat
}