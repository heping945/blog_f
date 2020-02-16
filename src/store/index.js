import Vue from 'vue'
import Vuex from 'vuex'
import Cookie from 'vue-cookies'

Vue.use(Vuex)


export default new Vuex.Store({
    state: {
        userinfo: {
            username: Cookie.get('username'),
            token: Cookie.get('token'),
            avatar: Cookie.get('avatar'),
            id: Cookie.get('id'),
        },
        post_title: 'hello world',
        search_arg: '',
        favstate: false,
        votestate: null,
        postuc: null,
        can_scroll: true,
        can_comment: null,
        subjectAndid: {},
        collAndshadow: true,
    },
    mutations: {
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
    },
    actions: {
        SaveToken({commit}, usertoken) {
            commit('SaveToken', usertoken)
        },
        ClearToken({commit}) {
            commit('ClearToken')
        },
        SetPostTitle(context, title) {
            context.commit('SetPostTitle', title)
        },
        SetSubject(context, subjectAndid) {
            context.commit('SetSubject', subjectAndid)
        },
        setcollAndshadow(context) {
            context.commit('setcollAndshadow')
        },
        PostSearchArg(context, arg) {
            context.commit('PostSearchArg', arg)
        },
        PostFavstate(context, fav) {
            context.commit('PostFavstate', fav)
        },
        PostVotestate(context, vote) {
            context.commit('PostVotestate', vote)
        },
        PostUpvoteCount(context, uc) {
            context.commit('PostUpvoteCount', uc)
        },
        PostUpvoteCountOperation(context, num) {
            context.commit('PostUpvoteCountOperation', num)
        },
        setcanscroll(context, f) {
            context.commit('setcanscroll', f)
        },
        ifcancomment(context, v) {
            context.commit('ifcancomment', v)
        },
    },
    getters: {
        favstate(state) {
            if (state.userinfo.token) {
                return state.favstate
            } else {
                return false
            }
        },
        votestate(state) {
            if (state.userinfo.token) {
                return state.votestate
            } else {
                return null
            }
        }
    },
})
