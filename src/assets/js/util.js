export const getnewlist = (arr, key) => {
  // 接收一个数组，返回数组的字典元素的key的值的列表
  let v = []
  arr.forEach(item => {
    v.push(item[key])
  })
  return v
}


export const findallitem = (arr, t) => {
  // 接收一个数组，返回目标元素的所有索引
  var results = [],
    len = arr.length,
    pos = 0;
  while (pos < len) {
    pos = arr.indexOf(t, pos);
    if (pos === -1) {//未找到就退出循环完成搜索
      break;
    }
    results.push(pos);//找到就存储索引
    pos += 1;//并从下个位置开始搜索
  }
  return results;
}
