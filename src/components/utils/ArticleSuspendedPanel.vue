<template>
    <div class="article-suspended-panel">
        <ul>
            <li :class='votestate==1? "vote" :(votestate==2?"dislike":"")' @dblclick="fn2" title="双击反对">
                <Badge :count="postuc" :offset="[0,0]" :type='postuc>0?"success":"normal"'>
                    <Icon :type='votestate==2?"md-thumbs-down":"md-thumbs-up"' @click="fn1"/>
                </Badge>
            </li>
            <li title="评论一下吧">
                <Badge :count="get_post_comment_count" :offset="[0,0]" type="info">
                    <a href="#hpcomment">
                        <Icon type="ios-chatbubbles"/>
                    </a>
                </Badge>
            </li>
            <li :class='favstate? "fav" :""' @click="favOrdisfav" title="收藏">
                <Icon type="md-star"/>
            </li>
            <div>
                分享
            </div>
            <li>
                <SvgIcon iconClass="qq"></SvgIcon>
            </li>
            <li>
                <SvgIcon iconClass="weixin"></SvgIcon>
            </li>
            <li>
                <SvgIcon iconClass="weibo-oc"></SvgIcon>
            </li>
        </ul>
    </div>
</template>

<script>
    import {delFav, addFav} from '@/services/api'
    import {addVote, updateVote} from '@/services/api'
    import {mapActions, mapGetters, mapState} from 'vuex'


    export default {
        name: "ArticleSuspendedPanel",
        props: ['get_post_comment_count'],
        data() {
            return {
                // curhasfav: this.$store.state.favstate
                clicktime: null,
                vo: 0,
            }
        },
        computed: {
            ...mapGetters({
                favstate: 'favstate',
                votestate: 'votestate'
            }),
            ...mapState({
                post_title: 'post_title',
                postuc: 'postuc',
                userinfo: 'userinfo',
            })
        },
        methods: {
            ...mapActions(['PostFavstate', 'PostVotestate', 'PostUpvoteCountOperation']),
            favOrdisfav() {
                let postid = this.$route.params.id
                //已收藏
                let log = this.userinfo.token;
                if (!log) {
                    this.needlog()
                    return
                }
                if (this.favstate) {
                    delFav(postid).then(res => {
                        console.log(res);
                        this.$Notice.success({
                            title: '取消收藏成功',
                            duration: 1
                        });
                        this.PostFavstate(false)
                        // console.log(this.$store.state.favstate, '之前是yes，现在该变成false了')
                    }).catch(err => {
                        console.log(err.response, 'hasfav')
                    })
                } else {
                    //未收藏
                    addFav(
                        {post: postid}
                    ).then(res => {
                        console.log(res);
                        this.$Notice.success({
                            title: '文章“' + this.post_title + '”收藏成功',
                            duration: 1
                        });
                        this.PostFavstate(true)
                    }).catch(err => {
                        console.log(err.response, 'nohasfav')
                    })
                }
            },
            fn1() {
                let postid = this.$route.params.id;
                let log = this.userinfo.token;
                if (this.clicktime) {
                    clearTimeout(this.clicktime);
                    this.clicktime = null
                }
                ;
                this.clicktime = setTimeout(() => {
                    //单击操作
                    if (!log) {
                        this.needlog()
                        return
                    }
                    if (this.votestate == null) {
                        //  未执行过操作
                        addVote({post: postid, vote: 1}).then(res => {
                            this.PostVotestate(1);
                            this.PostUpvoteCountOperation(1)
                        }).catch(err => {
                        })
                    } else {
                        //如果是有状态的反对或支持改成无状态
                        if (this.votestate == 1 || this.votestate == 2) {
                            updateVote({
                                id: postid,
                                vote: 0,
                            }).then(res => {
                                if (this.votestate == 1) {
                                    this.PostUpvoteCountOperation(-1)
                                } else {
                                    this.PostUpvoteCountOperation(1)
                                }
                                this.PostVotestate(0)

                            }).catch(err => {
                                console.log(err.response)
                            })
                        } else {
                            //改成有状态的支持
                            updateVote({
                                id: postid,
                                vote: 1,
                            }).then(res => {
                                this.PostUpvoteCountOperation(1)
                                this.PostVotestate(1)
                            }).catch(err => {
                                console.log(err.response)
                            })
                        }
                    }
                }, 400)
            },
            fn2() {
                if (this.clicktime) {
                    clearTimeout(this.clicktime);
                    this.clicktime = null
                }
                //双击操作
                let postid = this.$route.params.id
                let log = this.userinfo.token;
                if (!log) {
                    this.needlog()
                    return
                }
                if (this.votestate == null) {
                    //  未执行过操作
                    addVote({post: postid, vote: 2}).then(res => {
                        this.PostUpvoteCountOperation(-1)
                        this.PostVotestate(2)
                    }).catch(err => {
                    })
                } else {
                    //如果是未操作或者支持
                    if (this.votestate == 1 || this.votestate == 0) {
                        updateVote({
                            id: postid,
                            vote: 2,
                        }).then(res => {
                            if (this.votestate == 1) {
                                this.PostUpvoteCountOperation(-2)
                            } else {
                                this.PostUpvoteCountOperation(-1)
                            }
                            this.PostVotestate(2)
                        }).catch(err => {
                        })
                    } else {
                        //不操作
                    }
                }
            },
            needlog() {
                // if (!this.$store.state.userinfo.token) {
                // 未登录
                this.$Message.error({
                    content: "您尚未登录,将返回登录页面",
                    duration: 1,
                });
                setTimeout(
                    () => {
                        this.$router.push({name: 'Login', query: {backurl: 'post/' + this.$route.params.id}})
                    }, 300
                );
            },
        }
    }
</script>

<style scoped lang="scss">
    li svg {
        position: relative;
        top: -3.2px;
        left: -4px;

        &:hover {
            cursor: pointer;
        }
    }

    .article-suspended-panel {
        position: fixed;
        top: 16rem;
        margin-left: -7rem;

        div {
            height: 36px;
            width: 36px;
            text-align: center;
            line-height: 36px;
            padding: 0 0 0 10px;
            margin: 1.5rem 0 1rem;
            font-size: 1rem;
            color: #c6c6c6;
            user-select: none;
        }
    ;

        li {
            margin: 0 0 9px 5px;
            width: 35px;
            height: 35px;
            background: white;
            border-radius: 50%;
            padding: 3px;
            border: 1px solid #f1f1f1;
            box-shadow: 0 1px 2px 0;
            list-style: none;

            .ivu-icon {
                font-size: 20px;
                color: #B2BAC2;
                position: relative;
                top: 3px;
                left: 4px;
            }
        ;

            .ivu-icon:hover {
                color: #86ADD3;
                cursor: pointer;
            }
        }
    ;

        li:last-child {
            margin: 0 0 0 5px;
        }
    }

    @media (max-width: 992px) {
        .article-suspended-panel {
            display: none;
        }
    }

    .fav .ivu-icon {
        color: gold !important;
    }

    .vote .ivu-icon {
        color: red !important;
    }

    .dislike .ivu-icon {
        color: #007fff !important;
        top: 6px !important;
    }

    /*  徽标*/
    /deep/ .ivu-badge-count {
        height: 15px !important;
        line-height: 13px;
        min-width: 18px;
    }
</style>
