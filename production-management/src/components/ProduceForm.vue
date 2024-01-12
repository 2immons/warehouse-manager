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
              {{ this.currentProduct.id }}
            </div>
            <div class="positions">
              <div class="positions__header">
                <h3>Заголовок</h3>
              </div>
              <div class="positions__content">
                <input type="text" v-model="this.producedQuantity">
                <input type="date" v-model="this.date">
              </div>
            </div>
            <div class="footer">
              <button @click="productProduct">Произвести</button>
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
      producedQuantity: 0,
      date: ''
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
        console.log('Продукт произведен')
        this.$emit('product-creation')
        this.closePopup()
      } catch (error) {
        console.error('Ошибка при обновлении заказа:', error)
      }
    },
    productProduct () {
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
