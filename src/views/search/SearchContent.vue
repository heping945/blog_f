<template>
  <div id="searchcontent" class="p-container commonpositiontop">

    <Row>
      <Col :xs="24" :sm="24" :md="24" :lg="18">
        <div class="serachquery">
          <Card>
            <span v-for="item,index in searcharg" @click="changei_search(index,item)">
              <router-link :to="{name:'search',query:{q:arg,type:item.type}}"
                           :class='cindex==index? "active" :""'>
                {{item.title}}
              </router-link>
              <Divider type="vertical"/></span>
            <span style="float: right">共
              <strong>{{rescount}}</strong>
              条数据</span>
          </Card>
        </div>
        <main class="searchres">
          <Card v-show="cindex==0">
            <Table :columns="postcolumn" :data="p" border height="525" @on-row-click="to_post"
                   no-data-text="没有查询到数据啊"
            ></Table>
          </Card>
          <Card v-show="cindex==1">
            <Table :columns="tagcolumn" :data="t"></Table>
          </Card>
          <Card v-show="cindex==2">
            <Table :columns="categorycolumn" :data="c"></Table>
          </Card>
        </main>
      </Col>
    </Row>
  </div>
</template>

<script>
  import storage from '../../assets/js/storage'
  import {search} from '../../services/api'

  export default {
    name: "SearchContent",
    data() {
      return {
        arg: '',
        nodata: '没有数据',
        type: '',
        rescount: 1000,
        searcharg: [
          {title: '文章', type: 'posts'},
          {title: '标签', type: 'tags'},
          {title: '分类', type: 'categories'},
        ],
        searchres: [
          {id: 0, res: [], type: 'posts'},
          {id: 1, res: [], type: 'tags'},
          {id: 2, res: [], type: 'categories'},
        ],
        cindex: 0,
        postcolumn: [
          {
            title: 'id',
            key: 'id',
            align: 'center',
            width: 50,
            sortable: true
          },
          {
            title: '标题',
            key: 'title',
            ellipsis: true
          },
          {
            title: '作者',
            key: 'author',
            align: 'center',
          },
          {
            title: '分类',
            key: 'category',
            align: 'center',
          },
          {
            title: '创建时间',
            key: 'create_date',
            sortable: true,
            align: 'center',
          },
        ],
        tagcolumn: [
          {
            title: 'id',
            key: 'id',
            align: 'center',
          },
          {
            title: '名称',
            key: 'name',
            align: 'center',
          },

          {
            title: '文章数量',
            key: 'get_post_count'
          },
        ],
        categorycolumn: [
          {
            title: '名称',
            key: 'name',
            align: 'center',
          },
          {
            title: '文章数量',
            key: 'get_post_count'
          },
        ],
      }
    },
    mounted() {
      // let res = storage.get('searcharg', '')
      // let res = this.$route.query.q
        let res = this.$store.state.search_arg
      if (res) {
        this.arg = res;
        this.initsearch()
      }
      ;
    },
    created() {
      //刷新页面切换保留选项卡状态
      for (var i = 0; i < this.searcharg.length; i++) {
        if (this.searcharg[i].type == this.$route.query.type) {
          this.cindex = i;
          return
        }
      }
    },
    computed: {
      p() {
        // return this.searchres[0].res
        //  post数据
        let _p = this.searchres[0].res
        _p.map(item => {
          return item['author'] = item['author']['username']
        });
        _p.map(item => {
          return item['create_date'] = item['create_date']
        });
        return _p
      },
      t() {
        return this.searchres[1].res
      },
      c() {
        return this.searchres[2].res
      }
    },
    methods: {
      changei_search(index, item) {
        this.cindex = index;
        this.initsearch()
      },
      // dateFormat,
      moment,
      to_post(selection, row) {
        this.$router.push({name: 'postdetail', params: {id: selection.id}})
      },
      initsearch() {
        let type = this.$route.query.type
        let searchq = this.$route.query.q
        search(
          {
            type: type,
            keyword: {search: searchq}
          }
        ).then(res => {
          console.log(res);
          console.log(this.searchres)
          console.log(type)
          var r = this.searchres.filter(item => {
            return item.type == type
          })[0];
          // console.log(r)
          // r.res = res.data
          console.log(r, '<-----r的值是')
          // console.log(res.data.results)
          r.res = res.data.results;
          this.rescount = res.data.count
          console.log(r, '<-----r的值是')
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .serachquery {
    span {
      cursor: pointer;
      /*a.active{*/
      /*  background: yellow;*/
      /*}*/
    }
  }

  .searchres {
    margin-top: 1rem;

  }

  .active {
    color: red;
  }

  /*table cell padding*/
  /deep/ .ivu-table-cell {
    padding: 0 0;
  }
</style>
