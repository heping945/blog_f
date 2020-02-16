<template>
  <main class="p-container commonpositiontop" style="z-index: 200">
    <mavon-editor v-model="value" codeStyle="monokai" :boxShadow="false"
                  :toolbarsFlag="false" ref="md" :subfield="false" defaultOpen="preview"/>
    <SuspensionPanel></SuspensionPanel>
  </main>
</template>

<script>
  import {getinfo} from '@/services/api'

  const SuspensionPanel = () => import('@/components/utils/SuspensionPanel')

  export default {
    name: "About",
    components: {
      SuspensionPanel
    },
    data() {
      return {
        value: ''
      }
    },
    created() {
      this.initabout()
    },
    methods: {
      initabout() {
        const urlname = this.$route.params.info;
        let infoid = null
        switch (urlname) {
          case 'about':
            infoid = 1
            break;
          case 'version':
            infoid = 2
            break;
          case 'guide':
            infoid = 3
            break;
          case 'recommend':
            infoid = 4
            break;
        }
        console.log(urlname)
        getinfo({id: infoid}).then(res => {
          console.log(res);
          this.value = res.data.body_md
        }).catch(err => {
          this.$router.push({name: 'notFound'})
        })
      }
    }

  }
</script>

<style scoped>

</style>
