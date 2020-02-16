<template>
  <div class="main-wrapper">
    <keep-alive>
      <router-view name="header"></router-view>
    </keep-alive>
    <transition name="fade" :duration="100">
      <router-view name="content"></router-view>
    </transition>
    <router-view name="footer" keep-alive></router-view>
  </div>
</template>

<script>
  export default {
    name: "Home",
    data() {
      return {}
    }
  }
</script>

<style scoped>
  .main-wrapper {
    width: 100%;
    margin: 0 auto;
    /*animation-duration: 5s;*/
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter, .fade-leave-active {
    opacity: 0
  }
</style>
