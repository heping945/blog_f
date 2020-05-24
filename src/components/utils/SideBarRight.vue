<template>
  <div class="lg-index-sidebar">
    <Card :bordered="false">
      <p slot="title">
        <marquee>{{randomtext}}</marquee>
      </p>
      <ul>
        <li>
          后端：django drf
        </li>
        <li>
          前端：vue iview
        </li>
        <li>
          部署：gunicorn nginx
        </li>
      </ul>
    </Card>

    <div class="info">
      <p>
        <span>
        <router-link :to="{name:'info',params:{info:'about'}}" target="_blank">关于</router-link>
        </span>
        ·
        <span>
          <router-link :to="{name:'info',params:{info:'guide'}}" target="_blank">使用指南</router-link>
        </span>
      </p>
      <p>
        <span><a href="/feedback" target="_blank">建议反馈</a></span>
        ·
        <span class="conn">
          <b @mouseover="fn1" @mouseout="fn2">联系作者</b>
          <div v-show="cm" class="cm" @mouseover="fn1" @mouseout="fn2">
            <div class="sj"></div>
           <div class="dm">
             添加请注明缘由
             <img src="@/assets/img/wx.jpg" alt="" width="160px">
           </div>
          </div>
        </span>
      </p>
      <p>
           <span>
          <router-link :to="{name:'info',params:{info:'version'}}" target="_blank">版本更新</router-link>
        </span>
        ·
        <span>
          <router-link :to="{name:'info',params:{info:'recommend'}}" target="_blank">学习推荐</router-link>
        </span>
      </p>

      <p>
        <a href="http://www.beian.miit.gov.cn">
          苏ICP备19007507号-1
        </a>
      </p>
      <p>©2019 pinge · Powered by zhp</p>
    </div>
  </div>

</template>

<script>
  import data from '@/assets/json/showtext.json';

  export default {
    name: "SideBarRight",
    data() {
      return {
        cm: false,
        // showtext:[
        //   '1',
        //   '2',
        //   '3',
        //   '4',
        // ]
      }
    },
    created() {
      console.log(data.data)
    },
    computed: {
      showtext() {
        return data.data
      },
      randomtext() {
        let l = this.showtext.length;
        console.log(l)
        return this.showtext[Math.floor(Math.random() * l)]
      }
    },
    methods: {
      fn1() {
        this.cm = true
      },
      fn2() {
        this.cm = false
      },
    }
  }
</script>

<style scoped lang="scss">
  .lg-index-sidebar {
    position: fixed;
    top: 80px;
    width: 240px;

    li {
      margin: 5px 0;
      font-weight: 800;
      list-style: none;
    }
  }

  .info {
    color: #909090;
    font-size: 1rem;
    line-height: 1.6;
    margin-top: 1rem;

    a:hover {
      color: #007fff;
    }
  }

  /*  联系作者弹出框*/
  .conn {
    position: relative;

    .cm {
      position: absolute;
      top: 24px;
      color: yellow;
      text-align: center;

      .sj {
        width: 0;
        height: 0;
        border-bottom: 10px solid #8a957a;
        border-right: 10px solid transparent;
        border-top: 10px solid transparent;
        border-left: 10px solid transparent;
        margin-top: -20px;
        margin-left: 73px;
      }

      .dm {
        background: #8a957a;
        padding: 1px 5px;
        border-radius: 5px;
      }
    }

  }
</style>
