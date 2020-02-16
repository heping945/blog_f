<template>
    <div id="commentlist">
        <Card :bordered="true" style="background: #fbfbfb">
            <div v-if="can_comment">
                <div class="commentlist">
                    <List item-layout="vertical">

                        <ListItem v-for="item,index in commentlist" :key="item.id">
                            <div class="maincomment">
                                <ListItemMeta
                                        :avatar="item.author.avatar"
                                        :title="item.author.username+' ： '+item.content"/>
                                <CommentAction :item="item" @addcom="changecl" @delc="changec2"></CommentAction>
                            </div>

                            <div class="extracomment" v-if="item.sub_comments">

                                <List item-layout="vertical" v-for="i in item.sub_comments" :key="i.id">
                                    <ListItemMeta v-if="i.reply_to"
                                                  :avatar="i.author.avatar"
                                                  :title="i.author.username+'：@'+i.reply_to.author.username+'：'+i.content"/>
                                    <ListItemMeta v-else
                                                  :avatar="i.author.avatar"
                                                  :title="i.author.username+'：'+i.content"/>
                                    <CommentAction :i="i" @addcom="changecl" @delc="changec2"></CommentAction>

                                </List>
                            </div>

                        </ListItem>

                    </List>
                </div>
                <div class="addcomment">
                    <template v-if="!commentlist.length&&!showin">
                        <Alert @click.native="fn2">暂无评论呢，添加一条评论吧→_→
                        </Alert>
                    </template>
                    <template v-if="showin">
                        <Input v-model.trim="newcom" type="textarea" :autosize="true" :maxlength="240" clearable
                               placeholder=">__<..."/>
                        <div class="confb">
                            <Button @click="canc">取消</Button>
                            <Button @click="addparcom" type="success">回复</Button>
                        </div>
                    </template>
                </div>
            </div>
            <div v-else>
                <Alert @click.native="fn2">关闭评论←_←</Alert>
            </div>

        </Card>
    </div>
</template>

<script>
    import CommentAction from './CommentAction'
    import {getComment, createComment} from '../../services/api'
    import {mapState} from 'vuex'

    export default {
        name: "CommentList",
        components: {
            CommentAction
        },
        // props: ['can_comment',],
        data() {
            return {
                newcom: '',
                post_id: this.$route.params.id,
                commentquery: {},
                commentlist: [],
                showin: false
            }
        },
        computed: {
            cq() {
                let post_id = this.$route.params.id;
                this.commentquery = {exist_parent_comment: 2, post: post_id}
                return this.commentquery
            },
            ...mapState({
                can_comment: 'can_comment',
                userinfo: 'userinfo',
            })
        },
        created() {
            // 这里有一个bug暂时无法解决，插眼以后解决
            // console.log(this.can_comment);
            this.initcommentlist()
        },
        methods: {
            initcommentlist() {
                getComment(this.cq).then(res => {
                    this.commentlist = res.data.results;
                    if (this.commentlist.length) {
                        this.showin = true
                    }
                }).catch(err => {
                    // console.log(err)
                    this.$router.push({name: 'notFound'})
                })
            },
            //添加评论
            changecl(arg) {
                // console.log(arg, 'arg');
                //获得评论的父评论
                let x = this.commentlist.filter(item => {
                    return item.id == arg.parent_comment
                });
                // console.log(x[0])
                x[0].sub_comments.push(arg);
                // console.log(this.commentlist)
            },
            //删除评论
            changec2(cid, pid) {
                // console.log(cid, pid);
                //pid  父评论id  cid 删除的评论的id
                if (pid) {
                    // 删除子评论
                    let res = this.commentlist.filter(item => {
                        return item.id == pid
                    });
                    //删除回复此评论的其他评论(不好用暂时不用)
                    // res[0].sub_comments = res[0].sub_comments.filter(i => {
                    //   return i.reply_to.id != cid
                    // });
                    res[0].sub_comments = res[0].sub_comments.filter(i => {
                        return i.id != cid
                    })

                } else {
                    // 删除父评论
                    this.commentlist = this.commentlist.filter(item => {
                        return item.id != cid
                    })
                }
            },
            fn2() {
                this.showin = true
            }
            ,
            canc() {
                this.newcom = ''
            }
            ,
            //添加父级评论
            addparcom() {
                if (this.newcom) {
                    if (!this.userinfo.username) {
                        this.tolog()
                    } else {
                        createComment(
                            {
                                "content": this.newcom,
                                "post": this.post_id,
                                "reply_to": null,
                                "parent_comment": null,
                            }
                        ).then(res => {
                            console.log(res);
                            this.$Message.success('评论添加成功');
                            this.commentlist.push(res.data)
                            this.newcom = ''
                        }).catch(err => {
                            console.log(err.response)
                        })
                    }

                }
            },
            tolog() {
                this.$Message.error('评论请先登录');
                setTimeout(() => {
                    this.$router.push({name: 'Login', query: {backurl: 'post/' + this.$route.params.id}})
                }, 1000)
            }
        }
    }
</script>

<style scoped lang="scss">
    #commentlist {
    }

    /*以下是恢复列表框内容的定制*/
    /*额外操作行（extra）*/
    .ivu-list-vertical .ivu-list-item-extra li {
        display: inline-block;
        margin-top: 20px;
        margin-right: 20px;
    }

    /*头像*/
    /deep/ .ivu-avatar {
        width: 40px;
        height: 40px;
        line-height: 40px;
        border-radius: 20px;
    }

    /deep/ .extracomment .ivu-avatar {
        width: 32px;
        height: 32px;
        line-height: 32px;
        border-radius: 16px;
    }

    /deep/ .ivu-list-vertical .ivu-list-item-meta-title {
        /*padding-right: 100px;*/
    }

    /* 主回复操作行*/
    .maincomment .ivu-list-item-action {
        margin-top: 0;
        margin-left: 56px;
    }

    /*item-meta外边距*/
    .ivu-list-vertical .ivu-list-item-meta {
        margin-bottom: 0;
    }

    /deep/ .ivu-list-item-action > li .ivu-icon {
        /*margin-right: 3px;*/
    }

    /*  子评论*/
    .extracomment {
        margin-left: 15px;
        padding-left: 25px;
        border-left: 2px solid #8a8a8a;
        background: #F6F8FA;

        /deep/ .ivu-list-item-meta-title {
            font-weight: 400;
        }
    }

    /deep/ .ivu-btn-ghost {
        color: #F6F8FA
    }

    .confb {
        text-align: right;
        margin-top: 5px;
    }
</style>
