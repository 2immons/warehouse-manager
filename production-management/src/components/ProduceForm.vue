<template>
    <div class="popup-overlay" @click="closePopup">
      <SubmitForm v-if="isSubmitFormVisible" @confirm="confirmActions" @deny="denyActions"/>
        <div v-if="!isSubmitFormVisible" class="popup" @click.stop>
          <div class="header">
              <h1 class="header__text">АКТ О ПРОИЗВОДСТВЕ</h1>
              <hr class="div-line">
          </div>
          <div class="content">
            <div class="intro-info">
              <div class="input-line">
                <label for="">Поле</label>
                <input class="input-short" v-model="this.UPD_SF_Number" type="text">
                <label for="">от</label>
                <input type="date" v-model="this.UPD_SF_date" required>
              </div>
              <div class="input-line">
                <div class="input-wrapper">
                  <label for="">Продукт</label>
                  <input v-model="this.productName" type="text" >
                </div>
                <div class="input-wrapper">
                  <label for="">В количестве</label>
                  <input v-model="this.producedQuantity" type="text" >
                </div>
              </div>
              <div class="input-line">
                <div class="input-wrapper">
                  <label for="">Поле</label>
                  <input v-model="this.supplierName" type="text">
                </div>
                <div class="input-wrapper">
                  <label for="">Поле</label>
                  <input v-model="this.supplierAdress" type="text">
                </div>
              </div>
              <div class="input-line">
                <div class="input-wrapper">
                  <label for="">Поле</label>
                  <input v-model="this.supplierINN" type="text">
                </div>
                <div class="input-wrapper">
                  <label for="">Поле</label>
                  <input v-model="this.supplierKPP" type="text">
                </div>
              </div>
              <div class="input-line">
                <div class="input-wrapper">
                  <label for="">Поле</label>
                  <input class="input-short" v-model="this.client" type="text">
                </div>
                <div class="input-wrapper">
                  <label for="">Дата</label>
                  <input class="input-short" v-model="this.date" type="date" required>
                </div>
                <div class="input-wrapper">
                  <input type="file" @change="handleFileUpload" />
                </div>
              </div>
            </div>
            <div class="footer">
              <button class="buttons__btn" @click="produceProduct">Произвести</button>
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
      producedQuantity: 0,
      date: '',
      productName: this.currentProduct.name
    }
  },
  props: {
    currentProduct: Object
  },
  methods: {
    async confirmActions () {
      try {
        await this.$store.dispatch('updateProduct', {
          name: this.currentProduct.name,
          produced: Number(this.currentProduct.produced) + Number(this.producedQuantity),
          shipped: this.currentProduct.shipped,
          ready_to_ship: this.currentProduct.ready_to_ship,
          id: this.currentProduct.id
        })
        await this.$store.dispatch('createProduction', {
          product_id: this.currentProduct.id,
          production_date: this.date,
          quantity: this.producedQuantity
        })

        const currentDateTime = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Samara' })

        await this.$store.dispatch('createLog', {
          user_id: Number(sessionStorage.getItem('userId')),
          operation: 'произведен продукт: ' + this.currentProduct.name + ' в количестве: ' + this.producedQuantity,
          date: currentDateTime.toString().slice(0, 19).replace('T', ' ')
        })

        this.isSubmitFormVisible = false
        this.$emit('product-creation')
        this.closePopup()
      } catch (error) {
        console.error('Ошибка при обновлении заказа:', error)
      }
    },
    produceProduct () {
      this.isSubmitFormVisible = true
    },
    denyActions () {
      console.log('Продукт не проивзеден')
      this.isSubmitFormVisible = false
    },
    closePopup () {
      this.$emit('close-popup')
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
  width: 80%
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
.intro-info
  display: flex
  flex-direction: column
  align-items: flex-start
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
.input-line
  display: flex
  flex-direction: row
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
  width: 150px
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
  margin-top: 20px
  gap: 5px
  display: flex
  justify-content: center
</style>
