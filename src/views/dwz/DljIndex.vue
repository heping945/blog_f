<template>
    <div id="dlj">
        <h1>短网址</h1>
        <Tabs size="small">
            <TabPane label="缩短网址">
                <Input search enter-button="缩短网址" placeholder="请输入长网址..." :class="{greeninput:ifgreen}"
                       v-model.trim="longweb" type="url" @on-search="fn1"/>

                <Alert type="success" v-show="success_short_url">
                    <a :href="success_short_url">
                        {{success_short_url}}
                    </a> <span title="复制网址" @click="copy" ref="webcopy">复制</span>
                </Alert>
                <input id="copy_content" type="text" v-model="success_short_url" ref="webcopy"
                       style="position: absolute;top: 0;left: 0;opacity: 0;z-index: -10;"/>
                <Alert type="error" v-show="iferr">{{errmsg}}</Alert>
            </TabPane>
            <TabPane label="还原网址">
                <Input search enter-button="还原网址" placeholder="请输入短网址(如:https://zhaoheping.com/t/xxx)或直接输入后缀(如:xxx)..."
                       :class="{greeninput:ifgreen2}" v-model.trim="shortweb" @on-search="fn2"/>
                <Alert type="success" v-show="stl">
                    <a :href="stl">
                        {{stl}}
                    </a>

                </Alert>
                <Alert type="error" v-show="iferr2">{{errmsg2}}</Alert>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
    import {createShorturl, getLongurl} from '@/services/api'

    export default {
        name: "DljIndex",
        data() {
            return {
                longweb: '',
                shortweb: '',
                success_short_url: '',
                iferr: false,
                iferr2: false,
                errmsg: 'url格式不正确，请加上协议，如：http://www.zhaoheping.com或https://www.zhaoheping.com',
                errmsg2: '请检查格式，正确格式https://zhaoheping.com/t/aaa或者aaa',
                ifgreen: false,
                ifgreen2: false,
                stl: ''
            }
        },
        created() {
            console.log(this.host)
            console.log(this.length)
        },
        computed: {
            host() {
                return process.env.VUE_APP_BASE_SITE + '/t/'
            },
            length() {
                return this.host.length
            }
        },
        watch: {
            longweb() {
                var reg = /^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/;
                if (!reg.test(this.longweb)) {
                    // alert("这网址不是以http://https://开头，或者不是网址！");
                    this.ifgreen = false
                } else {
                    this.ifgreen = true
                    this.iferr = false
                }
            },
            shortweb() {
                // if(this.shortweb.slice())
                if (this.shortweb.length < 9 && this.shortweb) {
                    //数量小于7  是short_id匹配
                    let r = /\W+/
                    if (r.test(this.shortweb)) {
                        //  匹配到非数字字母，剔除
                        this.ifgreen2 = false
                    } else {
                        //  可以验证
                        this.ifgreen2 = true
                        this.iferr2 = false
                    }
                } else if (this.shortweb.length < 35) {
                    //  匹配全部包括域名
                    // if (this.shortweb.slice(0, 25) == 'https://zhaoheping.com/t/') {
                    if (this.shortweb.slice(0, this.length) == this.host) {
                        // 匹配成功
                        this.ifgreen2 = true
                        this.iferr2 = false
                    } else {
                        //  匹配失败
                        this.ifgreen2 = false
                    }
                } else {
                    //  匹配失败
                    this.ifgreen2 = false
                }
            }
        },
        methods: {
            fn1() {
                if (!this.longweb) {
                    this.errmsg = '请输入内容勿留空';
                    this.iferr = true
                } else {
                    if (!this.ifgreen) {
                        this.errmsg = 'url格式不正确，请加上协议，如：http://www.zhaoheping.com或https://www.zhaoheping.com'
                        this.iferr = true
                    } else {
                        this.iferr = false;
                        createShorturl({
                            'lurl': this.longweb
                        }).then(res => {
                            console.log(res)
                            this.success_short_url = this.host + res.data.data
                        }).catch(err => {
                            console.log(err)
                        })
                    }
                }
            },
            copy() {
                let x = this.$refs.webcopy;
                console.log(x)
                x.select()
                document.execCommand('copy')
                this.$Message.success('复制成功')
            },
            fn2() {
                if (this.ifgreen2) {
                    //验证成功发送请求
                    this.iferr2 = false;
                    if (this.shortweb.length > 24) {
                        this.shortweb = this.shortweb.slice(this.length)
                    }
                    getLongurl({
                        arg: this.shortweb
                    }).then(res => {
                        if (res.data.code == 1) {
                            this.stl = res.data.data
                        } else {
                            this.errmsg2 = '您输入的短网址不存在，请重新输入';
                            this.iferr2 = true;
                            this.stl = ''
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                } else {
                    this.iferr2 = true
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    #dlj {
        max-width: 960px;
        margin: 0 auto;
        top: 20vh;
        position: relative;
        height: 50vh;
        padding: 20px 15px;

        h1 {
            text-align: center;
            color: rebeccapurple;
            margin-bottom: 15px;
            font-size: 3rem;
        }
    }

    /deep/ .ivu-tabs-mini .ivu-tabs-tab {
        font-size: 1.5rem;
    }

    .ivu-alert-success {
        margin-top: 20px;
        clear: both;
        line-height: 15px;
        height: 32px;

        a {
            float: left;
        }

        span {
            float: right;
            cursor: pointer;
        }

        span:hover {
            color: rebeccapurple;
        }

    }

    .ivu-alert-error {
        margin-top: 20px;
    }

    /deep/ .greeninput .ivu-input {
        color: green !important;
    }
</style>
