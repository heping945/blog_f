<template>
  <div class="p-container commonpositiontop">
    <Row>
      <Col :xs="24" :sm="24" :md="24" :lg="18">
        <div class="allcontent">
          <Card>
            <Tabs value="cat" name="outab">
              <!--              分类 包括标签和专题-->
              <TabPane label="分类" name="cat" tab="outab">
                <Input placeholder="过滤......" v-model="tofilval" suffix="ios-funnel-outline"/>
                <Tabs value="cname" type="card" style="margin-top: 30px" name="subtab">
                  <!--                  分类-->
                  <TabPane label="分类" name="cname" tab="subtab">
                    <!--                    三级分类-->
                    <p>
                      <Tag :color="color[Math.floor(Math.random()*color.length)]" v-for="i in topcatlist" :key="i.id"
                           @click.native="selectc(i)">
                        {{i.name}}
                      </Tag>
                    </p>
                    <p>
                      <Tag :color="color[Math.floor(Math.random()*color.length)]" v-for="i in midcatlist" :key="i.id"
                           @click.native="selectc(i)">
                        {{i.name}}
                      </Tag>
                    </p>
                    <p>
                      <Tag :color="color[Math.floor(Math.random()*color.length)]" v-for="i in botcatlist" :key="i.id"
                           @click.native="selectc(i)">
                        {{i.name}}
                      </Tag>
                    </p>
                    <!--                    面包屑-->
                    <Breadcrumb separator=">" style="margin-top: 15px;font-weight: bolder"
                                v-show="Object.keys(catselected).length > 0">
                      <BreadcrumbItem v-if="catselected.parent_category">{{catselected.parent_category.name}}
                      </BreadcrumbItem>
                      <BreadcrumbItem>{{catselected.name}}</BreadcrumbItem>
                    </Breadcrumb>
                    <!--                    结果-->
                    <Alert type="success" style="margin-top: 20px" v-if="postres.length">
                      <List>
                        <ListItem v-for="item,index in postres" :key="item.id" @click.native="topost(item.id)">
                          <b style="color: #2b85e4">{{index+1}}</b>：&nbsp;&nbsp;{{item.title}}
                        </ListItem>
                      </List>
                    </Alert>
                    <!--                    分页-->
                    <div style="text-align: center;margin-bottom: 30px">
                      <Page :total="postcount" show-elevator v-show="postcount>10" @on-change="getnewr"/>
                    </div>

                  </TabPane>
                  <!--                  标签区-->
                  <TabPane label="标签" name="tname" tab="subtab">
                    <Badge :count="parseInt(i.get_post_count)" v-for="i in mattag" :key="i.id">
                      <Tag :color="color[Math.floor(Math.random()*color.length)]" @click.native="selectt(i)">
                        {{i.name}}
                      </Tag>
                    </Badge>
                    <Alert type="success" style="margin-top: 20px" v-if="postres2.length">
                      <List>
                        <ListItem v-for="item,index in postres2" :key="item.id" @click.native="topost(item.id)">
                          <b style="color: #2b85e4">{{index+1}}</b>：&nbsp;&nbsp;{{item.title}}
                        </ListItem>
                      </List>
                    </Alert>
                    <!--                    分页-->
                    <div style="text-align: center;margin-bottom: 30px">
                      <Page :total="postcount2" show-elevator v-show="postcount2>10" @on-change="getnewr2"/>
                    </div>

                  </TabPane>
                  <!--                  专题区-->
                  <TabPane label="专题" name="sname" tab="subtab">
                    <Alert type="success" style="margin-top: 20px" v-if="matsubject.length">
                      <List>
                        <ListItem v-for="item,index in matsubject" :key="item.id" @click.native="selects(item)">
                          <b style="color: #2b85e4;overflow: hidden">{{index+1}}：&nbsp;&nbsp;{{item.title}}</b>
                        </ListItem>
                      </List>
                    </Alert>

                  </TabPane>
                </Tabs>
              </TabPane>
              <TabPane label="归档" name="arc" tab="outab">功能开发中。。。</TabPane>
            </Tabs>

          </Card>
        </div>
      </Col>
      <Col :xs="0" :sm="0" :md="0" :lg="6">
        <SideBarRight></SideBarRight>
      </Col>
    </Row>
  </div>
</template>

<script>
  const SideBarRight = () => import('../../components/utils/SideBarRight')
  import {getCategory,gettaglist,getIndexPost,getSubject} from '@/services/api'
  export default {
    name: "ArchiveContent",
    components: {
      SideBarRight
    },
    data() {
      return {
        color: ['default', 'primary', 'success', 'warning',
          'error', 'blue', 'green', 'red', 'yellow', 'pink', 'magenta', 'volcano',
          'orange', 'gold', 'lime', 'cyan', 'geekblue', 'purple'],
        catlist: [],
        taglist: [],
        catselected: {},
        postres: [],
        postres2: [],
        subjectlist: [],
        tagselected: {},
        subselected: {},
        tofilval: '',
        postcount: null,
        postcount2: null,
      }
    },
    computed: {
      //忽略了大小写
      filval() {
        return this.tofilval.toLowerCase()
      },
      matcat() {
        return this.catlist.filter((item) => {
          return item.name.toLowerCase().match(this.filval)
        })
      },
      mattag() {
        return this.taglist.filter((item) => {
          return item.name.toLowerCase().match(this.filval)
        })
      },
      matsubject() {
        return this.subjectlist.filter((item) => {
          return item.title.toLowerCase().match(this.filval)
        })
      },
      topcatlist() {
        let r = this.matcat.filter(i => {
          return i.parent_category == null
        })
        return r
      },
      midcatlist() {
        let x = this.matcat.filter(i => {
          return i.parent_category != null
        })
        let y = x.filter(i => {
          return i.sub_cat.length > 0
        })
        return y
      },
      botcatlist() {
        let x = this.matcat.filter(i => {
          return i.parent_category != null
        })
        let y = x.filter(i => {
          return i.sub_cat.length == 0
        })
        return y
      },
    },
    created() {
      this.initcategory();
      this.inittag();
      this.initsubjectdata()
    },
    methods: {
      initcategory() {
        getCategory({}).then(res => {
          console.log(res);
          this.catlist = res.data.results
        })
      },
      inittag() {
        gettaglist({}).then(res => {
          console.log(res);
          this.taglist = res.data.results
        })
      },
      initsubjectdata() {
        getSubject().then(res => {
          this.subjectlist = res.data.results;
          console.log(this.subjectlist)
        }).catch(err => {
          console.log(err.response)
        })
      },
      //选中分类
      selectc(x) {
        console.log(x);
        //重复点击的优化
        if (x != this.catselected) {
          this.catselected = x;
          getIndexPost({top_category: x.id}).then(res => {
            console.log(res);
            this.postres = res.data.results;
            this.postcount = res.data.count
          }).catch(err => {
            console.log(err)
          })
        }
      },
      //选中标签
      selectt(x) {
        console.log(x);
        //重复点击的优化
        if (x != this.tagselected) {
          this.tagselected = x;
          getIndexPost({tags: x.id}).then(res => {
            console.log(res);
            this.postres2 = res.data.results
            this.postcount2 = res.data.count
          }).catch(err => {
            console.log(err)
          })
        }
      },
      //选中专题
      selects(x) {
        console.log(x);
        this.$router.push({name: 'subjectcontent', params: {title: x.urltag, id: x.get_first_id}})
      },
      topost(k) {
        this.$router.push({name: 'postdetail', params: {id: k}})
      },
      //分页切换发送请求显示结果
      getnewr(p) {
        console.log(p);
        getIndexPost({top_category: this.catselected.id, page: p}).then(res => {
          console.log(res);
          this.postres = res.data.results;
          this.postcount = res.data.count
        }).catch(err => {
          console.log(err)
        })
      },
            getnewr2(p) {
        console.log(p);
        getIndexPost({tags: this.tagselected.id, page: p}).then(res => {
          console.log(res);
          this.postres2 = res.data.results;
          this.postcount2 = res.data.count
        }).catch(err => {
          console.log(err)
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  @media (min-width: 992px) {
    .allcontent {
      padding-right: 20px;
    }
  }

  /*列表指针*/
  .ivu-list-item {
    cursor: pointer;
  }

  .ivu-badge {
    margin-right: 12px;
    margin-bottom: 12px;
  }
</style>
