const actions = {
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


}

export default actions