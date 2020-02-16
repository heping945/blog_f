<template>
  <div id="loadingspin">
    <Spin>
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>加载中</div>
    </Spin>
  </div>
</template>

<script>
  export default {
    name: "LoadingSpain"
  }
</script>

<style scoped>
  #loadingspin {
    text-align: center;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
