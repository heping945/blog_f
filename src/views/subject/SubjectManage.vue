<template>
    <div class="commonpositiontop p-container" style="z-index: 199">
        <Row>
            <Col :xs="24" :sm="24" :md="0" :lg="0">
                <div style="text-align:center;padding: 100px 100px">
                    <h3 style="font-size: 2rem;color: rebeccapurple">此设备不支持编辑文章请更换大设备</h3>
                </div>
            </Col>
            <Col :xs="0" :sm="0" :md="24" :lg="24">
                <!--        大屏设备（平板，桌面）端显示-->
                <Select v-model="topicselect" style="width:100%" placeholder="请选择专题标题" @on-change="getsubjectsummary">
                    <Option v-for="item in subjectlist" :value="item.id" :key="item.id">{{ item.title }}</Option>
                </Select>
                <Alert type="success" style="margin-top: 20px" v-if="summary.length">
                    <List>
                        <ListItem v-for="item,index in summary" :key="item.id" @click.native="updatechapter(item)">
                            <b>{{saveInLocal+1}}</b>：&nbsp;&nbsp;<b style="color: #007fff">{{item.order}}</b>：&nbsp;&nbsp;<b
                                style="color: rebeccapurple">{{item.id}}</b>：&nbsp;&nbsp;{{item.title}}
                        </ListItem>
                    </List>
                </Alert>
                <Alert type="warning" style="margin-top: 20px">权限，顺序控制请联系管理</Alert>
                <Upload :action="url" :format="['md']" :data="uploaddata" name="md_File" :paste="true" :multiple="true"
                        accept=".md"
                        :on-success="getmd" :on-error="prerr" :headers="h" :before-upload="validatetopic">
                    <div style="padding: 10px 0">
                        <Button icon="ios-cloud-upload-outline" style="margin: 0 auto" title="只能选择md格式文件，可以多选" long>
                            上传md文件
                        </Button>
                    </div>

                </Upload>
            </Col>
        </Row>

        <Modal
                v-model="modal1"
                title="请输入更改信息"
                ok-text="更新"
                @on-ok="ok"
                @on-cancel="cancel">
            <!--      <p>-->
            <!--        <span style="width: 100px;font-weight: bolder;margin-right: 100px">title:</span><Input v-model="chaptertitle" placeholder="Enter something..." style="width: 300px"/>-->
            <!--      </p>-->
            <!--      <p>-->
            <!--       <span style="width: 100px;font-weight: bolder">order:</span><Input v-model="chapterorder" placeholder="Enter something..." style="width: 300px"/>-->

            <!--      </p>-->
            <Form :label-width="50">
                <FormItem label="标题">
                    <Input v-model.trim="chaptertitle" placeholder="Enter title..." :maxlength="64"></Input>
                </FormItem>
                <FormItem label="顺序">
                    <InputNumber :max="200" :min="0" v-model="chapterorder" placeholder="Enter order..."
                                 style="width: 100%"></InputNumber>
                </FormItem>
            </Form>

        </Modal>
    </div>
</template>

<script>
    import {getChapterSummary, getSubject, updateChapter} from '@/services/api'
    import {mapState} from 'vuex'


    export default {
        name: "SubjectManage",
        data() {
            return {
                header: {},
                subjectlist: [],
                topicselect: '',
                summary: [],
                modal1: false,
                value: '',
                chaptertitle: '',
                chapterorder: null,
                chapterid: null
            }
        },
        computed: {
            url() {
                return process.env.VUE_APP_BASE_URL + 'chapters/'
            },
            ...mapState({
                userinfo: 'userinfo',
            }),
            h() {
                let token = this.userinfo.token
                if (token) {
                    this.header['Authorization'] = 'JWT ' + token;
                    return this.header
                }
            },
            uploaddata() {
                var d = {}
                d['topic'] = this.topicselect
                return d
            }
        }
        ,
        created() {
            //初始化专题列表
            this.initsubjectlist()
        }
        ,
        methods: {
            initsubjectlist() {
                getSubject().then(res => {
                    this.subjectlist = res.data.results
                }).catch(err => {
                    console.log(err)
                })
            }
            ,
            getsubjectsummary(x) {
                getChapterSummary({topic: x}).then(res => {
                    console.log(res);
                    this.summary = res.data.results
                }).catch(err => {
                    console.log(err.response)
                })
            },
            //更改章节信息（顺序，标题）
            updatechapter(x) {
                console.log(x);
                this.chaptertitle = x.title;
                this.chapterorder = x.order;
                this.chapterid = x.id;
                this.modal1 = true
            },
            ok() {
                if (!this.chaptertitle || !this.chapterorder) {
                    this.$Message.warning('无效输入，请检查')
                } else {
                    updateChapter({
                        id: this.chapterid,
                        title: this.chaptertitle,
                        order: this.chapterorder
                    }).then(res => {
                        console.log(res)
                        console.log(this.summary)
                        //  操作数组（删除原来id的元素，在数组里按照新返回元素重新插入）
                        this.summary = this.summary.filter(i => {
                            //获得一个没有此元素的新列表
                            return i.id != this.chapterid
                        });
                        //查询是否有相同order
                        let r1 = this.summary.filter(i => {
                            return i.order == res.data.order
                        });
                        if (r1.length) {
                            //如果有  获得此元素的第一个的位置
                            let t = r1[0]
                            let ind = this.summary.indexOf(t)
                            this.summary.splice(ind, 0, res.data)
                            this.$Message.success('更新成功')
                        } else {
                            //  没有的话获得大于order第一个元素的位置
                            let tid = this.summary.indexOf(this.summary.filter(i => {
                                return i.order > res.data.order
                            })[0]);
                            console.log(tid);
                            //是否是最大的order
                            if (tid != -1) {
                                this.summary.splice(tid, 0, res.data)
                            } else {
                                this.summary.push(res.data)
                            }
                            this.$Message.success('更新成功')
                        }
                    }).catch(err => {
                        this.$Message.error('输入错误，请检查输入类型（order只能为正整数）')
                    })
                }

            },
            cancel() {
                // this.$Message.info('Clicked cancel');
            },
            //保留
            // uploadFile() {
            //   var img = this.$refs.img.files[0]
            //   var formdata = new FormData();
            //   formdata.append('img', img);
            //   // Axios({
            //   //   url: 'http://127.0.0.1:6655/api/v1/postimg/',
            //   //   method: 'post',
            //   //   data: formdata,
            //   //   headers: {'Content-Type': 'multipart/form-data'},
            //   postimgupload(formdata).then(res => {
            //     alert('success')
            //     console.log(res.data)
            //     this.xi = res.data.img
            //   }).catch(err => {
            //     console.log(err.response)
            //   })
            // },
            // getpost() {
            //   getIndexPost(
            //     {
            //       params: {
            //         'page': 2
            //       }
            //     }
            //   ).then(data => {
            //     this.postlist = data.data.results
            //   }).catch(err => {
            //     console.log('err.response', err.response);
            //   })
            // }
            // ,
            getmd(response, file, fileList) {
                console.log(response)
                console.log(response.id)
                let r = this.summary.filter(item => {
                    return item.id == response.id
                });
                if (r.length) {
                    this.$Notice.warning({
                        title: '请勿重复上传',
                        duration: 1
                    });
                } else {
                    this.$Notice.success({
                        title: '上传成功',
                        duration: 1
                    });
                    this.summary.push(response)
                }

                console.log(file)
                console.log(fileList)
                // this.value = response.md_body
            }
            ,
            prerr(error, file, fileList) {
                //打印错误
                this.$Message.error(file.detail);
            },
            validatetopic() {
                if (!this.topicselect) {
                    this.$Message.warning('请选择一个专题');
                    return false
                } else {
                    let user = this.userinfo.username
                    console.log(user)
                    if (user != 'heping') {
                        this.$Message.error('您没有权限!!!请联系管理员开通权限');
                        return false
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .ivu-icon {
        font-family: 'iconfont'
    }

    b {
        font-weight: bolder;
    }

    /*上传div变block*/
    /deep/ .ivu-upload-select {
        display: block;
    }

    /*列表指针*/
    .ivu-list-item {
        cursor: pointer;
    }
</style>
