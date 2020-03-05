<template>
    <div class="commentaction">
        <div class="infoAndaction">
            <Row>
                <div class="trd">
                    <Col :xs="14" :sm="10" :md="7">
            <span v-if="i">
        {{i.create_time}}
        </span>
                        <span v-if="item">
        {{item.create_time}}
         </span>
                    </Col>
                    <Col :xs="5" :sm="4" :md="3">
                  <span class="r">
        <Button type="text" ghost @click="reply" size="small">回复</Button>
        </span>
                    </Col>
                    <Col :xs="5" :sm="4" :md="3">
        <span v-if="ifcandel" class="d">
        <Button type="text" ghost @click="deletec" size="small">删除</Button>
         </span>
                    </Col>
                </div>

            </Row>
            <Row v-if="f">
                <Input v-model.trim="cv" type="textarea" :autosize="true" :maxlength="240" clearable
                       placeholder=">__<..."/>
                <div class="confb">
                    <Button @click="canc">取消</Button>
                    <Button @click="postcommentdata" type="success">回复</Button>
                </div>

            </Row>

        </div>
    </div>
</template>

<script>
    import {createComment, deleteComment} from '../../services/api'
    import {mapState} from 'vuex'

    export default {
        name: "CommentAction",
        props: ['item', 'i'],
        inject: ['reload'],
        data() {
            return {
                f: false,
                cv: '',
                post_id: this.$route.params.id,
                newaddc: {}
            }
        },
        computed: {
            //判断是否有删除权限
            ifcandel() {
                if (this.i) {
                    if (this.i.author.username == this.userinfo.username) {
                        return true
                    }
                } else {
                    if (this.item.author.username == this.userinfo.username) {
                        return true
                    }
                }
            },
            ...mapState({
                userinfo: 'userinfo',
            })
        },
        methods: {
            reply() {
                this.f = !this.f
            },
            canc() {
                this.f = false
            },
            postcommentdata() {
                if (this.cv) {
                    if (!this.userinfo.username) {
                        this.tolog()
                    } else {
                        //   是对父级评论的回复  无reply_to
                        if (this.item) {
                            createComment(
                                {
                                    "content": this.cv,
                                    "post": this.post_id,
                                    "reply_to": null,
                                    "parent_comment": this.item.id,
                                }
                            ).then(res => {
                                console.log(res);
                                this.$Message.success('评论添加成功');
                                this.newaddc = res.data;
                                this.$emit('addcom', this.newaddc)
                                this.f = false
                                this.cv = ''
                            }).catch(err => {
                                console.log(err)
                            })
                        } else {
                            // 对子级评论的回复  有 reply_to
                            console.log(this.i)
                            createComment(
                                {
                                    "content": this.cv,
                                    "post": this.post_id,
                                    "reply_to": this.i.id,
                                    "parent_comment": this.i.parent_comment
                                }
                            ).then(res => {
                                console.log(res);
                                this.$Message.success('评论添加成功');
                                let ret_to = {}
                                ret_to['author'] = this.i.author
                                ret_to['id'] = this.i.id
                                this.newaddc = res.data;
                                this.newaddc.reply_to = ret_to
                                this.$emit('addcom', this.newaddc);
                                this.f = false
                                this.cv = ''
                            }).catch(err => {
                                this.$Message.error("发生了一个错误，将刷新页面");
                                setTimeout(() => {
                                    this.reload()
                                }, 1000)
                            })
                        }
                    }

                }
            },
            deletec() {
                let t = this.i || this.item;
                let v = confirm('确认删除？')
                if (v) {
                    deleteComment({id: t.id}).then(res => {
                        // console.log(res);
                        // console.log(this.i,'i');
                        // console.log(this.item,'item');
                        this.$Message.success('评论删除成功');
                        //  三元表达式的应用
                        const pid = this.i ? this.i.parent_comment : this.item.parent_comment;
                        this.$emit('delc', t.id, parseInt(pid))
                    }).catch(err => {
                        this.$Message.error("发生了一个错误，将刷新页面");
                        setTimeout(() => {
                            this.reload()
                        }, 1000)
                    })
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
    .infoAndaction {
        margin-left: 56px;
        margin-bottom: 5px;

        span {
            margin-right: 20px;
        }
    }

    .extracomment .infoAndaction {
        margin-left: 48px;
        font-size: 1rem;
    }

    .r .ivu-btn-text:hover {
        color: rebeccapurple;
    }

    .d .ivu-btn-text:hover {
        color: hotpink;
    }

    .confb {
        text-align: right;
        margin-top: 5px;
    }

    .trd {
        height: 25px;
    }
</style>
