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
              {{ this.requirements === null || this.requirements === "" ? "Ввести потребности производства:" : "Обновить потребности производства:" }}
            </div>
            <div class="positions">
              <div class="positions__text">
                <textarea v-model="this.requirements" class="text" type="text" name="" id="" cols="30" rows="10" placeholder="Введите запрос..."></textarea>
              </div>
            </div>
            <div class="footer">
              <button class="buttons__btn" @click="addRequirements">Добавить</button>
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
      requirements: this.currentOrder.requirements
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

        const currentDateTime = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Samara' })

        await this.$store.dispatch('createLog', {
          user_id: Number(sessionStorage.getItem('userId')),
          operation: 'созданы/отредактированы потребности для заказа №' + this.currentOrder.id,
          date: currentDateTime.toString().slice(0, 19).replace('T', ' ')
        })

        this.isSubmitFormVisible = false
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
.intro-info
  display: flex
  flex-direction: column
  align-items: flex-start
.positions
  margin-top: 5px
  display: flex
  flex-direction: column
.positions__header
  display: flex
  flex-direction: column
  align-items: center
.positions__text
  display: flex
  justify-content: center
  margin: 15px 0px 15px 0px
.text
  width: 100%
.footer
  display: flex
  margin-top: 20px
  gap: 5px
  justify-content: center
</style>
