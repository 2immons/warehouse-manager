<template>
    <div class="popup-overlay" @click="closePopup">
      <SubmitForm v-if="isSubmitFormVisible" @confirm="confirmActions" @deny="denyActions"/>
      <div v-if="!isSubmitFormVisible" class="popup" @click.stop>
        <div class="header">
            <h1 class="header__text">ДОБАВЛЕНИЕ КОНТРАГЕНТА</h1>
            <hr class="div-line">
        </div>
        <div class="content">
          <form class="content__inputs">
            <label for="">Наименование контрагента</label>
            <input v-model="name" type="text">

            <label for="">Адрес контрагента</label>
            <input v-model="adress" type="text">

            <label for="">ИНН контрагента</label>
            <input v-model="INN" type="text">

            <label for="">КПП контрагента</label>
            <input v-model="KPP" type="text">
          </form>
          <div class="footer">
            <button @click="createCounterparty">Добавить контрагента</button>
          </div>
          <!-- переписать в нормальный вид -->
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
      name: '',
      adress: '',
      INN: '',
      KPP: ''
    }
  },
  methods: {
    closePopup () {
      this.$emit('close-popup')
    },
    createCounterparty () {
      this.isSubmitFormVisible = true
    },
    async confirmActions () {
      try {
        await this.$store.dispatch('createCounterparty', {
          name: this.name,
          adress: this.adress,
          INN: this.INN,
          KPP: this.KPP
        })

        await this.$store.dispatch('createLog', {
          user_id: Number(sessionStorage.getItem('userId')),
          operation: 'создан контр ' + this.name + ' с адресом ' + this.adress,
          date: '22.02.2004'
        })

        this.isSubmitFormVisible = false
        this.$emit('add-counterparty')
        this.closePopup()
      } catch (error) {
        console.error('Ошибка при создании контрагента:', error)
      }
    },
    denyActions () {
      console.log('Контрагент не создан')
      this.isSubmitFormVisible = false
    }
  },
  components: { SubmitForm }
}
</script>

<style scoped lang="sass">
.popup-overlay
  display: flex
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
  max-width: 500px
  min-width: 350px
  width: 40%
  height: fit-content
  background: #fff
  padding: 20px
  border-radius: 8px
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3)
  text-align: center
  z-index: 3
.content
  display: flex
  flex-direction: column
  width: 95%
.content__inputs
  display: flex
  flex-direction: column
  gap: 10px
  align-items: center
  margin: 20px 0px 20px 0px
.footer
  display: flex
  justify-content: center
</style>
