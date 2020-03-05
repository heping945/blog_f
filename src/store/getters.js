const getters = {
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
}

export default getters