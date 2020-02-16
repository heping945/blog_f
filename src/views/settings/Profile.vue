<template>
    <div id="uprofile">
        <h1>个人资料</h1>

        <List size="large">
            <ListItem style="min-height: 100px">
                <Col :xs="24" :sm="3">头像</Col>
                <Col :xs="24" :sm="21">
                    <Avatar shape="square" :src="avatar" size="large"/>
                </Col>
            </ListItem>
            <ListItem v-for="i in l" :key="i.id" @click.native="updatepf(i)">
                <Row :gutter="16">
                    <Col :xs="24" :sm="3">{{i.label}}</Col>
                    <Col :xs="18" :sm="17">
                        <Input v-model.trim="i.value" v-if="i.title!='gender'"/>
                        <Select v-model="i.value" v-else style="width:100px">
                            <Option v-for="item in gender_list" :value="item.value" :key="item.value">{{ item.label }}
                            </Option>
                        </Select></Col>
                    <Col :xs="6" :sm="4" @click.native.stop class="esc"><span style="color: blue" v-if="i.ifedit"
                                                                              @click="edit(i)"><Icon type="ios-brush"/>编辑</span>
                        <span v-else><span style="color: #2b85e4" @click="save(i)">保存</span> &nbsp;<span
                                style="color: #dcd9d9"
                                @click="cancel(i)">取消</span></span>
                    </Col>
                </Row>
            </ListItem>
        </List>
    </div>
</template>

<script>
    import {getProfile, updateProfile} from '@/services/api'
    import {mapState,} from 'vuex'

    export default {
        name: "Profile",
        data() {
            return {
                ifedit: true,
                l: [
                    {title: 'nickname', value: '', id: 1, label: '昵称', ifedit: true, oriv: null},
                    {title: 'desc', value: '', id: 2, label: '描述', ifedit: true, oriv: null},
                    {title: 'headline', value: '', id: 3, label: '简介', ifedit: true, oriv: null},
                    {title: 'gender', value: '', id: 4, label: '性别', ifedit: true, oriv: null},
                    {title: 'address', value: '', id: 5, label: '地址', ifedit: true, oriv: null},
                ],
                avatar: null,
                gender_list: [
                    {value: -1, label: '未知'},
                    {value: 1, label: '男'},
                    {value: 0, label: '女'},
                ]
            }
        },
        computed: {
            ...mapState({
                userinfo: 'userinfo',
            })
        },
        created() {
            this.inituserprofile()
        },
        methods: {
            inituserprofile() {
                const username = this.userinfo.username;
                getProfile({username: username}).then(res => {
                    this.l.map(i => i.value = res.data[i.title])
                    this.l.map(i => i.oriv = res.data[i.title])
                    console.log(res)
                    this.avatar = res.data.avatar
                }).catch(err => {
                    console.log(err)
                })
            },
            updatepf(i) {
                console.log(i);
                i.ifedit = false
            },
            edit(i) {
                i.ifedit = false
            },
            save(i) {
                let username = this.userinfo.username
                let k = i.title
                let v = i.value
                let l = i.label
                let d = {username: username}
                d[k] = v
                console.log('value', i.value, 'oriv', i.oriv)
                if (i.oriv == null) {
                    //
                    if (i.value == null) {
                        //  不执行操作
                    } else {
                        //  执行请求
                        updateProfile(d).then(res => {
                            console.log(res);
                            // this.l.filter(i=>i.title==k).map(i=>i.value==v)
                            this.$Notice.success({
                                title: l + '更新成功',
                                duration: 1
                            });
                            i.oriv = v
                            i.ifedit = true
                        }).catch(err => {
                            console.log(err)
                        })
                    }
                } else {
                    if (i.oriv != i.value) {
                        //  执行请求
                        updateProfile(d).then(res => {
                            console.log(res)
                            this.$Notice.success({
                                title: l + '更新成功',
                                duration: 1
                            });
                            i.oriv = v
                            i.ifedit = true
                            console.log(k)
                        }).catch(err => {
                            console.log(err)
                        })
                    } else {
                        //  不执行操作
                    }
                }
            },
            cancel(i) {
                i.value = i.oriv
                i.ifedit = true
            }
        }
    }
</script>

<style scoped lang="scss">
    #uprofile {
        /*font-size: 18px;*/
        /deep/ .ivu-row {
            line-height: 32px;
        }

        h1 {
            font-size: 30px;
            font-weight: bold;
            padding: 16px 0;
            border-bottom: 1px solid #F4F5F5;
        }

        .ivu-list-item {
            display: block;
        }

        /*.ivu-col-span-xs-24 {*/
        /*  margin-bottom: 15px;*/
        /*}*/

        .ivu-col-span-sm-4 {
            margin-bottom: 0;
        }

        .ivu-col-span-sm-4 {
            text-align: right;
        }

        /deep/ .ivu-input {
            border: none;
            outline: none;
            padding: 0 0;
            font-size: 16px;
        }

        .esc {
            span {
                cursor: pointer;
            }
        }

        @media (max-width: 360px) {
            .ivu-col-span-xs-6 {
                width: 25%;
            }
        ;
        }
    }


</style>
