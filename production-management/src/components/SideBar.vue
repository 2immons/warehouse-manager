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
                <router-link class="router-link" to="/orders">Задания для<br>производства</router-link>
            </div>
            <hr class="div-line">
            <div :class="{ 'nav-item': true, 'active': $route.path === '/counterparties' }">
                <router-link class="router-link" to="/counterparties">Контрагенты</router-link>
            </div>
            <hr class="div-line">
            <div :class="{ 'nav-item': true, 'active': $route.path === '/logs' }">
                <router-link class="router-link" to="/logs">История изменений</router-link>
            </div>
            <hr class="div-line">
            <div :class="{ 'nav-item': true, 'active': $route.path === '/admin' }">
                <router-link class="router-link" to="/admin">Администрирование</router-link>
            </div>
            <hr class="div-line">
        </nav>
        <div class="time-section">
            <p>Текущее время (GTM +4):</p>
            <p class="time-section-value-wrapper">{{ this.currentTime }}</p>
        </div>
        <hr class="div-line">
        <div class="sidebar-footer">
            <div class="sidebar-footer-box">
                <p class="sidebar-footer-text">Вы вошли как:</p>
                <p class="username">{{ username }}</p>
                <button @click="logout" class="exit-button">Выйти</button>
            </div>
        </div>
        <router-view/>
    </div>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  name: 'SideBar',
  data () {
    return {
      username: '',
      isSidebarButtonVisible: false,
      currentTime: this.getCurrentTime()
    }
  },
  created () {
    setInterval(() => {
      this.currentTime = this.getCurrentTime()
    }, 1000)
  },
  mounted () {
    this.username = sessionStorage.getItem('username')
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    formatDateTime (dateTimeString) {
      const originalDate = new Date(dateTimeString)
      const minutes = originalDate.getMinutes().toString().padStart(2, '0')
      const hours = originalDate.getHours().toString().padStart(2, '0')
      const seconds = originalDate.getSeconds().toString().padStart(2, '0')
      const day = originalDate.getDate().toString().padStart(2, '0')
      const month = (originalDate.getMonth() + 1).toString().padStart(2, '0')
      const year = originalDate.getFullYear().toString().padStart(2, '0')

      const formattedDate = `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`
      return formattedDate
    },
    getCurrentTime () {
      const currentTime = new Date()
      const gmtPlus4Time = new Date(currentTime.getTime())
      return this.formatDateTime(gmtPlus4Time)
    },
    logout () {
      this.$router.push('/home')
      Cookies.remove('token')
      Cookies.remove('token_expiration')
      Cookies.remove('userId')
      sessionStorage.removeItem('userId')
      sessionStorage.removeItem('username')
      sessionStorage.removeItem('name')
      sessionStorage.removeItem('role')
    },
    handleResize () {
      const windowWidth = window.innerWidth
      this.isSidebarButtonVisible = windowWidth < 1780
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
    height: 100%
    background-color: #474F65
    @media screen and (max-width: 1780px)
        position: absolute
        width: 280px
.sidebar-button
    position: absolute
    border: 1px solid rgba(0,0,0,0.30)
    background-color: rgb(255, 233, 223)
    align-self: flex-end
    width: 10%
    cursor: pointer
    margin: 10px 10px
    border-radius: 15px
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
    &:hover
        background-color: #5e6884
.router-link
    cursor: pointer
    width: 100%
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
.time-section
    display: flex
    height: 86px
    flex-direction: column
    justify-content: center
    align-items: center
    color: white
.time-section-value-wrapper
    font-size: 21px
    margin-top: 6px
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
