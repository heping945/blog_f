import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import routes from './router'

Vue.use(VueRouter)

// 解决重复点击出错的NavigationDuplicated的解决方案，原理未知
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

import NProgress  from 'nprogress'
// import 'nprogress/nprogress.css' //这个样式必须引入
// 简单配置
NProgress.inc(0.2)
NProgress.configure({easing: 'ease', speed: 500, showSpinner: false})






const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.afterEach(route => {
    NProgress.done()
});

//  拦截器
router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {
        //  需要登录
        if (store.state.userinfo.token) {
            NProgress.start()
            next()
        } else {
            NProgress.start()
            next({name: 'Login', query: {backurl: to.fullPath}})
        }
    } else {
        next()
    }
    ;
    if (to.meta.title) {
        document.title = to.meta.title;
        console.log(document)
        console.log( typeof document)
    }
});

export default router
