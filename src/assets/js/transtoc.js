//  一个接收文章html格式，输出列表字典的方法，eg=>{id:'_7reset__0',title:'第一张',tag:1}
export const toToc = postbody => {
  //body文本转化成列表
  const reg = /<h\d><a id=".+"><\/a>.+<\/h\d>/g
  var r = postbody.match(reg)
  if (r){
    var newtoc = []
    const idreg = /id=".+"/g
    const titlereg = /<\/a>.+<\/h\d>/g
    r.forEach(item => {
      let id = item.match(idreg)[0].slice(4, -1)
      let title = item.match(titlereg)[0].slice(4, -5)
      newtoc.push({id: id, title: title, tag: item[2]})
    })
    return newtoc
  }else {
    return []
  }

}
