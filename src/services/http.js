import axios from 'axios';
import store from '@/store'


const api = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL,
    timeout: 10000,
});


//axios.request.interceptors
api.interceptors.request.use(config => {
        // console.log(config);
        // 如果登录了  api请求携带请求头
        let token = store.state.userinfo.token
        if (token) {
            config.headers['Authorization'] = 'JWT ' + token;
            // Message.info('test')   ? 测试用
        }
        return config
    }, err =>
        // Message.error('服务器错误')
        Promise.reject(err)
);

// // http response 拦截器
// // 要改太多了暂时没用
// services.interceptors.response.use(
//   undefined,
//   error => {
//     let res = error.response;
//     switch (res.status) {
//       case 401:
//         // 返回 401 清除token信息并跳转到登录页面
//         // store.commit(types.LOGOUT);
//         //router.replace({
//         //  path: '/app/login',
//         //  query: {redirect: router.currentRoute.fullPath}
//         //})
//         console.log('未登录 或者token过期');
//         break
//       case 403:
//         console.log('您没有该操作权限');
//         // alert('您没有该操作权限');
//         break
//       case 404:
//         console.log('未找到');
//         // alert('您没有该操作权限');
//         break
//       case 500:
//         console.log('服务器错误');
//       // alert('服务器错误');
//     }
//     return Promise.reject(error.response.data)   // 返回接口返回的错误信息
//   });


export default api
