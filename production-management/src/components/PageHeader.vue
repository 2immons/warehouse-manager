<template>
    <header class="header">
      <button class="sidebar-button" @click.stop @click="this.$emit('open-sidebar')">-></button>
      <button class="notifications-button" @click.stop @click="toggleNotifications">
        <svg class="notifications-button__img" width="40" height="40" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18.1336 11C18.7155 16.3755 21 18 21 18H3C3 18 6 15.8667 6 8.4C6 6.70261 6.63214 5.07475 7.75736 3.87452C8.88258 2.67428 10.4087 2 12 2C12.3373 2 12.6717 2.0303 13 2.08949" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M19 8C20.6569 8 22 6.65685 22 5C22 3.34315 20.6569 2 19 2C17.3431 2 16 3.34315 16 5C16 6.65685 17.3431 8 19 8Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div v-if="this.getNotificationsCount > 0" class="notifications-button__count">{{ this.getNotificationsCount < 10 ? this.getNotificationsCount : '9+' }}</div>
      </button>
      <div class="page-header-content">
          <h1 class="page-header-text">{{ headerText }}</h1>
      </div>
      <hr class="div-line">
    </header>
    <div v-if="isNotificationsVisible" @click="isNotificationsVisible = false" class="notifications-overlay">
        <div @click.stop class="notifications">
          <h3 class="notifications__header">УВЕДОМЛЕНИЯ</h3>
          <hr class="div-line">
          <div class="notifications__items">
            <button @click="readNotifications">Пометить все как прочитанные</button>
            <p v-if="this.getNotificationsCount === 0" class="notifications__error">В данный момент уведомлений нет</p>
            <div class="notifications__item" v-for="notification in notifications" :key="notification">
              <p>
                {{ this.formatDateTime(notification.date) }}<br>{{ notification.operation }}
              </p>
              <button @click="readNotification(notification)">Прочитать</button>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  emits: ['openSidebar', 'click'],
  data () {
    return {
      userId: 0,
      isNotificationsVisible: false,
      notifications: [],
      headerText: ''
    }
  },
  created () {
    this.updateHeaderText()
  },
  computed: {
    ...mapGetters(['getNotifications', 'getNotificationsCount'])
  },
  mounted () {
    this.userId = Number(sessionStorage.getItem('userId'))
    this.fetchNotifications().then(() => {
      this.notifications = this.getNotifications
    })
  },
  methods: {
    ...mapActions(['fetchNotifications']),
    formatDateTime (dateTimeString) {
      const originalDate = new Date(dateTimeString)
      const minutes = originalDate.getMinutes().toString().padStart(2, '0')
      const hours = originalDate.getHours().toString().padStart(2, '0')
      const day = originalDate.getDate().toString().padStart(2, '0')
      const month = (originalDate.getMonth() + 1).toString().padStart(2, '0')
      const year = originalDate.getFullYear().toString().padStart(2, '0')

      const formattedDate = `${hours}:${minutes} ${day}/${month}/${year}`
      return formattedDate
    },
    async fetchNotificationsFromServer () {
      await this.fetchNotifications().then(() => {
        this.notifications = this.getNotifications
      })
    },

    async readNotifications () {
      try {
        await this.$store.dispatch('readNotifications')
        console.log('Потребности сделаны')
        this.$emit('logs-reed')
      } catch (error) {
        console.error('Ошибка при обновлении заказа:', error)
      }
    },

    async readNotification (notification) {
      try {
        console.log(notification)
        await this.$store.dispatch('readNotification', notification)

        console.log('Потребности сделаны')
        this.$emit('log-reed')
      } catch (error) {
        console.error('Ошибка при обновлении заказа:', error)
      }
      // try {
      //   const updatedLogs = [...this.notifications]
      //   this.notifications.forEach(notification => {
      //     notification.is_read = true
      //   })
      //   const response = await axios.put('http://localhost:4444/api/update-logs', updatedLogs)
      //   this.notifications = response.data.logs
      //   this.fetchLogsFromServer()
      // } catch (error) {
      //   console.error('Error fetching products:', error)
      // }
    },

    toggleNotifications () {
      this.isNotificationsVisible = !this.isNotificationsVisible
    },
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
        case '/orders':
          this.headerText = 'ЗАДАНИЯ ДЛЯ ПРОИЗВОДСТВА'
          break
        case '/logs':
          this.headerText = 'ЗАКАЗЫ'
          break
        case '/counterparties':
          this.headerText = 'КОНТРАГЕНТЫ'
          break
        case '/info':
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
.notifications-button
  cursor: pointer
  background: rgba(255, 255, 255, 0)
  border: none
  position: absolute
  display: flex
  justify-content: space-between
  right: 0
  width: 40px
  height: 50px
  margin: 10px 10px 00px 0px
  transition: transform 0.2s ease
  &:hover
    notifications-button:hover
    transform: scale(1.2)
.notifications-button__count
  justify-content: center
  color: red
  width: 100%
  display: flex
  position: absolute
  margin-top: 1px
  font-weight: 700
  justify-content: center
  font-size: 30px
  right: 0
.notifications-button__img
  position: absolute
.notifications-overlay
  position: fixed
  width: 85%
  height: 100%
  z-index: 3
  @media screen and (max-width: 1780px)
    width: 100%
.notifications
  position: absolute
  display: flex
  flex-direction: column
  padding: 15px
  background: rgb(245, 245, 245)
  right: 5px
  top: 55px
  width: 400px
  max-height: 600px
  height: fit-content
  border: 1px solid rgb(170, 170, 170)
  box-shadow: 0px 0px 10px 5px rgb(170, 170, 170)
  border-radius: 12px
  overflow-y: auto
  overflow-x: hidden
.notifications__header
  display: flex
  align-self: center
  font-weight: 700
  margin: 0px 0px 15px 0px
.notifications__items
  margin: 15px 0px 15px 0px
  display: flex
  flex-direction: column
.notifications__item
  display: flex
  flex-direction: row
  justify-content: space-between
  align-items: center
  height: 60px
  border-bottom: 1px solid black
  margin-top: 15px
.notifications__error
  display: flex
  flex-direction: row
  justify-content: center
  align-items: center
  height: 60px
  border-bottom: 1px solid black
  margin-top: 15px
.div-line
    border-color: black
    width: 100%
</style>
