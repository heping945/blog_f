// 封装storage本地存储模块
const storage ={
    set(key,value){
        localStorage.setItem(key,JSON.stringify(value))
    },
    get(key){
      // console.log(typeof key);
      // console.log('上面打印了key类型');
      // console.log(key);
      // console.log('上面打印了key内容');
        return JSON.parse(localStorage.getItem(key))
    },
    remove(key){
        localStorage.removeItem(key)
    }
}
export default storage
