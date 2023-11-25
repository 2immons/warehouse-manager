<template>
    <header class="header">
      <button class="sidebar-button" @click.stop @click="this.$emit('open-sidebar')">-></button>
      <div class="page-header-content">
          <h1 class="page-header-text">{{ headerText }}</h1>
      </div>
      <hr class="div-line">
    </header>
</template>

<script>
export default {
  data () {
    return {
      headerText: ''
    }
  },
  created () {
    this.updateHeaderText()
  },
  methods: {
    updateHeaderText () {
      switch (this.$route.path) {
        case '/':
          this.headerText = 'Домашняя страница'
          break
        case '/details':
          this.headerText = 'ТОВАРНО-МАТЕРИАЛЬНЫЕ ЦЕННОСТИ'
          break
        case '/products':
          this.headerText = 'ГОТОВАЯ ПРОДУКЦИЯ'
          break
        default:
          this.headerText = 'ЗАКАЗЫ'
          break
      }
    }
  }
}
</script>

<style scoped lang="sass">
.header
    display: flex
    flex-direction: column
.page-header-content
    display: flex
    flex-direction: column
    justify-content: center
    width: 100%
    height: 115px
    font-weight: 700
    font-size: 36px
    text-align: center
.sidebar-button
    position: absolute
    width: 30px
    margin: 10px 10px
    @media screen and (min-width: 1780px)
          display: none
.div-line
    border-color: black
    width: 100%
</style>
