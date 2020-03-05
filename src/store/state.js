import Cookie from "vue-cookies";

const state ={
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

}



export default state