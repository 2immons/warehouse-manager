<template>
  <div class="page">
    <SideBar msg="Welcome to Your Vue.js App"/>
    <PageHeader/>
  </div>
</template>

<script>
// @ is an alias to /src
import SideBar from '@/components/SideBar.vue'
import PageHeader from '@/components/PageHeader.vue'

export default {
  name: 'HomeView',
  components: {
    SideBar, PageHeader
  }
}
</script>

<style lang="sass">
  .page
    display: flex
    flex-direction: row
    width: 100vw
</style>
