<template>
  <div class="popup-overlay" @click="closePopup">
    <SubmitForm v-if="isSubmitFormVisible" @confirm="confirmActions" @deny="denyActions"/>
    <div v-if="!isSubmitFormVisible" class="popup" @click.stop>
      <div class="header">
          <h1 class="header__text">РЕДАКТИРОВАНИЕ ЗАКАЗА</h1>
          <hr class="div-line">
      </div>
      <div class="content">
        <div class="intro-info">
          <label for="">№ заказа</label>
          <input v-model="this.orderNumber" type="text">
          <label for="">Клиент</label>
          <div class="table-cell">
            <input class="table-cell-input" type="text" v-model="this.clientName" @input="onClientInput" @focus="showCounterpartiesList" @blur="hideCounterpartiesList" placeholder="Начните вводить наименование и выберите из списка...">
            <div class="clients-list-overlay" v-if="isClientInputActive">
              <ul class="clients-list">
                <li class="clients-list__item" v-for="counterparty in filteredCounterparties" :key="counterparty.id" @click="selectCounterparty(counterparty)">
                  {{ counterparty.name }}
                </li>
              </ul>
            </div>
          </div>
          <label for="">Скрыть наименование клиента от производства</label>
          <input v-model="this.isCommercialSecret" type="checkbox">
          <label for="">Исполнить до даты</label>
          <input v-model="this.deadline" type="date">
          <label for="">№ договора о поставке</label>
          <input v-model="this.documentNumber" placeholder="Не указан" type="text">
          <button @click="addPositionRow">Добавить позицию</button>
        </div>
        <div class="positions">
          <div class="positions__header">
            <h3>Добавленные позиции</h3>
          </div>
          <div class="table-section__container">
            <div class="table">
              <div class="table__header">
                  <div class="table-cell-header">№</div>
                  <div class="table-cell-header">Наименование продукта</div>
                  <div class="table-cell-header">Количество</div>
                  <div class="table-cell-header">Удалить</div>
              </div>
              <div class="table__row" v-for="(item, index) in positions" :key="index">
                <div class="table-cell">{{ index+1 }}</div>
                <div class="table-cell">
                  <input class="table-cell-input" type="text" v-model="item.product_name" @input="onProductNameInput(index)" @focus="showProductsList(index)" @blur="hideProductsList(index)" placeholder="Начните вводить наименование и выберите из списка...">
                  <div class="products-list-overlay" v-if="isProductInputActive || (selectedProduct && index === selectedProduct.index)">
                    <ul class="products-list">
                      <li class="products-list__item" v-for="product in filteredProducts" :key="product.id" @click="selectProduct(index, product)">
                        {{ product.name }}
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="table-cell">
                  <input class="table-cell-input" type="number" v-model="item.quantity">
                </div>
                <div class="table-cell">
                  <button class="table-button table-button--remove" @click="removePositionRow(item)">
                    <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="50px" height="50px"><path d="M 21 0 C 19.355469 0 18 1.355469 18 3 L 18 5 L 10.1875 5 C 10.0625 4.976563 9.9375 4.976563 9.8125 5 L 8 5 C 7.96875 5 7.9375 5 7.90625 5 C 7.355469 5.027344 6.925781 5.496094 6.953125 6.046875 C 6.980469 6.597656 7.449219 7.027344 8 7 L 9.09375 7 L 12.6875 47.5 C 12.8125 48.898438 14.003906 50 15.40625 50 L 34.59375 50 C 35.996094 50 37.1875 48.898438 37.3125 47.5 L 40.90625 7 L 42 7 C 42.359375 7.003906 42.695313 6.816406 42.878906 6.503906 C 43.058594 6.191406 43.058594 5.808594 42.878906 5.496094 C 42.695313 5.183594 42.359375 4.996094 42 5 L 32 5 L 32 3 C 32 1.355469 30.644531 0 29 0 Z M 21 2 L 29 2 C 29.5625 2 30 2.4375 30 3 L 30 5 L 20 5 L 20 3 C 20 2.4375 20.4375 2 21 2 Z M 11.09375 7 L 38.90625 7 L 35.3125 47.34375 C 35.28125 47.691406 34.910156 48 34.59375 48 L 15.40625 48 C 15.089844 48 14.71875 47.691406 14.6875 47.34375 Z M 18.90625 9.96875 C 18.863281 9.976563 18.820313 9.988281 18.78125 10 C 18.316406 10.105469 17.988281 10.523438 18 11 L 18 44 C 17.996094 44.359375 18.183594 44.695313 18.496094 44.878906 C 18.808594 45.058594 19.191406 45.058594 19.503906 44.878906 C 19.816406 44.695313 20.003906 44.359375 20 44 L 20 11 C 20.011719 10.710938 19.894531 10.433594 19.6875 10.238281 C 19.476563 10.039063 19.191406 9.941406 18.90625 9.96875 Z M 24.90625 9.96875 C 24.863281 9.976563 24.820313 9.988281 24.78125 10 C 24.316406 10.105469 23.988281 10.523438 24 11 L 24 44 C 23.996094 44.359375 24.183594 44.695313 24.496094 44.878906 C 24.808594 45.058594 25.191406 45.058594 25.503906 44.878906 C 25.816406 44.695313 26.003906 44.359375 26 44 L 26 11 C 26.011719 10.710938 25.894531 10.433594 25.6875 10.238281 C 25.476563 10.039063 25.191406 9.941406 24.90625 9.96875 Z M 30.90625 9.96875 C 30.863281 9.976563 30.820313 9.988281 30.78125 10 C 30.316406 10.105469 29.988281 10.523438 30 11 L 30 44 C 29.996094 44.359375 30.183594 44.695313 30.496094 44.878906 C 30.808594 45.058594 31.191406 45.058594 31.503906 44.878906 C 31.816406 44.695313 32.003906 44.359375 32 44 L 32 11 C 32.011719 10.710938 31.894531 10.433594 31.6875 10.238281 C 31.476563 10.039063 31.191406 9.941406 30.90625 9.96875 Z"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer">
          <button @click="createOrder">Отредактировать задание</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SubmitForm from './SubmitForm.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      isClientInputActive: false,
      isProductInputActive: false,
      isSubmitFormVisible: false,
      orderNumber: this.currentOrder.id,
      clientName: this.currentOrder.client_name,
      clientId: this.currentOrder.client_id,
      isCommercialSecret: this.currentOrder.is_commercial_secret,
      deadline: this.formatDateTime(this.currentOrder.deadline),
      documentNumber: this.currentOrder.doc_number,
      products: [],
      positions: this.currentOrder.positions,
      counterparties: []
    }
  },
  props: {
    currentOrder: Object
  },
  mounted () {
    this.fetchProductsFromServer()
    this.fetchCounterparties().then(() => {
      this.counterparties = this.getCounterparties
    })
    this.fetchProducts().then(() => {
      this.products = this.getProducts
    })
  },
  computed: {
    ...mapGetters(['getProducts']),
    ...mapGetters(['getCounterparties']),
    filteredProducts () {
      return this.products.filter(product =>
        product.name.toLowerCase().includes(this.positions[this.selectedProduct.index].product_name.toLowerCase())
      )
    },
    filteredCounterparties () {
      return this.counterparties.filter(counterparty =>
        counterparty.name.toLowerCase().includes(this.clientName.toLowerCase())
      )
    }
  },
  methods: {
    formatDateTime (dateTimeString) {
      const originalDate = new Date(dateTimeString)
      const day = originalDate.getDate().toString().padStart(2, '0')
      const month = (originalDate.getMonth() + 1).toString().padStart(2, '0')
      const year = originalDate.getFullYear().toString().padStart(2, '0')

      const formattedDate = `${year}-${month}-${day}`
      return formattedDate
    },
    createOrder () {
      this.isSubmitFormVisible = true
    },
    ...mapActions(['fetchCounterparties']),
    ...mapActions(['fetchProducts']),
    async fetchCounterpartiesFromServer () {
      await this.fetchCounterparties().then(() => {
        this.counterparties = this.getCounterparties
      })
    },
    async fetchProductsFromServer () {
      await this.fetchProducts().then(() => {
        this.products = this.getProducts
      })
    },
    showCounterpartiesList () {
      this.isClientInputActive = true
    },
    hideCounterpartiesList () {
      setTimeout(() => {
        this.isClientInputActive = false
      }, 200)
    },
    selectCounterparty (counterparty) {
      console.log(counterparty)
      this.clientName = counterparty.name
      this.clientId = counterparty.id
    },
    onProductNameInput (index) {
      this.selectedProduct = { index }
    },
    showProductsList (index) {
      this.isProductInputActive = true
      this.selectedProduct = { index }
    },
    hideProductsList (index) {
      this.isProductInputActive = false
      this.selectedProduct = { index }
    },
    selectProduct (index, product) {
      this.positions[index].product_name = product.name
      this.positions[index].product_id = product.id
      this.selectedProduct = null
    },
    addPositionRow () {
      const newPosition = {
        order_id: this.currentOrder.id,
        product_name: '',
        quantity: 0,
        is_ready_to_ship: false
      }
      this.positions.push(newPosition)
    },
    removePositionRow (item) {
      const index = this.positions.indexOf(item)
      if (index !== -1) {
        this.positions.splice(index, 1)
      }
    },
    closePopup () {
      this.$emit('close-popup')
    },
    shipProduct () {
      this.isSubmitFormVisible = true
    },
    async confirmActions () {
      try {
        const updatedOrderArray = [
          {
            client_id: this.clientId,
            is_commercial_secret: this.isCommercialSecret,
            creation_date: this.currentOrder.creation_date,
            deadline: this.deadline,
            doc_number: this.documentNumber,
            shipping_status: this.currentOrder.shipping_status,
            requirements: this.currentOrder.requirements,
            positions: this.positions,
            id: this.currentOrder.id
          }
        ]

        console.log(updatedOrderArray[0].positions)

        await this.$store.dispatch('updateOrders', updatedOrderArray)

        const currentDateTime = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Samara' })

        await this.$store.dispatch('createLog', {
          user_id: Number(sessionStorage.getItem('userId')),
          operation: 'заказ №' + this.currentOrder.id + ' обновлен',
          date: currentDateTime.toString().slice(0, 19).replace('T', ' ')
        })

        this.isSubmitFormVisible = false
        this.$emit('order-shipped')
        this.closePopup()
      } catch (error) {
        console.error('Ошибка при обновлении продуктов:', error)
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
.table__header .table-cell-header
    background-color: #f2f2f2
    border: 1px solid black
.table-section__container
  border: 1px solid black
  display: flex
  flex-direction: column
  align-items: flex-start
  align-content: center
  width: 99%
  height: 400px
  overflow-y: auto

.table
  display: grid
  width: 100%
  justify-content: center
  grid-template-columns: 10% 50% 20% 20%
.table__header
  font-weight: 700
  display: contents
  font-size: 12px
  text-align: center
.table-header .table-cell
  background-color: #f2f2f2
.table__row
  display: contents
  font-size: 12px
  text-align: center
.table-cell-header
  display: flex
  flex-direction: raw
  position: relative
  justify-content: center
  align-items: center
  text-align: center
  border: 1px solid #ddd
  padding: 1px
  font-size: 12px
  height: 27px
  overflow: hidden
  white-space: nowrap
  text-overflow: ellipsis
  z-index: 0
.table-cell
  position: relative
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  text-align: center
  border: 1px solid #ddd
  padding: 1px
  font-size: 12px
  height: 30px
  overflow: visible
  white-space: nowrap
  text-overflow: ellipsis
.table-cell-input
  border: none
  width: 99%
  height: 100%
  cursor: text
.products-list-overlay, .clients-list-overlay
  position: absolute
  top: 100%
  left: 0
  width: 100%
  z-index: 55
.products-list, .clients-list
  padding: 5px 0px 5px 0px
  list-style-type: none
  margin: 0
  background-color: #fff
  border: 1px solid #ddd
  max-height: 150px
  z-index: 552
  overflow-y: auto
.products-list__item, .clients-list__item
  margin-bottom: 5px
  text-align: left
  font-size: 16px
  height: 15px
  cursor: pointer
  &:hover
    background-color: #f5f5f5
.footer
  margin-top: 20px
  display: flex
  justify-content: center
</style>
