<template>
    <div>
        <Table border :columns="columns" :data="wrapperdata" v-if="wrapperdata.length"></Table>
        <Alert type="warning" v-else>暂时没有发表的文章</Alert>
    </div>
</template>

<script>
    import {getIndexPost, deletePost} from '@/services/api'

    export default {
        name: "Post",
        inject: ['reload'],
        data() {
            return {
                columns: [
                    {
                        title: '标题',
                        key: 'title',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'person'
                                    }
                                }),
                                h('strong', params.row.title)
                            ]);
                        }
                    },
                    {
                        title: '更新时间',
                        key: 'mod_date'
                    },
                    {
                        title: '分类',
                        key: 'category'
                    },
                    {
                        title: 'Action',
                        key: 'action',
                        maxWidth: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.edit(params.row.id)
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index, params.row.id)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                resdata: []
            }
        },
        created() {
            this.initdata()

        },
        computed: {
            wrapperdata() {
                let _d = this.resdata.map(
                    item => {
                        return {
                            title: item['title'],
                            mod_date: item['mod_date'],
                            category: item['category'],
                            id: item['id'],
                        }
                    }
                );
                return _d
            }
        },
        methods: {
            async initdata() {
                const cur_user = this.$store.state.userinfo.username
                let data = await getIndexPost({author__username: cur_user})
                this.resdata = data.data.results
                console.log(this.resdata, 1111111111111111111)
            },
            edit(id) {
                let routeUrl = this.$router.resolve({
                    name: 'PostEdit',
                    params: {id: id}
                });
                window.open(routeUrl.href, '_blank');
            },
            remove(index, id) {
                this.$Modal.confirm({
                    title: '删除所选文章',
                    content: '<strong>是否确认删除此文章</strong>',
                    onOk: () => {
                        // this.$Message.info('Clicked ok');
                        deletePost({id: id}).then(res => {
                            setTimeout(() => {
                                //刷新页面直接重载，不用$router.push('/login')因为当前页不会重载会继续注册页面
                                this.$Message.info('删除成功');
                                this.reload()
                            }, 800);
                        }).catch(err => {
                            this.$Message.error('删除失败');
                        })
                    },
                    onCancel: () => {
                    }
                });
            },
        }
    }
</script>

<style scoped>

</style>
