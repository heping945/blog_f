<template>
  <div>
    <Card :bordered="false">
      <List item-layout="vertical">
        <ListItem v-for="item in postlist" :key="item.id">
          <ListItemMeta :title="item.title" :description="item.excerpt"/>
          {{ item.content }}
          发布于：

          {{moment(item.create_date).fromNow()}}&nbsp;&nbsp;------------&nbsp;&nbsp;最后一次更新：
          {{moment(item.mod_date).fromNow()}}
        </ListItem>
      </List>
    </Card>
  </div>
</template>

<script>
  import {getIndexPost} from '../../services/api'
  import Axios from 'axios'

  export default {
    name: "UserPosts",
    data() {
      return {
        postlist: [],
        next: null
      }
    },
    created() {
      this.initcuruserpost();
    },
    watch: {
      next() {
        this.getmore()
      }
    },
    methods: {
      initcuruserpost() {
        let username = this.$route.params.username
        getIndexPost({author__username: username}).then(res => {
          this.postlist = res.data.results;
          this.next = res.data.next
          console.log(this.postlist)
        }).catch(err => {
          console.log(err)
        })
      },
      // handleDate,
      moment,
      getmore() {
        if (this.next) {
          Axios.get(this.next).then(res => {
            this.postlist = this.postlist.concat(res.data.results);
            this.next = res.data.next
          }).catch(err => {
            console.log(err)
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
