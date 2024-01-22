<template>
    <div class="popup-overlay" @click="closePopup">
      <SubmitForm v-if="isSubmitFormVisible" @confirm="confirmActions" @deny="denyActions"/>
        <div v-if="!isSubmitFormVisible" class="popup" @click.stop>
          <div class="header">
              <h1 class="header__text">ПОТРЕБНОСТИ ПРОИЗВОДСТВА</h1>
              <hr class="div-line">
          </div>
          <div class="content">
            <div class="intro-info">
              Общая информация
            </div>
            <div class="positions">
              <div class="positions__header">
                <h3>Заголовок</h3>
              </div>
              <div class="positions__content">
                <input v-model="this.requirements" type="text">
                <p>Текущие запросы:</p>
                <p>{{ this.currentOrder.requirements }}</p>
              </div>
            </div>
            <div class="footer">
              <button @click="addRequirements">Добавить</button>
              <button @click="closePopup">Close Popup</button>
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
      requirements: ''
    }
  },
  props: {
    currentOrder: Object
  },
  methods: {
    closePopup () {
      this.$emit('close-popup')
    },
    addRequirements () {
      this.isSubmitFormVisible = true
    },
    async confirmActions () {
      try {
        await this.$store.dispatch('updateOrder', {
          client_id: this.currentOrder.client_id,
          is_commercial_secret: this.currentOrder.is_commercial_secret,
          creation_date: this.currentOrder.creation_date,
          deadline: this.currentOrder.deadline,
          doc_number: this.currentOrder.doc_number,
          shipping_status: this.currentOrder.shipping_status,
          requirements: this.requirements,
          id: this.currentOrder.id
        })

        await this.$store.dispatch('createLog', {
          user_id: Number(sessionStorage.getItem('userId')),
          operation: 'созданы потребности заказа ' + this.currentOrder.id + ': ' + this.requirements,
          date: '22.02.2004'
        })

        console.log('Потребности сделаны')
        this.$emit('requirements-creation')
        this.closePopup()
      } catch (error) {
        console.error('Ошибка при обновлении заказа:', error)
      }
    },
    denyActions () {
      console.log('Образец не создан')
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
  max-width: 1300px
  width: 67%
  height: 750px
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
.footer
  display: flex
  justify-content: left
</style>
