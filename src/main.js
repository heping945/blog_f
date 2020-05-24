import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

// 引入mavon-editor
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

Vue.use(mavonEditor);

import plugins from './components/common'

//注意必须在构建Vue实例之前就将需要的组件注册进去
Vue.use(plugins);

// 全局引入iView
// import iView from 'iview';
// import 'iview/dist/styles/iview.css';
//
// Vue.use(iView);

import './assets/css/normalize.css'
import './assets/css/base.scss'
import './assets/css/scroll.css'
// import "./assets/iconfont/iconfont.css";

// if(process.env.NODE_ENV =='development'){
//     var vConsole = new VConsole();
//     console.log('Hello world');
// }


console.log(process.env.NODE_ENV,'NODE_ENV')
export default new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

Vue.config.devtools = true;
