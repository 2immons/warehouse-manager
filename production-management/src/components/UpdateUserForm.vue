<template>
    <div class="popup-overlay" @click="closePopup">
      <SubmitForm v-if="isSubmitFormVisible" @confirm="confirmActions" @deny="denyActions"/>
      <div v-if="!isSubmitFormVisible" class="popup" @click.stop>
        <div class="header">
            <h1 class="header__text">ОБНОВЛЕНИЕ ПОЛЬЗОВАТЕЛЯ</h1>
            <hr class="div-line">
        </div>
        <div class="content">
          <div class="role-edit">
            <form class="content__inputs" @submit.prevent>
              <label for="">Имя пользователя:</label>
              <input v-model="this.username" type="text">

              <label for="">Имя, фамилия, отчество:</label>
              <input v-model="this.name" type="text">

              <label for="">Электронная почта</label>
              <input v-model="this.email" type="text">

              <label for="">Выбрать роль:</label>

              <div class="user-roles">
                <div class="role">
                  <input type="radio" id="option1" value="1" v-model="this.role">
                  <label for="option1">Администратор</label>
                </div>
                <div class="role">
                  <input type="radio" id="option2" value="2" v-model="this.role">
                  <label for="option2">Отдел производства</label>
                </div>
              </div>
            </form>
          </div>
          <div class="footer">
            <button class="buttons__btn" @click="updateUser">Обновить пользователя</button>
            <button class="buttons__btn" @click="closePopup">Закрыть</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import SubmitForm from './SubmitForm.vue'

export default {
  data () {
    return {
      isSubmitFormVisible: false,
      username: this.currentUser.username,
      name: this.currentUser.name,
      email: this.currentUser.email,
      role: this.currentUser.role
    }
  },
  props: {
    currentUser: Object
  },
  methods: {
    closePopup () {
      this.$emit('close-popup')
    },
    updateUser () {
      this.isSubmitFormVisible = true
    },
    async confirmActions () {
      try {
        await this.$store.dispatch('updateUser', {
          id: this.currentUser.id,
          username: this.currentUser.username,
          name: this.name,
          email: this.email,
          role: this.role,
          is_deleted: this.currentUser.is_deleted
        })

        const currentDateTime = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Samara' })

        await this.$store.dispatch('createLog', {
          user_id: Number(sessionStorage.getItem('userId')),
          operation: 'обновлен пользователь: ' + this.title,
          date: currentDateTime.toString().slice(0, 19).replace('T', ' ')
        })

        this.isSubmitFormVisible = false
        this.$emit('update-user')
        this.closePopup()
      } catch (error) {
        console.error('Ошибка при создании документа:', error)
      }
    },
    denyActions () {
      console.log('Создание документа отменено')
      this.isSubmitFormVisible = false
    }
  },
  components: { SubmitForm }
}
</script>

<style scoped lang="sass">
.popup-overlay
  display: flex
  top: 0
  justify-content: center
  align-items: center
  position: fixed
  width: 100%
  height: 100%
  background: rgba(0, 0, 0, 0.7)
  z-index: 2

.popup
  display: flex
  flex-direction: column
  align-items: center
  position: absolute
  min-width: 350px
  width: fit-content
  height: fit-content
  background: #fff
  padding: 20px
  border-radius: 8px
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3)
  text-align: center
  z-index: 3
.content
  margin-top: 20px
  display: flex
  flex-direction: column
  width: 95%
.content__inputs
  display: flex
  flex-direction: column
  width: 100%
  gap: 5px
  input[type=text]
    height: 30px
    display: flex
    background-color: #fff
    border: 1px solid #ccc
    border-radius: 4px
    padding: 0 10px
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)
.role-edit
  display: flex
  flex-direction: row
  width: 100%
.user-roles
  display: flex
  flex-direction: column
.role
  display: flex
  justify-content: left
  text-align: left
.footer
  display: flex
  margin-top: 20px
  gap: 5px
  justify-content: center
</style>
