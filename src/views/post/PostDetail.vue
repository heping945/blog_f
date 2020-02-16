<template>
    <div id="postdetail" class="postdetail p-container commonpositiontop">
        <ArticleSuspendedPanel :get_post_comment_count="postdetail.get_post_comment_count"></ArticleSuspendedPanel>
        <Row>
            <Col :xs="24" :sm="24" :md="24" :lg="18">
                <!--左侧文章区域-->
                <article class="lg-left-main" v-cloak>
                    <Card :bordered="true" style="background: #fbfbfb">
                        <!--头侧作者信息区-->
                        <div class="author-info-box" style="width: 100%;min-height: 40px" v-cloak>
                            <div style="float: left;margin-top: 5px">
                                <Avatar icon="ios-person" :src="author.avatar"/>
                            </div>
                            <div style="float: left">
                                <div style="font-size: 1.3rem;font-weight: bold;margin: 1px 0 1px 5px;color: #333333">
                                    <div v-if="author.nickname">
                                        {{author.nickname}}
                                    </div>
                                    <div v-else v-text="author.username"></div>
                                </div>
                                <div style="font-size: 1.1rem;margin: 12px 0 0 5px">
                                    {{postdetail.create_date}}&nbsp;&nbsp;阅读 {{postdetail.views_count}}
                                    <a :href="postdetail.reproduce_source" v-if="postdetail.reproduce"
                                       style="margin-left: 30px"
                                       target="_blank">
                                        <Icon type="ios-link" color="rebeccapurple" :size="16"/>
                                    </a>
                                </div>
                            </div>

                            <div style="float:right;">
                                <template v-if="ifAuthor">
                                    <Button type="default" icon="ios-create-outline" size="small"
                                            class="xs-sm-hidden" @click="toedit" ghost>编辑
                                    </Button>
                                </template>
                                <template v-else>
                                    <Button type="default" size="small" ghost>关注</Button>
                                </template>
                            </div>
                        </div>
                        <!--标题-->
                        <h3 style="text-align: center">{{postdetail.title}}</h3>
                        <!--主体文章body区-->
                        <main>
                            <mavon-editor v-model="value" :codeStyle="postdetail.codestyle" :boxShadow="false"
                                          :toolbarsFlag="false" ref="md" :subfield="false" defaultOpen="preview"/>
                        </main>
                    </Card>
                </article>
                <!--        文章标签分类-->
                <div id="hptagcat">
                    <PostTagCat :cat="postcatname" :catslug="postcatslug" :tag="postdetail.tags"></PostTagCat>
                </div>
                <!--        评论区-->
                <div id="hpcomment">
                    <CommentList :can_comment="postdetail.can_comment"></CommentList>
                </div>

            </Col>
            <!--右侧响应式面板区域-->
            <Col :xs="0" :sm="0" :md="0" :lg="6">
                <CatLog :catlog="catlog"></CatLog>
            </Col>
        </Row>
        <SuspensionPanelBottom v-if="bottom"></SuspensionPanelBottom>
        <SuspensionPanel></SuspensionPanel>
    </div>
</template>

<script>
    import {getAllFavs, getAllVote,getPostDetail} from '../../services/api'
    import {toToc} from '../../assets/js/transtoc'

    const CommentList = () => import('@/components/comment/CommentList')
    const PostTagCat = () => import('@/components/post/PostTagCat')
    const SideBarRight = () => import('@/components/utils/SideBarRight')
    const ArticleSuspendedPanel = () => import('@/components/utils/ArticleSuspendedPanel')
    const SuspensionPanelBottom = () => import('@/components/utils/SuspensionPanelBottom')
    const SuspensionPanel = () => import('@/components/utils/SuspensionPanel')
    const CatLog = () => import('@/components/utils/CatLog')
    import authenticate from '../../assets/js/authenticate'

    import {mapActions, mapState} from 'vuex'
    import Axios from 'axios'


    export default {
        name: "PostDetail",
        data() {
            return {
                value: `<code>hello world</code>`,
                author: {},
                postdetail: {},
                spinShow: true,
                postcatname: null,
                postcatslug: null,
                toolbars: {
                    readmodel: true,
                },
                catlog: [],
                ifauthor: false,
                ifauth: false,
                bottom: false
            }
        },
        components: {
            SideBarRight,
            ArticleSuspendedPanel,
            SuspensionPanelBottom,
            SuspensionPanel,
            CatLog,
            CommentList,
            PostTagCat
        },
        computed: {
            authstate() {
                if (authenticate.ifLogin()) {
                    this.ifauth = true
                    return this.ifauth
                }
            },
            ifAuthor() {
                let aname = this.author.username
                if (authenticate.ifCurrentUser(aname)) {
                    this.ifauthor = true
                    return this.ifauthor
                }
            },
            ...mapState({
                userinfo: 'userinfo',
            })
        },
        created() {
            this.$Spin.show();
            this.initdata();
            if (this.userinfo.token) {
                this.initFavsVote();
            }
            ;
            // this.spinshow()
        },
        methods: {
            ...mapActions(['PostFavstate', 'PostVotestate', 'PostUpvoteCount', 'ifcancomment','SetPostTitle']),
            // 初始化post数据
            initdata() {
                getPostDetail(
                    {id: this.$route.params.id}
                ).then(
                    res => {
                        this.postdetail = res.data;
                        this.PostUpvoteCount(this.postdetail.upvote_count);
                        this.author = this.postdetail.author;
                        console.log(this.author.avatar)
                        this.postcatname = this.postdetail.category.name
                        this.postcatslug = this.postdetail.category.slug
                        this.catlog = this.toToc(this.postdetail.body)
                        // 配置 postdetail 页的标题栏
                        this.SetPostTitle( this.postdetail.title);
                        this.ifcancomment(this.postdetail.can_comment)

                        this.value = this.postdetail.body_md ||this.postdetail.body
                        ;
                        this.$Spin.hide();
                    }
                ).catch(
                    err => {
                        // 返回首页
                        this.$Spin.hide();
                        console.log(err.response)
                        this.$router.push({name: 'notFound'})
                    }
                )
            },
            initFavsVote() {
                Axios.all([getAllFavs(), getAllVote()]).then(Axios.spread((favres, voteres) => {
                    //处理fav数据
                    let favlist = favres.data.results;
                    let f = favlist.filter(item => {
                        return item.post == this.$route.params.id
                    });
                    if (f.length) {
                        this.PostFavstate(true)
                    } else {
                        this.PostFavstate(false)
                    }
                    //处理vote数据
                    let votelist = voteres.data.results;
                    let v = votelist.filter(item => {
                        return item.post == this.$route.params.id
                    });
                    // console.log(v)
                    if (v.length) {
                        // console.log(v[0].vote, 'vvvvvvvvvvvvvvvvvvvvvvvvvv')
                        this.PostVotestate(v[0].vote)
                    } else {
                        this.PostVotestate(null)
                    }
                })).catch(Axios.spread((faverr, voteerr) => {
                    console.log(faverr, 'faverr');
                    console.log(voteerr, 'voteerr');
                }));
            },
            // dateFormat,
            toToc,
            // 跳转到文章编辑页面
            toedit() {
                const postid = this.$route.params.id;
                this.$router.push({name: "PostEdit", params: {id: postid}})
            },
            spinshow() {
                this.$Spin.show();
                setTimeout(() => {
                    this.$Spin.hide();
                }, 3000);
            }
        }
    }
</script>

<style scoped lang="scss">

    @media (min-width: 992px) {
        /*宽度大于992px时，main区增加右内边距20px*/
        .lg-left-main {
            padding-right: 20px;
        }
        #hpcomment {
            padding-right: 20px;
        }
        #hptagcat {
            padding-right: 20px;
        }
    }

    /*编辑按钮在移动端隐藏*/
    @media (max-width: 576px) {
        .xs-sm-hidden {
            display: none;
        }
    ;
        /deep/ .v-note-wrapper .v-note-panel .v-note-show .v-show-content, .v-note-wrapper .v-note-panel .v-note-show .v-show-content-html {
            padding: 0 0;
        }
    }

    .postdetail {
        z-index: 240;
        margin-bottom: 2rem;

        .v-show-content {
            padding: 0 0;
        }
    }

    .lg-left-main {
        h3 {
            font-size: 2.5rem;
            margin: 1.6rem 0;
        }
    ;

        .author-info-box {
            width: 100%;
            height: 40px;
            margin: 1.6rem 0;
        }
    }

    @media (max-width: 576px) {
        .lg-left-main {
            h3 {
                font-size: 2rem;
                margin: 1.3rem 0;
            }
        }
    ;
    }

    #hpcomment {
        margin-top: 2rem;
    }

    #hptagcat {
        margin-top: 2rem;
    }

    [v-cloak] {
        display: none;
    }


</style>
