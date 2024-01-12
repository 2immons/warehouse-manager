<template>
    <div class="popup-overlay" @click="closePopup">
      <SubmitForm v-if="isSubmitFormVisible" @confirm="confirmActions" @deny="denyActions"/>
      <div v-if="!isSubmitFormVisible" class="popup" @click.stop>
        <div class="header">
            <h1 class="header__text">РАЗМЕЩЕНИЕ ЗАКАЗА</h1>
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
                    <input class="table-cell-input" type="text" v-model="item.name" @input="onProductNameInput(index)" @focus="showProductsList(index)" @blur="hideProductsList(index)" placeholder="Начните вводить наименование и выберите из списка...">
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
                    <button class="table-button" @click="removePositionRow(item)">Удалить</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="footer">
            <button @click="createOrder">Разместить задание</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import SubmitForm from './SubmitForm.vue'
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      isClientInputActive: false,
      isProductInputActive: false,
      isSubmitFormVisible: false,
      orderNumber: '',
      clientName: '',
      clientId: '',
      isCommercialSecret: false,
      deadline: '',
      documentNumber: '',
      products: [],
      positions: [],
      counterparties: []
    }
  },
  mounted () {
    this.fetchProductsFromServer()
    this.fetchCounterparties().then(() => {
      this.counterparties = this.getCounterparties
    })
  },
  computed: {
    ...mapGetters(['getCounterparties']),
    filteredProducts () {
      return this.products.filter(product =>
        product.name.toLowerCase().includes(this.positions[this.selectedProduct.index].name.toLowerCase())
      )
    },
    filteredCounterparties () {
      return this.counterparties.filter(counterparty =>
        counterparty.name.toLowerCase().includes(this.clientName.toLowerCase())
      )
    }
  },
  methods: {
    ...mapActions(['fetchCounterparties']),
    async fetchCounterpartiesFromServer () {
      await this.fetchCounterparties().then(() => {
        this.counterparties = this.getCounterparties
      })
    },
    showCounterpartiesList () {
      this.isClientInputActive = true
    },
    hideCounterpartiesList () { // переделать
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
      this.positions[index].name = product.name
      this.positions[index].product_id = product.id
      this.selectedProduct = null
    },
    async fetchProductsFromServer () {
      try {
        const response = await axios.get('http://localhost:4444/api/products')
        this.products = response.data.products
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    },
    addPositionRow () {
      const newPosition = {
        name: '',
        quantity: 0
      }
      this.positions.push(newPosition)
    },
    removePositionRow (item) {
      const index = this.products.indexOf(item)
      if (index !== -1) {
        this.products.splice(index, 1)
      }
    },
    closePopup () {
      this.$emit('close-popup')
    },
    createOrder () {
      this.isSubmitFormVisible = true
    },
    async confirmActions () {
      try {
        const jsDate = new Date()
        const correctedDate = new Date(jsDate.getTime() + jsDate.getTimezoneOffset() * -1 * 60 * 1000)
        const date = correctedDate.toISOString().slice(0, 16).replace('T', ' ')

        if (this.documentNumber === '') {
          this.documentNumber = 'не был указан'
        }

        await this.$store.dispatch('createOrder', {
          client_id: this.clientId,
          is_commercial_secret: this.isCommercialSecret,
          creation_date: date,
          deadline: this.deadline,
          doc_number: this.documentNumber,
          positions: this.positions
        })

        this.isSubmitFormVisible = false
        this.$emit('order-creation')
        this.closePopup()
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    },

    denyActions () {
      console.log('Заказ не создан')
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
  width: 80%
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
.table-button
  min-width: 100px
  display: flex
  justify-content: center
  align-items: center
  height: 20px
  background-color: #CDD3E2
  color: #fff
  border: 1px solid black
  border-radius: 12px
  color: black
  padding: 6px
  font-size: 12px
  font-weight: 700
  cursor: pointer
  transition: background-color 0.3s

  &:hover
    background-color: darken(#CDD3E2, 10%)
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
