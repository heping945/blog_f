// 将后端django传入的日期转化为时间戳格式
var timeStamp = time => {
  var jstime = new Date(time);
  var timezone = 8; //目标时区时间，东八区
  var offset_GMT = new Date().getTimezoneOffset();
  return jstime.getTime()+offset_GMT * 60 * 1000+timezone * 60 * 60 * 1000
};

// 计算时间差

export const handleDate = dateTimeStamp => {
  const second = 1000 ;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;
  var result = '';
  var now = new Date().getTime();
  var TimeStamp = timeStamp(dateTimeStamp);
  var diffValue = now - TimeStamp;
  if (diffValue < 0) {
    console.log("时间不对劲,服务器创建时间与当前时间不同步");
    return result = "刚刚";
  }
  var yearC = diffValue / year;
  var monthC = diffValue / month;
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  var secondC = diffValue / second;
  if (parseInt(monthC) >= 12) {
    result = '' + parseInt(yearC) + '年前';
    console.log('测试数据',dateTimeStamp,TimeStamp,diffValue,yearC,parseInt(yearC))
  } else if (parseInt(monthC) >= 1) {
    result = '' + parseInt(monthC) + '月前';
  } else if (parseInt(dayC) > 1) {
    result = "" + parseInt(dayC) + "天前";
  } else if (parseInt(dayC) == 1) {
    result = "昨天";
  } else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时前";
  } else if (minC >= 1) {
    result = "" + parseInt(minC) + "分钟前";
  } else if (parseInt(secondC)>=15){
    result = "" + parseInt(secondC) + "秒前";
  } else
    result = "刚刚";
  return result;
};

