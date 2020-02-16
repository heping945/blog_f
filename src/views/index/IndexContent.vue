<template>
    <div class="indexcontent p-container commonpositiontop">
        <Row>
            <Col :xs="24" :sm="24" :md="24" :lg="18">
                <div class="indexpost">
                    <Card :bordered="true">
                        <p>
              <span>
                <router-link :to="{name:'index',query:{sort:'oldest'}}" @click.native="sort">最旧</router-link>
              </span>
                            &nbsp;| &nbsp;
                            <router-link :to="{name:'index',query:{sort:'mod'}}" @click.native="sort">更新</router-link>
                            &nbsp;| &nbsp;
                            <router-link :to="{name:'index',query:{sort:'popular'}}" @click.native="sort">热门
                            </router-link>
                        </p>
                    </Card>
                    <div id="postlist">
                        <IndexPostList ref="postList"></IndexPostList>
                    </div>

                </div>
            </Col>

            <Col :xs="0" :sm="0" :md="0" :lg="6">
                <SideBarRight></SideBarRight>
            </Col>

        </Row>
        <!--    反馈和toTop-->
        <SuspensionPanel></SuspensionPanel>
    </div>
</template>

<script>
    import SuspensionPanel from '@/components/utils/SuspensionPanel'
    import SideBarRight from '@/components//utils/SideBarRight'
    import IndexPostList from '@/components/index/IndexPostList'

    export default {
        name: "IndexContent",
        data() {
            return {}
        },
        components: {
            SuspensionPanel,
            IndexPostList,
            SideBarRight
        },
        mounted() {
            var _screenwidth = document.body.offsetWidth;
            this.screenwidth = _screenwidth
            console.log(this.screenwidth)
        },
        methods: {
            sort() {
                this.$refs.postList.initIndexPost()
            },
        }
    }
</script>

<style lang="scss" scoped>

    @media (min-width: 992px) {
        .indexpost {
            padding-right: 20px;
        }
    }

    .indexcontent {
        height: 100%;

        .indexpost {
            span {
                font-size: 14px;
            }
        }
    }

    @media (max-width: 576px) {
        /deep/ .ivu-card-body {
            background: #F4F5F5
        }
    }
</style>
