<template>
  <div class="suspensionpanelbottom">
    <div>
      <Icon type="md-thumbs-up"/>
    </div>
    <div>
      <Icon type="ios-chatbubbles"/>
    </div>
    <div>
      <Icon type="md-star"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SuspensionPanelBottom"
  }
</script>

<style scoped lang="scss">
  .ivu-row {
    height: 4rem;
  }

  .suspensionpanelbottom {
    z-index: 1555;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    height: 4rem;
    width: 100%;
    background: white;
    display: -webkit-flex; /* Safari */
    display: flex;
    justify-content: space-around;
    line-height: 4rem;
    .ivu-icon {
      font-size: 2.5rem;
    }
  }

  @media (min-width: 992px) {
    .suspensionpanelbottom {
      display: none;
    }
  }
</style>
