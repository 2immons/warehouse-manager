<template>
  <div class="page">
    <AuthForm @close-popup="closeAuthForm"/>
  </div>
</template>

<script>
// @ is an alias to /src
import AuthForm from '@/components/AuthForm.vue'

export default {
  name: 'HomeView',
  components: {
    AuthForm
  },
  methods: {
    closeAuthForm () {
      this.$router.push('/details')
    }
  }
}
</script>

<style lang="sass">
  .page
    display: flex
    flex-direction: row
    width: 100vw
</style>
