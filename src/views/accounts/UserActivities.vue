<template>
  <div>
    <Card :bordered="false">
      <div style="text-align:center">
        <h3>A high quality UI Toolkit based on Vue.js</h3>
      </div>
    </Card>
  </div>
</template>

<script>
  export default {
    name: "UserActivites",
    data() {
      return {}
    },
    created() {
      console.log('router', this.$router)
      console.log('router', this.$route)
    }
  }
</script>

<style scoped>

</style>
