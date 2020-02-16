<template>
  <div>
    <Collapse simple>
      <Panel name="1">
        分类：
        <router-link to="/archive" title="查看分类更多内容"> <Tag color="cyan">{{cat}}</Tag></router-link>
        <p slot="content" style="padding-left: 30px">
          标签：
          <Tag :color="color[Math.floor(Math.random()*color.length)]" v-for="t in tag" :key="tag.id">
            {{t.name}}
          </Tag>
        </p>
      </Panel>
    </Collapse>
  </div>
</template>

<script>
  export default {
    name: "PostTagCat",
    props: ['cat', 'tag','catslug'],
    data(){
      return{
        color:['default', 'primary', 'success', 'warning',
          'error', 'blue', 'green', 'red', 'yellow', 'pink', 'magenta', 'volcano',
          'orange', 'gold', 'lime', 'cyan', 'geekblue', 'purple']
      }
    },

    methods: {
      rgb() {//rgb颜色随机
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        var rgb = '(' + r + ',' + g + ',' + b + ')';
        return rgb;
      }
    }
  }
</script>

<style scoped>

</style>
