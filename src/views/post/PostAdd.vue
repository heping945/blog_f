<template>
    <div id="postadd" class="commonpositiontop p-container" ref="postadd">
        <Row>
            <Col :xs="24" :sm="24" :md="0" :lg="0">
                <Card>
                    <div style="text-align:center">
                        <h3>此设备不支持创建文章请切换大设备</h3>
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
                            <mavon-editor v-model="post.body_md" :subfield="false" :defaultOpen="defaultData"
                                          :codeStyle="post.codestyle" :boxShadow="false" @fullScreen="changezindex"
                                          @save="saveMavon" @change="change_render_value" ref=md @imgAdd="$imgAdd"
                                          @imgDel="$imgDel"
                            />
                        </article>
                    </FormItem>
                    <FormItem prop="codestyle">
                        <Select v-model="post.codestyle" placeholder="请选择代码风格">
                            <Option v-for="(item,index) in codestylelist" :value="item" :key="index">{{ item}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="category">
                        <Select v-model="post.category" placeholder="请选择文章分类">
                            <Option v-for="item in categoryList" :value="item.id" :key="item.id">{{ item.name }}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="tag">
                        <Select v-model="post.tags" multiple :max-tag-count="4" placeholder="请选择文章标签">
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
                        </Input>
                    </FormItem>
                    <FormItem prop="url" v-else>
                        <Input type="url" v-model="post.reproduce_source" disabled clearable placeholder="请输入转载来源地址">
                        </Input>
                    </FormItem>
                    <Button type="primary" @click="addpost('post')" long :disabled="isDisable">创建文章</Button>
                </Form>
            </Col>
        </Row>
        <SuspensionPanel></SuspensionPanel>
    </div>
</template>

<script>

    const SuspensionPanel = () => import('@/components/utils/SuspensionPanel')
    import data from '../../../public/codestyle';
    import {getcategorylist,createPost,createTag,gettaglist,postimgupload} from '../../services/api'
    import storage from '../../assets/js/storage'

    export default {
        name: "PostAdd",
        data() {
            return {
                isDisable: false,
                defaultData: "edit",
                codestylelist: [],
                categoryList: [],
                tagvalue: '',
                tagseleted: [],
                tagList: [],
                img_file: {},
                post: {
                    title: '',
                    body: '',
                    body_md: "",
                    category: '',
                    codestyle: 'monokai',
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
                    category: [
                        // iview 验证数据类型为string  所以  number值要加 type:'number'
                        {required: true, message: '请选择分类', trigger: 'change', type: 'number'}
                    ],
                },
            }
        },
        components: {
            SuspensionPanel
        },
        computed: {
            codeStyle() {
                return data.codestyle
            }
            ,
        },
        created() {
            this.initcategorydata();
            this.inittagdata()
        },
        async mounted() {
            // let codestyle = await Axios.get('../../../public/codestyle.json')
            console.log(this.codeStyle, 'codestyle')
            this.codestylelist = this.codeStyle;
            let currentpost = storage.get('currentpost');
            console.log('currentpost---', currentpost)
            if (currentpost) {
                this.post.body_md = currentpost
            } else {
                return
            }
        },
        methods: {
            // 初始化 分类数据
            initcategorydata() {
                getcategorylist({}).then(res => {
                    this.categoryList = res.data.results
                    console.log(res.data, 'test1111111111111')
                }).catch(err => {
                    console.log(err)
                })
            },
            //初始化标签数据
            inittagdata() {
                gettaglist({}).then(res => {
                    this.tagList = res.data.results
                    console.log(res.data, 'test22222222222222222')
                }).catch(err => {
                    console.log(err)
                })
            },
            // 提交文章   包含数据验证
            addpost() {
                this.isDisable = true
                setTimeout(() => {
                    this.isDisable = false
                }, 1000);
                this.$refs.post.validate((valid) => {
                    if (valid) {
                        // 验证成功, 发送数据
                        // this.$Message.success('Success!');
                        {
                            createPost(
                                this.post
                            ).then(res => {
                                this.$Message.info({
                                    content: '文章添加成功,1s后返回文章页面',
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
            // 保存postvalue本地存储
            saveMavon(value, render) {

                storage.set('currentpost', value);
                this.post.body = render;
                this.post.body_md = value;
            },
            // body,body_md 内容改变时的render值
            change_render_value(value, render) {
                this.post.body = render;
            },
            // 改变全屏状态下zindex使覆盖导航条
            changezindex(status, value) {
                if (status) {
                    this.$refs.postadd.style.zIndex = 260
                } else {
                    this.$refs.postadd.style.zIndex = 234
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
                                maxlength: 12,
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
                            // alert(this.tagvalue);
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
            },
            back() {
                window.history.back()
            },
        }

    }
</script>

<style scoped>
    #postadd {
        z-index: 234;

    }

    ol, ul {
        list-style-type: disc !important;
    }

</style>
