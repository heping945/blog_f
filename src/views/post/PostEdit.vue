<template>
    <div id="postedit" class="commonpositiontop p-container" ref="postedit">
        <Row>
            <Col :xs="24" :sm="24" :md="0" :lg="0">
                <Card>
                    <div style="text-align:center">
                        <h3 style="font-size: 2rem">此设备不支持编辑文章请更换大设备</h3>
                        <br>
                        <img src="@/assets/img/pikapi.gif" alt="皮卡丘" style="width:100%;height:auto;">
                        <br>
                        <br>
                        <p>
                            <Button type="primary" @click="back">倒退</Button>
                        </p>
                    </div>
                </Card>
            </Col>
            <Col :xs="0" :sm="0" :md="24" :lg="24">
                <Form :model="post" ref="post" :rules="ruleValidate">
                    <FormItem prop="title">
                        <Input v-model.trim="post.title" placeholder="请输入文章标题..." clearable required
                               :maxlength='64'></Input>
                    </FormItem>
                    <FormItem prop="body_md">
                        <article>
                            <mavon-editor v-model="post.body_md" fontSize="18px" :codeStyle="post.codestyle"
                                          :boxShadow="false"
                                          @fullScreen="changezindex" :tabSize="4" @change="change_render_value"
                                          ref=md @imgAdd="$imgAdd" @imgDel="$imgDel"/>
                        </article>
                    </FormItem>
                    <FormItem prop="codestyle">
                        <Select v-model="post.codestyle" placeholder="请选择代码风格">
                            <Option v-for="(item,index) in codestylelist" :value="item" :key="index">{{ item}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="category">
                        <Select v-model="category.id" placeholder="请选择文章分类">
                            <Option v-for="item in categoryList" :value="item.id" :key="item.id">{{ item.name }}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="tag">
                        <Select v-model="tagseleted" multiple :max-tag-count="4" placeholder="请选择文章标签">
                            <Option v-for="item in tagList" :value="item.id" :key="item.value">{{ item.name }}</Option>
                        </Select>
                    </FormItem>

                    <p style="margin: -15px 0 15px">
                        <Button @click="addtag" long>没有标签？点击增加标签</Button>
                    </p>


                    <FormItem prop="can_comment" label="是否开启评论">
                        <i-switch v-model="post.can_comment" size="large">
                            <span slot="open">On</span>
                            <span slot="close">Off</span>
                        </i-switch>
                    </FormItem>
                    <FormItem label="是否来自转载">
                        <i-switch v-model="post.reproduce" size="large">
                            <span slot="open">On</span>
                            <span slot="close">Off</span>
                        </i-switch>
                    </FormItem>

                    <FormItem prop="url" v-if="post.reproduce">
                        <Input type="url" v-model="post.reproduce_source" clearable placeholder="请输入转载来源地址">
                            {{post.reproduce_source}}
                        </Input>
                    </FormItem>
                    <FormItem prop="url" v-else>
                        <Input type="url" v-model="post.reproduce_source" disabled clearable placeholder="请输入转载来源地址">
                        </Input>
                    </FormItem>
                    <Button type="primary" @click="updatepost('post')" long :disabled="isDisable">更新文章</Button>
                </Form>
            </Col>
        </Row>
        <SuspensionPanel></SuspensionPanel>
    </div>
</template>

<script>
    const SuspensionPanel = () => import('@/components/utils/SuspensionPanel')
    import data from '@/assets/json/codestyle';
    import {getcategorylist, getPostDetail, updatePost, gettaglist, createTag, postimgupload} from '../../services/api'
    import authenticate from '../../assets/js/authenticate'
    import storage from '../../assets/js/storage'


    export default {
        name: "PostEdit",
        data() {
            return {
                defaultData: "edit",
                isDisable: false,
                codestylelist: [],
                postdatail: {},
                categoryList: [],
                author: '',
                category: [],
                tagvalue: '',
                tagseleted: [],
                tagList: [],
                tag: [],
                img_file: {},
                post: {
                    title: '',
                    body: '',
                    body_md: "",
                    category: '',
                    codestyle: '',
                    tags: [],
                    reproduce: false,
                    reproduce_source: '',
                    can_comment: true,
                },
                ruleValidate: {
                    title: [
                        {required: true, message: '请输入标题', trigger: 'blur'}
                    ],
                    body_md: [
                        {required: true, message: '正文不能为空', trigger: 'blur'}
                    ],
                },
                ifauthor: false
            }
        },
        components: {
            SuspensionPanel
        },
        computed: {
            transdatapost() {
                this.post['id'] = this.$route.params.id;
                this.post.category = this.category.id;
                this.post.tags = this.tagseleted;
                if (!this.post.reproduce) {
                    this.post.reproduce_source = null
                }
                return this.post;
            },
            codeStyle() {
                return data.codestyle
            }
            ,
        },

        async created() {
            this.initpostdata()
            this.initcategorydata();
            this.inittagdata();
            this.codestylelist = this.codeStyle;
        },
        methods: {
            // 初始化 文章详情数据
            initpostdata() {
                getPostDetail(
                    {id: this.$route.params.id}
                ).then(
                    res => {
                        console.log('res', res)
                        this.postdatail = res.data
                        this.author = this.postdatail.author.username;
                        //权限认证
                        this.verifyauth()
                        this.post.body = this.postdatail.body
                        this.post.body_md = this.postdatail.body_md
                        this.post.title = this.postdatail.title
                        this.post.codestyle = this.postdatail.codestyle
                        this.category = this.postdatail.category
                        //   从 列表对象获得一个新的可用的  数组列表
                        var newtag = []
                        for (var item of this.postdatail.tags) {
                            newtag.push(item.id)
                        }
                        this.tagseleted = newtag
                        //
                        this.post.reproduce = this.postdatail.reproduce
                        this.post.reproduce_source = this.postdatail.reproduce_source
                        this.post.can_comment = this.postdatail.can_comment
                        console.log('hello world', this.post)
                    }
                ).catch(
                    err => {
                        this.$router.push({name: 'index'})
                    }
                )
            },
            // 初始化 分类数据
            initcategorydata() {
                getcategorylist({}).then(res => {
                    this.categoryList = res.data.results
                    console.log('this.categoryList--->', this.categoryList);
                }).catch(err => {
                    console.log(err)
                })
            },
            // 初始化 标签数据
            inittagdata() {
                gettaglist({}).then(res => {
                    this.tagList = res.data.results
                    console.log(res);
                }).catch(err => {
                    console.log(err)
                })
            },
            //验证权限
            verifyauth() {
                let aname = this.author
                if (authenticate.ifCurrentUser(aname)) {
                } else {
                    this.$router.push({name: 'index'})
                }
            },
            // 绑定@imgAdd event
            $imgAdd(pos, $file) {
                // 第一步.将图片上传到服务器.
                // 缓存图片信息
                this.img_file[pos] = $file;
                var formdata = new FormData();
                formdata.append('img', $file);
                postimgupload(formdata).then((url) => {
                    // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
                    /**
                     * $vm 指为mavonEditor实例，可以通过如下两种方式获取
                     * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
                     * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
                     */
                    //   alert(1)
                    // console.log(url)
                    this.$refs.md.$img2Url(pos, url.data.img);
                    // $vm.$img2Url(pos, url.data.img);
                }).catch(err => {
                    console.log(err.response)
                    this.$Message.error('格式或类型错误，请重新上传')
                })
            },
            $imgDel(pos) {
                delete this.img_file[pos];
            },
            // 提交文章   包含数据验证
            updatepost() {
                this.$refs.post.validate((valid) => {
                    if (valid) {
                        // 验证成功, 发送数据
                        console.log('现在的数据', this.transdatapost);
                        {
                            updatePost(
                                this.transdatapost
                            ).then(res => {
                                console.log('res----------------', res);
                                this.$Message.info({
                                    content: '文章更新成功,1s后返回文章页面',
                                    duration: 1
                                });
                                this.isDisable = true;
                                setTimeout(() => {
                                    this.$router.push({name: 'postdetail', params: {id: res.data.id}})
                                }, 1000);
                            }).catch(err => {
                                console.log(err.response)
                                var e = err.response.data
                                let errmsg = Object.values(e)[0][0]
                                this.$Message.error(errmsg);
                            })
                        }
                    } else {
                        this.$Message.error('请检查文章字段验证！!！');
                    }
                })
            },
            // 保存postvalue本地存储
            saveMavon(value, render) {
                storage.set('currentpost', value);
                var v = storage.get('currentpost');
                console.log(v)
                this.post.body = render;
                this.post.body_md = value;
            },
            // body,body_md 内容改变时的render值
            change_render_value(value, render) {
                this.post.body = render;
            },
            //  小屏幕下  返回上页
            back() {
                // window.history.back()
                this.$router.go(-1)
            },
            // 改变全屏状态下zindex使覆盖导航条
            changezindex(status, value) {
                if (status) {
                    this.$refs.postedit.style.zIndex = 260
                } else {
                    this.$refs.postedit.style.zIndex = 234
                }
            },
            // 增加标签
            addtag() {
                this.$Modal.confirm({
                    render: (h) => {
                        return h('Input', {
                            props: {
                                value: this.tagvalue,
                                autofocus: true,
                                placeholder: '请输入标签名字...',
                                clearable: true,
                                required: true,
                                maxlength: 12
                            },
                            on: {
                                input: (val) => {
                                    this.tagvalue = val;
                                }
                            },
                        })
                    },
                    onOk: () => {
                        if (this.tagvalue) {
                            createTag({
                                name: this.tagvalue
                            }).then(res => {
                                this.$Message.success("标签:" + res.data.name + "创建成功")
                                this.tagList.unshift(res.data)
                            }).catch(err => {
                                this.$Message.error(err.response.data.name[0])
                            })
                        } else {
                            this.$Message.warning("输入内容不可为空")
                        }

                    },
                    onCancel: () => {
                        // this.$Message.info('Clicked cancel');
                    }
                })
            }
        }
    }
</script>

<style scoped>
    #postedit {
        z-index: 234;
    }
</style>
