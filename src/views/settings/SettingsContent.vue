<template>
  <div>
    <div class="topfix">
      <div class="p-container topixtop">
        <ul>
          <li v-for="item,index in tablist" @click="changei(index)">
            <router-link :to="{name:item.pathname}" :class='cindex==index? "active" :""'>{{item.title}}</router-link>
          </li>
        </ul>
      </div>
    </div>

    <main class="p-container setmain">
      <Row>
        <Col :xs="24" :sm="24" :md="24" :lg="18">
          <Card>
            <router-view name="settingtab"></router-view>
          </Card>
        </Col>
      </Row>

    </main>

  </div>
</template>

<script>
  import {mapActions,} from 'vuex'

  export default {
    name: "SettingsContent",
    data() {
      return {
        tablist: [
          {title: '个人资料', pathname: 'settprofile'},
          {title: '文章管理', pathname: 'settposts'},
          {title: '账号关联', pathname: 'account'},
          {title: '密码修改', pathname: 'password'},
        ],
        cindex: 0
      }
    },
    methods: {
      ...mapActions(['setcanscroll',]),
      changei(i) {
        this.cindex = i
      }
    }
  }
</script>

<style scoped lang="scss">
  .topfix {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background: #FFF;
    width: 100%;
    height: 4rem;
    z-index: 241;

    .topixtop {
      line-height: 4rem;
      font-size: 1.1rem;

      li {
        display: inline;
        margin-right: 1rem;
        margin-left: 5px;
      }
    }
  }

  @media (max-width: 576px) {
    .topfix {
      top: 50px;
    }
  }

  @media (min-width: 576px) {
    /deep/ .ivu-card-body {
      padding: 32px 48px 84px !important;
    }
  }

  @media(max-width: 360px) {
    /deep/ .ivu-card-body {
      padding: 16px 5px;
    }
  }


  main {
    position: relative;
    top: 120px;
    z-index: 100;
  }

  .setmain {
    z-index: 240;
  }
</style>
