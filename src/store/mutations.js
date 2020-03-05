import Cookie from "vue-cookies";

const mutations ={
        SaveToken(state, usertoken) {
            //账号登录
            state.userinfo.username = usertoken.username;
            state.userinfo.token = usertoken.token;
            state.userinfo.avatar = usertoken.avatar;
            state.userinfo.id = usertoken.id;
            Cookie.set('username', usertoken.username, 60 * 60 * 24 * 7);
            Cookie.set('token', usertoken.token, 60 * 60 * 24 * 7);
            Cookie.set('avatar', usertoken.avatar, 60 * 60 * 24 * 7);
            Cookie.set('id', usertoken.id, 60 * 60 * 24 * 7);
        },
        ClearToken(state) {
            // 清除  userinfo 数据,注销登录
            state.userinfo.username = null;
            state.userinfo.token = null;
            state.userinfo.avatar = null;
            state.userinfo.id = null;
            Cookie.remove('username');
            Cookie.remove('token')
            Cookie.remove('avatar')
            Cookie.remove('id')
        },
        SetPostTitle(state, title) {
            state.post_title = title
        },
        SetSubject(state, subjectAndid) {
            state.subjectAndid = subjectAndid
        },
        setcollAndshadow(state) {
            state.collAndshadow = !state.collAndshadow
        },
        PostSearchArg(state, arg) {
            state.search_arg = arg
        },
        PostFavstate(state, fav) {
            state.favstate = fav
        },
        PostVotestate(state, vote) {
            state.votestate = vote
        },
        PostUpvoteCount(state, uc) {
            state.postuc = uc
        },
        PostUpvoteCountOperation(state, num) {
            state.postuc += num
        },
        setcanscroll(state, f) {
            state.can_scroll = f
        },
        ifcancomment(state, v) {
            state.can_comment = v
        },
        setsearchval(state,value){
               state.search_arg = value
        }
}

export default mutations