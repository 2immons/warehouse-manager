<template>
  <SubmitForm v-if="isSubmitFormVisible" @confirm="confirmActions" @deny="denyActions"/>
  <div class="section-header">
    <h2 class="section-header__text">КОНФИГУРАЦИЯ ПРИЛОЖЕНИЯ</h2>
  </div>
  <div class="section-content">
    <div class="organisation-info info">
      <div class="input-column">
        <div class="input-wrapper">
          <label for="">Наименование организации:</label>
          <input class="input-short" v-model="this.filteredItems.name" type="text">
        </div>
        <div class="input-wrapper">
          <label for="">Адрес:</label>
          <input class="input-short" v-model="this.filteredItems.adress" type="text">
        </div>
        <div class="input-wrapper">
          <label for="">Генеральный директор:</label>
          <input class="input-short" v-model="this.filteredItems.ceo" type="text">
        </div>
      </div>
      <div class="input-column">
        <div class="input-wrapper">
          <label for="">ИНН:</label>
          <input class="input-short" v-model="this.filteredItems.inn" type="text">
        </div>
        <div class="input-wrapper">
          <label for="">ОГРН:</label>
          <input class="input-short" v-model="this.filteredItems.ogrn" type="text">
        </div>
      </div>
    </div>
    <div class="settings info">
      <label for="">В режиме конфигурации:</label>
      <input v-model="this.filteredItems.is_in_configuration_mode" type="checkbox">
    </div>
  </div>
  <div class="settings-footer">
    <button class="buttons__btn" @click="confirmActions">Сохранить</button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SubmitForm from '@/components/SubmitForm.vue'

export default {
  components: {
    SubmitForm
  },
  data () {
    return {
      isSubmitFormVisible: false,
      filteredItems: []
    }
  },
  computed: {
    ...mapGetters(['getSettings'])
  },
  mounted () {
    this.fetchSettings().then(() => {
      this.filteredItems = this.getSettings
    })
  },
  methods: {
    ...mapActions(['fetchSettings']),

    async fetchSettingsFromServer () {
      await this.fetchSettings().then(() => {
        this.filteredItems = this.getSettings
      })
    },

    async confirmActions () {
      try {
        await this.$store.dispatch('updateSettings', this.filteredItems)

        const currentDateTime = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Samara' })

        await this.$store.dispatch('createLog', {
          user_id: Number(sessionStorage.getItem('userId')),
          operation: 'изменены настройки приложения',
          date: currentDateTime.toString().slice(0, 19).replace('T', ' ')
        })

        await this.fetchSettingsFromServer()
      } catch (error) {
        console.error('Ошибка изменения настроек приложения:', error)
      }

      this.isSubmitFormVisible = false
    },
    denyActions () {
      console.log('Не подтверждено удаление пользователя')
      this.isSubmitFormVisible = false
    }
  }
}
</script>

<style scoped lang="sass">
.section-header
  display: flex
  justify-content: center
  margin: 15px
.section-header__text
  text-decoration: underline
.section-content
  display: flex
  flex-direction: column
  align-items: center
  width: 100%
.users-list
  display: flex
  flex-direction: column
  width: 100%
.user-wrapper--header
  margin-bottom: 10px
  font-weight: 700
.user-wrapper
  display: grid
  width: 100%
  align-items: center
  grid-template-columns: 20% 20% 25% 20% 15%
  grid-template-rows: 1fr
.user__buttons
  display: flex
.settings-footer
  width: 100%
  display: flex
  justify-content: center
.info
  display: flex
  flex-direction: row
  align-items: flex-start
  width: 100%
  margin: 20px 0px 20px 0px
  gap: 5px
  input[type=text]
    height: 30px
    display: flex
    align-items: center
    background-color: #fff
    border: 1px solid #ccc
    border-radius: 4px
    padding: 0 10px
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)
.input-column
  display: flex
  flex-direction: column
  gap: 10px
  width: 100%
  align-items: center
.input-wrapper
  display: flex
  flex-direction: column
  text-align: left
  width: 100%
.input-wrapper--row
  flex-direction: row
  label
    width: 200px
.input-short
  width: 60%
</style>
