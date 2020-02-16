<template>
  <div class="commonpositiontop scindex">
    <div id="chaptersummary">
      <Card :style="{'margin-left':(collAndshadow?'-320px':0)}">
        <Alert type="warning" v-if="subject.reproduce" show-icon>
          <b style="font-weight: bolder;color: indianred">原载于
            <a :href="subject.reproduce_source" target="_Blank">
              <Icon type="ios-undo-outline" color="orange"/>
            </a>,仅供个人学习，请勿转发商用</b>
        </Alert>
        <Timeline>
          <TimelineItem  :color="item.id==$route.params.id?'red':'green'" v-for="item in summary" :key="item.id" @click.native="changechapter(item.id)"
                        :class="{'active':item.id==$route.params.id}">
            {{item.title}}
          </TimelineItem>
        </Timeline>
      </Card>
    </div>
    <Row>
      <Col :xs="0" :sm="0" :md="0" :lg="24">
        <!--        电脑设备-->
        <div class="chaptercontent" :style="{'margin-left':(collAndshadow?'0':'320px')}">
          <Card>
            <h3>{{chapter.title}}


            </h3>
            <mavon-editor v-model="chapter.md_body" :codeStyle="cs" :boxShadow="false"
                          :toolbarsFlag="false" ref="md" :subfield="false" defaultOpen="preview"/>

          </Card>
        </div>
      </Col>
      <!--      移动设备-->
      <Col :xs="24" :sm="24" :md="24" :lg="0">
        <div class="chaptercontent">
          <Card>
            <h3>
              {{chapter.title}}</h3>
            <mavon-editor v-model="chapter.md_body" :codeStyle="cs" :boxShadow="false"
                          :toolbarsFlag="false" ref="md" :subfield="false" defaultOpen="preview"/>

          </Card>
        </div>
      </Col>
    </Row>
    <!--    shadow遮罩层-->
    <div :class="{shadow:true,ifdisplay:collAndshadow} " @click="setcollAndshadow"></div>
    <SuspensionPanel></SuspensionPanel>
  </div>
</template>

<script>
  const SuspensionPanel = () => import('@/components/utils/SuspensionPanel')
  import {mapState, mapActions} from 'vuex'
  import {getChapterSummary,getSubjectDetail,getChapter} from '@/services/api'


  export default {
    name: "SubjectContent",
    components: {
      SuspensionPanel
    },
    data() {
      return {
        coll: true,
        ifdisplay: true,
        summary: [],
        cs: '',
        subject: {},
        chapter: {},
        value: 'hello world',
      }
    },
    mounted() {
      console.log(this.$route.params);
      this.$Spin.show();
      this.initsubjectdetail()
      this.initsubjectsummary();
      this.initchapterdetail()
    },
    computed: {
      ...mapState({
        can_scroll: 'can_scroll',
        collAndshadow: 'collAndshadow',
      })
    },
    methods: {
      ...mapActions(['SetSubject', 'setcollAndshadow']),
      changechapter(a) {
        let id = this.$route.params.id;
        let title = this.$route.params.title
        let _screenwidth = document.body.offsetWidth;
        console.log(_screenwidth)
        console.log(a, id, title, 666)
        if (a != id) {
          this.$router.push({name: 'subjectcontent', params: {title: title, id: a}});
          this.initchapterdetail()
        } else {
        }
        ;
        if (_screenwidth < 800) {
          this.setcollAndshadow()
        }
      },
      //初始化专题章节列表
      initsubjectsummary() {
        let title = this.$route.params.title
        getChapterSummary({topic__urltag: title}).then(res => {
          console.log(res);
          this.summary = res.data.results
        }).catch(err => {
          console.log(err.response)
        })
      },
      //初始化章节详情
      initchapterdetail() {
        let id = this.$route.params.id
        getChapter({id: id}).then(res => {
          this.chapter = res.data;
          this.cs = res.data.topic.codestyle
          console.log(this.chapter);
          console.log(this.cs);
          //如果文章id对应的主题urltag不对，即url不对，依然返回404
          if (res.data.topic.urltag == this.$route.params.title) {
            this.SetSubject({title: this.chapter.topic.title});
            this.$Spin.hide();
          } else {
            this.$Spin.hide();
            this.$router.push({name: 'notFound'})
          }
        }).catch(err => {
          // 返回首页
          this.$Spin.hide();
          console.log(err.response)
          this.$router.push({name: 'notFound'})
        })
      },
      initsubjectdetail() {
        getSubjectDetail({urltag: this.$route.params.title}).then(res => {
          console.log(res);
          this.subject = res.data
        }).catch(err => {
          console.log(err)
        })
      }
    },
  }
</script>

<style scoped lang="scss">
  /*遮罩层*/
  .shadow {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: -20px;
    z-index: 1999;
    background-color: #000;
    opacity: 0.6;
  }

  /*大于此尺寸的设备都将关闭遮罩层*/
  @media (min-width: 800px) {
    .shadow {
      width: 0;
      height: 0;
    }
  }

  .ifdisplay {
    display: none;
  }

  /*大屏设备目录固定尺寸*/
  #chaptersummary .ivu-card {
    position: fixed;
    top: 60px;
    left: 0;
    height: 100%;
    border: none;
    width: 320px;
    z-index: 2000;
    overflow: auto;
    padding-bottom: 50px;
    cursor: default;
  }

  /*移动端尺寸*/
  @media (max-width: 576px) {
    #chaptersummary .ivu-card {
      top: 50px;
      width: 220px;
    }
  }

  .scindex {
    z-index: 240;
  }

  /*内容区*/
  .chaptercontent .ivu-card {
    /*800太小调成940好一点*/
    max-width: 940px;
    margin: 0 auto;
    width: 100%;
    /*padding: 4px 20px 24px;*/
    /*padding: 4px 10px 24px;*/
    box-shadow: 1px 1px 8px rgba(0, 0, 0, .15);
    border-radius: 2px;
    box-sizing: border-box;
    background: #fbfbfb;

    h3 {
      font-size: 2.5rem;
      margin: 1.6rem 0;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  /deep/ .v-note-wrapper .v-note-panel .v-note-show .v-show-content, .v-note-wrapper .v-note-panel .v-note-show .v-show-content-html {
    padding: 0 0;
  }

  /deep/ .ivu-timeline-item-content {
    cursor: pointer;
  }

  /*  alert覆盖*/
  .ivu-alert.ivu-alert-with-icon {
    padding: 8px 28px 8px 38px;
  }

  .active {
    color: red;
  }
</style>
