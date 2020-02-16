<template>
  <div id="user" class="p-container commonpositiontop">
    <Row>
      <Col :xs="24" :sm="24" :md="24" :lg="18">
        <div class="profile">
          <div class="userprofile">
            <Card :bordered="false">
              <Row :gutter="24">
                <Col :xs="24" :sm="5" :md="5" :lg="5">
                  <a href="javascript:void(0)">
                    <Avatar icon="ios-person" :src="userinfo.avatar"/>
                  </a>
                </Col>
                <Col :xs="24" :sm="12" :md="12" :lg="12">
                  <Row>
                    <Col span="24">
                      <div class="nickname">{{name}}</div>
                    </Col>
                    <Col span="24">
                      <div class="desc" v-if="userinfo.desc">{{userinfo.desc}}</div>
                      <div class="desc" v-else>{{nodesc}}</div>
                    </Col>
                  </Row>
                </Col>
                <Col :xs="0" :sm="7" :md="7" :lg="7">
                  <div class="editprofile" v-if="$route.params.username==$store.state.userinfo.username">
                    <Button type="text" size="large" ghost @click="toeditprofile">编辑资料</Button>
                  </div>
                </Col>
              </Row>

            </Card>
          </div>
          <div class="headerlist">
            <Card>
              <Row type="flex" justify="space-around" class="code-row-bg">
                <Col span="4" v-for="i,index in headerlist" :key="index">
                  <router-link :to={name:i.pathname}>{{i.title}}</router-link>
                </Col>
              </Row>
            </Card>
          </div>
          <div id="userdetail">
            <router-view name="userdetail"></router-view>
          </div>
        </div>
      </Col>

      <Col :xs="0" :sm="0" :md="0" :lg="6">
        <!--        <SideBarRight></SideBarRight>-->
        <Card :bordered="false">
          <div style="text-align:center">
            <h3>A high quality UI Toolkit based on Vue.js</h3>
          </div>
        </Card>
      </Col>

    </Row>
  </div>
</template>

<script>
  import {getuserdetail} from '../../services/api'

  export default {
    name: "UserContent",
    data() {
      return {
        userinfo: {},
        nodesc: '这个人很懒,什么都没有留下',
        headerlist: [
          {title: '动态', pathname: 'userindex'},
          {title: '文章', pathname: 'userposts'},
          {title: '赞', pathname: 'account'},
          {title: '收藏', pathname: 'password'},
        ]
      }
    },
    computed: {
      name() {
        if (this.userinfo.nickname) {
          return this.userinfo.nickname
        } else {
          return this.userinfo.username
        }
      }
    },
    mounted() {
      this.getuserinfo()
    },
    methods: {
      getuserinfo() {
        getuserdetail({
          username: this.$route.params.username
        }).then(res => {
          this.userinfo = res.data
          console.log(this.userinfo)
        }).catch(err => {
          this.$router.push({name:'index'})
        })
      },
      toeditprofile() {
        this.$router.push({name: 'settprofile'})
      }
    }
  }
</script>

<style scoped lang="scss">
  @media (min-width: 992px) {
    .profile {
      padding-right: 20px;
    }
  }

  @media (max-width: 578px) {
    .userprofile {
      text-align: center;

      .ivu-card {
        height: 200px;
      }
    }
  ;

  }

  .commonpositiontop {
    height: 100%;

    .profile {
      span {
        font-size: 14px;
      }
    ;

      .userprofile {
        margin-bottom: 1rem;

        .ivu-avatar {
          width: 90px;
          height: 90px;
          border-radius: 45px
        }
      ;

        .desc {
          font-size: 1.3rem;
          margin-top: 2rem;
          font-family: 微软雅黑;
        }
      ;

        .nickname {
          font-size: 2rem;
          font-weight: bold;
          padding-top: 0.5rem;
        }
      ;

        .editprofile {
          /*padding: 20px 20px;*/
          text-align: center;
          line-height: 90px;
        }
      }
    }
  }

  .headerlist {
    a {
      margin-right: 2rem;
    }
  }

</style>
