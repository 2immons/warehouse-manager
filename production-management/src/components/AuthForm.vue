<template>
  <div class="popup-overlay">
    <div class="popup" :class="{ 'popup-expanded': isRegistrationFormVisible }">
      <div class="header">
        <h1 class="header__text">АВТОРИЗАЦИЯ</h1>
        <hr class="div-line">
      </div>
      <div class="content">
        <h2 v-if="!isRegistrationFormVisible" class="form-header">Вход</h2>
        <form v-if="!isRegistrationFormVisible" class="login-form" @submit.prevent="loginUser">
          <label>Имя пользователя:</label>
          <input v-model="loginFormData.loginUsername" class="form-input" :class="{ 'error-class': v$.loginFormData.loginUsername.$error }"/>
          <div class="error-message" v-if="v$.loginFormData.loginUsername.minLength.$invalid">* Минимум 6 символов</div>
          <div class="error-message" v-if="v$.loginFormData.loginUsername.required.$invalid">* Обязательное поле</div>

          <label>Пароль:</label>
          <input v-model="loginFormData.loginPassword" class="form-input" :class="{ 'error-class': v$.loginFormData.loginPassword.$error }"/>
          <div class="error-message" v-if="v$.loginFormData.loginPassword.minLength.$invalid">* Минимум 8 символов</div>
          <div class="error-message" v-if="v$.loginFormData.loginPassword.required.$invalid">* Обязательное поле</div>

          <button class="form-button" type="submit">Войти</button>
          <div class="invalid-credentinals-error" v-if="isLoginFailed">Неверный логин или пароль</div>
          <button @click="formToggle" class="form-toggle-button" type="submit">Нет аккаунта? Зарегистрироваться</button>
        </form>

        <h2 v-if="isRegistrationFormVisible" class="form-header">Регистрация</h2>
        <form v-if="isRegistrationFormVisible" class="registration-form" @submit.prevent="registerUser">
          <label>Имя пользователя:</label>
          <input v-model="registrationFormData.registerUsername" class="form-input" :class="{ 'error-class': v$.registrationFormData.registerUsername.$error }"/>
          <div class="error-message" v-if="v$.registrationFormData.registerUsername.minLength.$invalid">* Минимум 6 символов</div>
          <div class="error-message" v-if="v$.registrationFormData.registerUsername.required.$invalid">* Обязательное поле</div>

          <label>Пароль:</label>
          <input v-model="registrationFormData.registerPassword" type="password" class="form-input" :class="{ 'error-class': v$.registrationFormData.registerPassword.$error }"/>
          <div class="error-message" v-if="v$.registrationFormData.registerPassword.minLength.$invalid">* Минимум 8 символов</div>
          <div class="error-message" v-if="v$.registrationFormData.registerPassword.sameAs.$invalid">* Пароли не совпадают</div>
          <div class="error-message" v-if="v$.registrationFormData.registerPassword.required.$invalid">* Обязательное поле</div>

          <label>Подтвердите пароль:</label>
          <input v-model="registrationFormData.registerPasswordRepeat" type="password" class="form-input" :class="{ 'error-class': v$.registrationFormData.registerPasswordRepeat.$error }"/>
          <div class="error-message" v-if="v$.registrationFormData.registerPasswordRepeat.sameAs.$invalid">* Пароли не совпадают</div>
          <div class="error-message" v-if="v$.registrationFormData.registerPasswordRepeat.required.$invalid">* Обязательное поле</div>

          <label>ФИО:</label>
          <input v-model="registrationFormData.name" type="text" class="form-input" :class="{ 'error-class': v$.registrationFormData.name.$error }"/>
          <div class="error-message" v-if="v$.registrationFormData.name.required.$invalid">* Обязательное поле</div>
          <div class="error-message" v-if="v$.registrationFormData.name.minLength.$invalid">* Минимум 3 символа</div>

          <label>Почта:</label>
          <input v-model="registrationFormData.email" type="email" class="form-input" :class="{ 'error-class': v$.registrationFormData.email.$error }"/>
          <div class="error-message" v-if="v$.registrationFormData.email.required.$invalid">* Обязательное поле</div>

          <label>Роль:</label>
          <label><input type="radio" required value="1" v-model="registrationFormData.role">Администратор</label>
          <label><input type="radio" required value="2" v-model="registrationFormData.role">Отдел производства</label>
          <div class="error-message" v-if="v$.registrationFormData.role.required.$invalid">* Выберите роль</div>

          <div v-if="organisation.isSetting" class="role-input-wrapper">
              <label>Сотрудник</label>
              <input type="radio" name="contact"/>
              <label>Администратор</label>
              <input type="radio" name="contact"/>
          </div>

          <button class="form-button" type="submit">Зарегистрироваться</button>
          <div class="invalid-credentinals-error" v-if="isRegistrationFailed">Такой пользователь уже существует</div>
          <button @click="formToggle" class="form-toggle-button" type="submit">Есть аккаунт? Войти</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import axios from 'axios'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, sameAs } from '@vuelidate/validators'

export default {
  data () {
    return {
      isLoginFailed: false,
      isRegistrationFailed: false,
      isPopupVisible: false,
      isRegistrationFormVisible: false,
      loginFormData: {
        loginUsername: '',
        loginPassword: ''
      },
      registrationFormData: {
        registerUsername: '',
        registerPassword: '',
        registerPasswordRepeat: '',
        name: '',
        email: '',
        role: ''
      }
    }
  },
  setup () {
    return {
      v$: useVuelidate()
    }
  },
  validations () {
    return {
      loginFormData: {
        loginUsername: { required, minLength: minLength(6) },
        loginPassword: { required, minLength: minLength(8) }
      },
      registrationFormData: {
        registerUsername: { required, minLength: minLength(6) },
        registerPassword: { required, minLength: minLength(8), sameAs: sameAs(this.registrationFormData.registerPasswordRepeat) },
        registerPasswordRepeat: { required, sameAs: sameAs(this.registrationFormData.registerPassword) },
        name: { required, minLength: minLength(3) },
        email: { required },
        role: { required }
      }
    }
  },
  computed: {
    organisation () {
      return store.state.organisation
    }
  },
  methods: {
    closePopup () {
      this.isPopupVisible = false
      this.$emit('close-popup')
    },
    formToggle () {
      this.isRegistrationFormVisible = !this.isRegistrationFormVisible
    },
    async loginUser () {
      this.isLoginFailed = false

      const isLFormCorrect = await this.v$.loginFormData.$validate()
      if (!isLFormCorrect) {
        return
      }

      const response = await axios.post('http://localhost:4444/api/login', {
        username: this.loginFormData.loginUsername,
        password: this.loginFormData.loginPassword
      })

      if (!response.data.success) {
        this.isLoginFailed = true
        console.log('Не успешная аутентификация')
        return
      }

      sessionStorage.setItem('token', response.data.token)
      console.log('Успешная аутентификация', sessionStorage.getItem('token'), response.data.user)
      sessionStorage.setItem('username', response.data.user.name)
      sessionStorage.setItem('userId', response.data.user.id)
      sessionStorage.setItem('role', response.data.user.role)
      this.closePopup()
    },
    async registerUser () {
      this.isRegistrationFailed = false

      const isRFormCorrect = await this.v$.registrationFormData.$validate()
      if (!isRFormCorrect) {
        return
      }
      const response = await axios.post('http://localhost:4444/api/register', {
        username: this.registrationFormData.registerUsername,
        name: this.registrationFormData.name,
        email: this.registrationFormData.email,
        password: this.registrationFormData.registerPassword,
        role: this.registrationFormData.role
      })

      if (!response.data.success) {
        this.isRegistrationFailed = true
        console.log('Не успешная регистрация')
        return
      }

      console.log('Успешная регистрация', response.data)
      this.isRegistrationFormVisible = false
    }
  }
}
</script>

<style scoped lang="sass">
.popup-overlay
  display: flex
  justify-content: center
  align-items: center
  position: fixed
  width: 100%
  height: 100vh
  background: rgba(0, 0, 0, 0.7)
  z-index: 2

.popup
  transition: height 0.3s ease
  overflow: hidden
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  position: absolute
  max-width: 1300px
  min-width: 400px
  width: 30%
  height: 50%
  background: #fff
  padding: 20px
  border-radius: 8px
  text-align: center
  z-index: 3
  box-shadow: 0px 0px 30px 20px rgba(50, 50, 50, 10)
.popup-expanded
  height: 95%
  max-height: 850px
.header
  width: 100%
  .header__text
    font-size: 36px
    font-weight: 700
.content
  display: flex
  flex-direction: column
  width: 95%
.form-header
  font-size: 20px
  font-weight: 700
.div-line
    width: 100%
    margin: 20px 0px 20px 0px
.login-form, .registration-form
  display: flex
  flex-direction: column
  margin: 10px 0px 10px 0px
  gap: 8px
.form-input
  display: block
  align-self: center
  width: 95%
  padding: 10px 5px 10px 5px
  margin: 0
  font-size: 16px
  border: 1px solid #ccc
  border-radius: 5px
  background-color: #f9f9f9
  transition: border-color 0.3s ease
  &:focus
    outline: none
    border-color: black
.error-class
  border-color: red
  background: lighten(red, 48%)
.error-message
  font-size: 15px
  color: lighten(red, 10%)
.form-button
  display: inline-block
  align-self: center
  width: 50%
  margin: 10px
  max-width: 250px
  min-width: 200px
  padding: 10px 20px
  font-size: 16px
  font-weight: bold
  text-align: center
  text-decoration: none
  cursor: pointer
  border: none
  border-radius: 5px
  background-color: #474F65
  color: #fff
  transition: background-color 0.3s ease
  &:hover
    background-color: lighten(#474F65, 10%)
  &:focus
    outline: none
    box-shadow: 0 0 5px rgba(81, 203, 238, 1)
  &:active
    background-color: darken(#4caf50, 10%)
.form-toggle-button
  display: block
  padding: 5px
  font-size: 14px
  font-weight: bold
  text-align: center
  text-decoration: none
  color: blue
  background-color: transparent
  border: none
  cursor: pointer
  transition: color 0.3s ease
  transition: transform 0.1s ease
  &:hover
    color: darken(blue, 10%)
    transform: scale(1.03)
.intro-info
  display: flex
  flex-direction: column
  align-items: flex-start
.positions
  display: flex
  flex-direction: column
.positions__header
  display: flex
  flex-direction: column
  align-items: center
.positions__content
  display: flex
  flex-direction: column
  align-items: flex-start
</style>
