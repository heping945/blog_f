<template>
  <div id="catlog">
    <div style="position: fixed;top: 100px;" v-if="catlog.length">
      <Anchor show-ink>
        <div v-for="item,index in newcatlog">
          <AnchorLink :href="'#'+item.id" :title="item.title" v-if="item.tag===catlog[0].tag">
            <template v-for="it,i in newcatlog.slice(index+1,n(newcatlog,'tag',item.tag,index)) ">
              <AnchorLink :href="'#'+it.id" :title="it.title"/>
            </template>
          </AnchorLink>
        </div>

        <!--        <div v-for="item,index in newcatlog">-->
        <!--          <AnchorLink :href="'#'+item.id" :title="item.title" v-if="item.tag===catlog[0].tag">-->
        <!--            <template v-for="it,i in newcatlog.slice(index+1,n(newcatlog,'tag',item.tag,index)) ">-->
        <!--              <AnchorLink :href="'#'+it.id" :title="it.title" v-if="it.tag===catlog[index+1].tag">-->
        <!--                <template v-for="s in newcatlog.slice(i+2,10) ">-->
        <!--                  <AnchorLink :href="'#'+s.id" :title="s.title"/>-->
        <!--                </template>-->
        <!--              </AnchorLink>-->
        <!--            </template>-->
        <!--          </AnchorLink>-->
        <!--        </div>-->
      </Anchor>
    </div>
  </div>
</template>

<script>
  import {getnewlist, findallitem} from '../../assets/js/util'

  export default {
    name: "CatLog",
    data() {
      return {
        l: []
      }
    },
    props: {
      catlog: {
        type: Array,
        default: () => [],
      },
    },
    // watch: {   // 使用监听的方式，监听数据的变化
    //   catlog(val) {
    //     this.l = val;
    //   }
    // },
    computed: {
      newcatlog() {
        // if (this.l.length) {
        //   let basetag = l[0].tag
        return this.catlog

        // }
      },
      nexti() {
        if (this.catlog.length) {

        }
      },
      basetagl() {
        if (this.catlog.length) {
          let b = l[0].tag;
          let tagl = []
          l.forEach((v, l) => {
            if (v == b) {
              tagl.push(v)
            }
          })
          return tagl
        }
      }
    },
    mounted() {
      // console.log(this.findallitem([1, 2, 3, 1, 4, 1, 4, 1], 1))
      // console.log(this.getnewlist([{'id': 1, 'name': 'jack'}, {'id': 2, 'name': 'rose'}, {
      //   'id': 2,
      //   'name': 'jack'
      // },], 'id'))
    },
    methods: {
      getnewlist,
      findallitem,
      n(a, k, tag, i) {
        let taglist = this.getnewlist(a, k);   //返回一个tag数组
        let tagindexlist = this.findallitem(taglist, tag);   //返回一个选择的tag的索引
        let cindex = tagindexlist.indexOf(i)        //获得当前tag的索引
        return tagindexlist[cindex + 1]           //返回下一个位置tag的索引
      }
    }
  }
</script>

<style scoped lang="scss">
  #catlog {
    width: 240px;
    height: 400px;
    padding: 14px 16px;
    font-size: 1.2rem;
    overflow: hidden;


    .ivu-anchor-link {
      width: 240px;
      overflow: hidden;
      /*margin-bottom: 20px;*/
    }
  ;
  }

  /deep/ .ivu-anchor-wrapper {
    max-height: 80vh !important;
  }


</style>
