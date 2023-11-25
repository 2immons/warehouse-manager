<template>
    <div class="sidebar">
        <button v-if="isSidebarButtonVisible" @click="this.$emit('close-sidebar')" class="sidebar-button">Х</button>
        <div class="sidebar-header">
            <h2>НАЗВАНИЕ КОМПАНИИ</h2>
        </div>
        <hr class="div-line">
        <nav class="nav">
            <div :class="{ 'nav-item': true, 'active': $route.path === '/details' }">
                <router-link class="router-link" to="/details">Товарно-материальные<br>ценности</router-link>
            </div>
            <hr class="div-line">
            <div :class="{ 'nav-item': true, 'active': $route.path === '/products' }">
                <router-link class="router-link" to="/products">Готовая продукция</router-link>
            </div>
            <hr class="div-line">
            <div :class="{ 'nav-item': true, 'active': $route.path === '/orders' }">
                <router-link class="router-link" to="/orders">Заказы</router-link>
            </div>
            <hr class="div-line">
            <div :class="{ 'nav-item': true, 'active': $route.path === '/logs' }">
                <router-link class="router-link" to="/logs">История изменений</router-link>
            </div>
            <hr class="div-line">
            <div :class="{ 'nav-item': true, 'active': $route.path === '/info' }">
                <router-link class="router-link" to="/info">Информация</router-link>
            </div>
            <hr class="div-line">
        </nav>
        <hr class="div-line">
        <div class="sidebar-footer">
            <div class="sidebar-footer-box">
                <p class="sidebar-footer-text">Вы вошли как</p>
                <p class="username">Александр Пушкин</p>
                <button class="exit-button">Выйти</button>
            </div>
        </div>
        <router-view/>
    </div>
</template>

<script>
export default {
  name: 'SideBar',
  data () {
    return {
      isSidebarButtonVisible: false
    }
  },
  mounted () {
    // Вызываем метод handleResize при монтировании компонента для установки начального значения
    this.handleResize()
    // Добавляем обработчик изменения размера окна
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount () {
    // Удаляем обработчик при уничтожении компонента
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize () {
      // Получаем текущую ширину окна
      const windowWidth = window.innerWidth

      // Используем медиа-запрос, чтобы определить, когда показывать компонент
      this.isSidebarButtonVisible = windowWidth < 1780 // Например, компонент виден при ширине экрана больше 768px
    }
  }
}
</script>

<style scoped lang="sass">
.sidebar
    z-index: 1
    display: flex
    flex-direction: column
    width: 17.5%
    height: 100vh
    background-color: #474F65
    @media screen and (max-width: 1780px)
        position: absolute
        width: 280px
.sidebar-button
    position: absolute
    align-self: flex-end
    margin: 10px 10px
.sidebar-header
    display: flex
    flex-direction: column
    text-align: center
    color: white
    justify-content: center
    height: 115px
    font-size: 20px
    font-weight: 700
    text-decoration: underline
    width: 100%
.div-line
    width: 100%
    border-color: rgba(255, 255, 255, 0.40)
.nav-item
    display: flex
    justify-content: center
    align-items: center
    height: 44px
.active
    background-color: #5e6884
    font-weight: 700
.nav
    display: flex
    flex-direction: column
    margin-top: 26px
    text-align: center
    color: white
    justify-content: center
    font-size: 16px
    font-style: normal
    font-weight: 400
    line-height: normal
    margin-bottom: auto
.sidebar-footer
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    height: 86px
    text-align: center
    color: white
.sidebar-footer-box
    display: flex
    flex-direction: column
    font-size: 15px
    height: 50px
.username, .exit-button
    font-weight: 700
.exit-button
    margin-top: 5px
    background-color: transparent
    border: none
    font-size: 15px
    color: #819CE7
</style>
