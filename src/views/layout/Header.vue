<template>
    <div>
        <div class="header" v-if="backFlag">
            <header class="p-container">
                <Row>
                    <!--小屏幕下的logo-->
                    <Col :xs="3" :sm="0" :md="0" :lg="0">
                        <div class="simpleheaderlogo">
                            <router-link to="/">
                                <img src="@/assets/img/logo-xs.png" alt="logo" width="30" height="30">
                            </router-link>

                        </div>
                    </Col>
                    <!--大屏幕（md以上）的logo-->
                    <Col :xs="0" :sm="4" :md="4" :lg="3">
                        <div class="superheaderlogo">
                            <router-link to="/">
                                <img src="@/assets/img/logo-sm-md-lg.png" alt="logo" height="35" width="80">
                            </router-link>
                        </div>
                    </Col>
                    <!--小屏幕下的dropmenu-->
                    <Col :xs="5" :sm="6" :md="0" :lg="0">
                        <div class="headerdropmenu">
                            <Dropdown trigger="click" @on-click="selectmenu">
                                <a href="javascript:void(0)">
                                    {{indexshow}}
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem v-for="(item,index) in droplist" :key="index"
                                                  :divided="item.divided" :name="item.title">
                                        <router-link :to="item.url">
                                            {{item.title}}
                                        </router-link>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </Col>
                    <!--中大屏幕的nav-->
                    <Col :xs="0" :sm="0" :md="10" :lg="9">
                        <div class="navlist">
                            <ul>
                                <li v-for="(item,index) in droplist" @click="changei(index)">
                                    <router-link :to="item.url" :class='cindex==index? "active" :""'> {{item.title}}
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    </Col>
                    <!--   搜索-->
                    <Col :xs="10" :sm="9" :md="6" :lg="8" :xl="7">
                        <div class="header-search">
                            <Input search placeholder="搜索本站..." :maxlength="24" @on-search="search"
                                   v-model="search_arg"/>
                        </div>
                    </Col>
                    <Col :xs="0" :sm="0" :md="0" :lg="2" :xl="2">
                        <div class="about">
                            <router-link :to="{name:'info',params:{info:'about'}}" target="_blank"> 关于</router-link>
                        </div>
                    </Col>
                    <Col :xs="6" :sm="5" :md="4" :lg="2" :xl="3">
                        <div class="auth">
                            <template v-if="userinfo.token">
                                <Dropdown trigger="click">
                                    <a href="javascript:void(0)">
                                        <Avatar icon="ios-person" :src="avatar" :title="userinfo.username"/>
                                    </a>
                                    <DropdownMenu slot="list">
                                        <DropdownItem>
                                            <div @click="logout">注销</div>
                                        </DropdownItem>
                                        <DropdownItem>
                                            <router-link :to="{name:'userindex',params:{username:userinfo.username}}">主页
                                            </router-link>
                                        </DropdownItem>
                                        <DropdownItem>
                                            <router-link to="/settings">管理</router-link>
                                        </DropdownItem>
                                        <DropdownItem>
                                            <router-link :to="{name:'postadd'}">写文章</router-link>
                                        </DropdownItem>
                                        <DropdownItem>
                                            <router-link :to="{name:'subjectmanage'}">写专题</router-link>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </template>
                            <template v-else>
                                <router-link to="/login" target="_blank"> 登录 | 注册</router-link>
                            </template>

                        </div>
                    </Col>
                </Row>
            </header>
        </div>

        <div v-else :class="{'header':true,'ifShow':postheadershow,'thidden':!postheadershow}" id="show-in-post">
            <header class="p-container ">

                <template v-if="this.$route.name=='postdetail'">
                    {{this.post_title}}
                </template>
                <template v-else>
                    <div>
                        {{subjectAndid.title}}
                    </div>

                </template>
            </header>
        </div>


    </div>

</template>

<script>
    import {mapState, mapActions, mapMutations} from 'vuex'

    export default {
        name: "Header",
        inject: ['reload'],
        data() {
            return {
                droplist: [
                    {title: '首页', url: '/', divided: false},
                    {title: '归档', url: '/archive', divided: false},
                    {title: '专题', url: '/topic', divided: false},
                    {title: '问题', url: '/question', divided: false},
                    {title: '算法', url: '/algorithm', divided: true},
                ],
                // search_arg: '',
                indexshow: '首页',
                backFlag: true,
                ifshow: true,
                cindex: 0,
                scrollB: 0,
                scrollA: 0,
            }
        },
        computed: {
            avatar() {
                if (this.userinfo) {
                    return process.env.VUE_APP_BASE_SITE + this.userinfo.avatar
                }
            },
            postheadershow() {
                if (this.$route.name == 'postdetail' || this.$route.name == 'subjectcontent') {
                    this.ifshow = false
                    return this.ifshow
                } else {
                    this.ifshow = true
                    return this.ifshow
                }
            },
            ...mapState([
                    'can_scroll',
                    'userinfo',
                    'post_title',
                    'subjectAndid'
                ]
            ),
            search_arg: {
                get() {
                    return this.$store.state.search_arg
                },
                set(value) {
                    // this.$store.commit('setsearchval', value);
                    this.setsearchval(value)
                }
            }
        },
        mounted() {
            if (this.can_scroll) {
                window.addEventListener('scroll', this.showBtn) //scroll 滚动事件
            }
            this.setsearchkey();
        },
        destroyed() { // 组件销毁取消监听
            window.removeEventListener('scroll', this.showBtn)
        },
        created() {
            for (var i = 0; i < this.droplist.length; i++) {
                if (this.droplist[i].url == this.$route.path) {
                    this.cindex = i;
                    this.indexshow = this.droplist[i].title
                    return
                } else {
                    this.cindex = null
                }
            }
        },
        methods: {
            ...mapActions(['ClearToken']),
            ...mapMutations(['setsearchval']),
            // 切换dropmenu 选择dropitem进行路由切换
            selectmenu(name) {
                this.indexshow = name;
            },
            //注销
            logout() {
                this.ClearToken();
                this.reload();
                if (this.$route.meta.requireAuth) {
                    this.$router.push({name: 'index'})
                }
            },
            changei(index) {
                this.cindex = index;
                // console.log(this.$route)
            },
            search() {
                // 如果输入搜索参数，本地保存参数（用作组件刷新后取值）,store(用去组件传参)
                if (this.search_arg) {
                    // storage.set('searcharg', this.search_arg);
                    if (this.$route.name == 'search') {
                        this.$router.push({name: 'search', query: {q: this.search_arg, type: 'posts'}})
                        this.reload()
                    } else {
                        this.$router.push({name: 'search', query: {q: this.search_arg, type: 'posts'}})
                    }
                } else {
                    // storage.remove('searcharg')
                }
            },
            showBtn() { // 计算距离顶部的高度，当高度大于300隐藏，小于300显示（默认显示）
                /*获取当前页面滚动条纵坐标的位置
                IE9及以上：可以使用window.pageYOffset或者document.documentElement.scrollTop ，
                safari： window.pageYOffset 与document.body.scrollTop都可以
                Chrome：谷歌浏览器只认识document.body.scrollTop;*/
                let that = this
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
                that.scrollB = scrollTop
                if (that.scrollB > 300) {
                    // that.backFlag = false
                    if (that.scrollA <= that.scrollB) {//下滚
                        that.backFlag = false
                    } else {//上滚
                        that.backFlag = true
                    }
                    setTimeout(function () {
                        that.scrollA = that.scrollB;
                    }, 0);
                } else {
                    that.backFlag = true
                }
            },
            //
            setsearchkey() {
                if (this.$route.name != 'search') {
                    this.setsearchval(null)
                }
            }
        },
    }
</script>

<style scoped lang="scss">

    .header {
        background: #FFF;
        width: 100%;
        border-bottom: 1px solid #F1F1F1;
        font-size: 16px;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 250;

        .simpleheaderlogo img {
            position: relative;
            top: 10px;
            left: 7.5px;
        }
    ;

        .superheaderlogo img {
            position: relative;
            top: 12.5px;
            text-align: center;
        }
    ;

        .headerdropmenu {
            text-align: center;

            .ivu-dropdown-item {
                font-size: 14px !important;
            }
        }
    ;

        .navlist {
            display: inline-block;
            height: 60px;


            li {
                float: left;
                list-style: none;
            }
        ;

            li + li {
                margin-left: 20px;
            }
        }
    ;

        .about {
            text-align: center;

            a {
                color: #13c2c2;
                font-weight: bolder;
            }

        }

        @media (min-width: 1200px) {
            .about {
                text-align: right;
            }
        };

        .header-search {
            width: 90%;
            margin: 0 auto;
        }
    ;

        .auth {
            text-align: right;
            color: #007fff;
            cursor: pointer;
            padding-right: 5px;
            margin-left: -10px;

            .ivu-dropdown-item {
                text-align: center;
                font-size: 14px !important;
                /*padding: 2px 5px;*/
            }
        }
    }

    .ifShow {
        display: none;

    }

    .thidden {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
    }

    #show-in-post {
        padding-left: 2rem;
        font-size: 2rem;

    }
</style>
