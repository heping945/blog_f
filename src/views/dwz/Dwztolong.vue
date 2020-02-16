<template>
  <div></div>
</template>

<script>
  import {getLongurl} from '@/services/api'

  export default {
    name: "Dwztolong",
    created() {

      this.to()
    },
    methods: {
      to() {
        var args = this.$route.params
        console.log(args.short_id);
        getLongurl({
          arg: args.short_id
        }).then(res => {
          if (res.data.code == 1) {
            console.log(res.data.data);
            window.location.href = res.data.data
          } else {
            this.$router.push({name: 'notFound'})
          }
        }).catch(err => {
          console.log(err);
          this.$router.push({name: 'notFound'})
        })
      }
    }
  }
</script>

<style scoped>

</style>
