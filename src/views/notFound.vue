<template>
  <div>
    <div style="margin: 50px auto;text-align: center">
      <img src="@/assets/img/404.png" alt="" style="width: 90%;height: auto;max-width: 600px">
    </div>
    <div class="tips">
      <h2 class="b-text">矮油~~您访问的页面不在地球上...</h2>
      <a class="back-index" href="/">返回首页</a>
    </div>
  </div>
</template>

<script>
  export default {
    name: "notFound"
  }
</script>

<style scoped lang="scss">
  .tips {
    text-align: center;

    h2 {
      font-size: 20px;
      margin-bottom: 20px
    }
  ;

    .back-index {
      display: block;
      width: 110px;
      height: 30px;
      background-color: #e3453d;
      border-radius: 10px;
      color: #fff;
      line-height: 30px;
      margin: 0 auto;
    }
  }


</style>
