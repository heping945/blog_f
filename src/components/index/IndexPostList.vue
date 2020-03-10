<template>
    <div id="indexpostlist">
        <!--        <div v-for="item in postlist" :key="item.id">-->
        <Card :bordered="false">
            <!--            &lt;!&ndash;信息&ndash;&gt;-->
            <!--            <div class="media-list">-->
            <!--              {{item.author}}·-->
            <!--      <span v-if="$route.query.sort!='mod'">{{handleDate(item.create_date)}}</span>-->
            <!--      <span v-else>{{handleDate(item.mod_date)}}</span>-->
            <!--              ·{{item.archive}}-->
            <!--            </div>-->
            <!--            &lt;!&ndash;标题&ndash;&gt;-->
            <!--            <div class="title">-->
            <!--              <router-link :to="'/post/'+item.id">{{item.title}}</router-link>-->
            <!--            </div>-->
            <!--            &lt;!&ndash;操作列表&ndash;&gt;-->
            <!--            <div class="action-list">-->
            <!--              <ButtonGroup size="small">-->
            <!--                <Button icon="ios-thumbs-up" disabled>{{item.upvote_count}}</Button>-->
            <!--                <Button icon="md-chatbubbles" disabled>{{item.comment_count}}</Button>-->
            <!--                <Button icon="md-eye" disabled>{{item.views_count}}</Button>-->
            <!--              </ButtonGroup>-->
            <!--            </div>-->
            <Row>
                <Col :xs="0" :sm="0" :md="24" :lg="24">
                    <List item-layout="vertical">
                        <ListItem v-for="(item,index) in postlist" :key="item.id" @click.native="todetail(item)">
                            <ListItemMeta :avatar="item.author.avatar" :title="item.title"
                                          :description="item.excerpt|excerptshort"/>
                            <template slot="action">
                                <li>
                                    <Icon type="ios-thumbs-up"/>
                                    {{item.upvote_count}}
                                </li>
                                <li>
                                    <Icon type="md-chatbubbles"/>
                                    {{item.get_post_comment_count}}
                                </li>
                                <li>
                                    <Icon type="md-eye"/>
                                    {{item.views_count}}
                                </li>
                                <li v-if="$route.query.sort!='mod'">
                                    <Icon type="md-calendar"/>
                                    <!--                  {{item.create_date}}-->
                                    <!--                                    {{moment(item.create_date).fromNow()}}-->
                                    <TimeFromNow :time="item.create_date"></TimeFromNow>

                                </li>
                                <li v-else>
                                    <Icon type="md-calendar"/>
                                    <!--                  {{item.mod_date}}-->
                                    <!--                                    {{moment(item.mod_date).fromNow()}}-->
                                    <TimeFromNow :time="item.mod_date"></TimeFromNow>
                                </li>
                            </template>
                            <template slot="extra">
                                <!--                <img-->
                                <!--                  :src="img_url(index)"-->
                                <!--                  style="width: 280px;height: 140px">-->
                                <div style="width: 200px;height: 100px"></div>
                            </template>
                        </ListItem>
                    </List>
                </Col>
                <Col :xs="24" :sm="24" :md="0" :lg="0">
                    <List item-layout="vertical">
                        <ListItem v-for="item in postlist" :key="item.id" @click.native="todetail(item)">
                            <ListItemMeta :avatar="item.author.avatar" :title="item.title"/>
                            <template slot="action">
                                <li>
                                    <Icon type="ios-thumbs-up"/>
                                    {{item.upvote_count}}
                                </li>
                                <li>
                                    <Icon type="md-chatbubbles"/>
                                    {{item.comment_count}}
                                </li>
                                <li>
                                    <Icon type="md-eye"/>
                                    {{item.views_count}}
                                </li>
                                <li v-if="$route.query.sort!='mod'">
                                    <Icon type="md-calendar"/>
                                          <TimeFromNow :time="item.create_date"></TimeFromNow>
                                    <!--                  {{item.create_date}}-->
                                </li>
                                <li v-else>
                                    <Icon type="md-calendar"/>
                                     <TimeFromNow :time="item.mod_date"></TimeFromNow>
                                </li>
                            </template>
                        </ListItem>
                    </List>
                </Col>
            </Row>

        </Card>

        <LoadingSpain v-show="loadingspainflag"></LoadingSpain>
        <NoContent v-if="!next"></NoContent>
    </div>
</template>

<script>
    import {getIndexPost} from '../../services/api'
    import LoadingSpain from '../utils/LoadingSpain'
    import TimeFromNow from '@/components/TimeFromNow'
    import NoContent from '../utils/NoContent'
    import Axios from 'axios'

    export default {
        name: "IndexPostList",
        data() {
            return {
                postlist: [],
                loadingspainflag: false,
                tobottomonce: true,
                next: '',
                orderparams: {},
                imgurl: [
                    'http://dmimg.5054399.com/allimg/pkm/pk/22.jpg',
                    'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2961109585,707599822&fm=26&gp=0.jpg',
                    'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3437217665,1564280326&fm=26&gp=0.jpg',
                ],
            }
        },
        components: {
            LoadingSpain,
            NoContent,
            TimeFromNow
        },
        filters: {
            excerptshort(value) {
                return value.slice(0, 35) + '……'
            }
        },
        created() {
            // 初始化postlist
            this.initIndexPost();
        },
        mounted() {
            window.addEventListener('scroll', this.scrollHander)
        },
        destroyed() {
            window.removeEventListener('scroll', this.scrollHander)
        },
        computed: {
            sortquery() {
                let query_param = this.$route.query.sort;
                switch (query_param) {
                    case "oldest":
                        this.orderparams = {ordering: 'create_date'};
                        break;
                    case "popular":
                        this.orderparams = {ordering: '-views_count'};
                        break;
                    case "mod":
                        this.orderparams = {ordering: '-mod_date'};
                        break;
                }
                return this.orderparams
            },
        },
        methods: {
            async initIndexPost() {
                try {
                    let {data} = await getIndexPost(this.sortquery)
                    this.postlist = data.results;
                    this.next = data.next
                } catch (e) {
                    console.log(e)
                }
            },
            moment,
            //监视滚动条到底部的方法 ，
            scrollHander() {
                var scr = document.documentElement.scrollTop || document.body.scrollTop; // 向上滚动的那一部分高度
                var clientHeight = document.documentElement.clientHeight; // 屏幕高度也就是当前设备静态下你所看到的视觉高度
                var scrHeight = document.documentElement.scrollHeight || document.body.scrollHeight; // 整个网页的实际高度，兼容Pc端
                if (scr + clientHeight + 10 >= scrHeight) {
                    //  滚到底部
                    if (this.next && this.tobottomonce) {
                        //   到底部的时候，如果有next，loading出现，1s后开始发送请求，请求成功设置为false
                        this.loadingspainflag = true
                        this.$Loading.start();
                        this.tobottomonce = false
                        setTimeout(() => {
                            this.getmorepost()
                        }, 1000)
                    }
                } else {
                }
            },
            getmorepost() {
                Axios.get(this.next).then(res => {
                    this.next = res.data.next
                    this.postlist = this.postlist.concat(res.data.results)
                    this.tobottomonce = true
                    this.$Loading.finish();
                    this.loadingspainflag = false
                }).catch(err => {
                    console.log(err.response);
                    this.$Loading.error();
                })
            },
            img_url(id) {
                return this.imgurl[Math.floor(Math.random() * 10) + id]
            },
            todetail(item) {
                this.$router.push({name: 'postdetail', params: {id: item.id}})
            }
        }
    }
</script>

<style scoped>
    .media-list {
        color: #b2bac2;
        font-size: 1rem;
    }

    .title {
        margin: 6px 0 12px;
        font-size: 1.66rem;
        font-weight: 600;
        line-height: 1.2;
    }

    .ivu-list-item-action > li {
        cursor: default;
    }

    .ivu-list-item {
        cursor: pointer;
    }

    @media (max-width: 576px) {
        /deep/ .ivu-card-body {
            background: #F4F5F5
        }
    }

</style>
