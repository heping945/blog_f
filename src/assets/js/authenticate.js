import store from '../../store'



const authenticate = {
  //是否登录
  ifLogin() {
    let authflag = store.state.userinfo.username;
    if (authflag) {
      return true
    } else {
      return false
    }
  },
  //传入文章作者是否是当前登录用户
  ifCurrentUser(postauthor) {
    if (this.ifLogin()) {
      let authuser = store.state.userinfo.username;
      if (postauthor == authuser) {
        return true
      }
    } else {
      return false
    }
  }
}

export default authenticate
