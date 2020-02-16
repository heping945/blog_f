<template>
  <div id="nocontent">
<!--    <hr style="border: 1px solid #c0c0c0;margin-top: 30px">-->
    <div class="hr-more">{{msg}}</div>
  </div>
</template>

<script>
  export default {
    name: "NoContent",
    data(){
      return{
        msg:'>--这里是底线--<'
      }
    }
  }
</script>

<style scoped>
  .hr-more {
    height: 20px;
    position: relative;
    top:2rem;
    font: normal 1.2em/20px 微软雅黑;
    vertical-align: middle;
    text-align: center;
    border-radius: 4px;
    /*background-color: chartreuse;*/
    opacity: 0.3;
    margin-bottom: 1rem;
  }
</style>
