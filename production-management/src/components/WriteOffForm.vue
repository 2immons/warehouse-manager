<template>
    <div class="popup-overlay" @click="closePopup">
      <SubmitForm v-if="isSubmitFormVisible" @confirm="confirmActions" @deny="denyActions"/>
      <div v-if="!isSubmitFormVisible" class="popup" @click.stop>
        <div class="header">
            <h1 class="header__text">СПИСАНИЕ НА ПРОИЗВОДСТВО</h1>
            <hr class="div-line">
        </div>
        <div class="content">
          <div class="intro-info">
            <label for="">№ акта списания</label>
            <input v-model="this.documentNumber" type="text">
            <div class="input-wrapper">
              <label for="">Сдал (ФИО, должность)</label>
              <input type="text">
            </div>
            <div class="input-wrapper">
              <label for="">Принял (ФИО, должность)</label>
              <input type="text">
            </div>
            <div class="input-wrapper">
              <label for="">Дата</label>
              <input class="input-short" v-model="this.date" type="date">
            </div>
            <button class="buttons__btn" @click="openProductsListPopup">Добавить позицию по привязке к продукту</button>
            <button class="buttons__btn" @click="addPositionRow">Добавить позицию вручную</button>
            <div class="compability-popup-overlay" v-if="isProductsListPopupVisible" @click="closeProductsListPopup">
              <div class="compability-popup" @click.stop>
                <div class="header">
                  <h1 class="header__text">{{ (this.isFirstStep) ? 'ВЫБОР НАЗНАЧЕНИЯ СПИСАНИЯ' : 'ВЫБОР ТМЦ' }}</h1>
                  <hr class="div-line">
                </div>
                <input v-if="isFirstStep" class="compability-popup__input" type="text" @input="handleSearch" v-model="searchText" placeholder="Начните вводить наименование и/или выберите из списка...">
                <div v-if="isFirstStep" class="products-list2">
                  <button @click="goToDetails(product)" class="products-list2__item" v-for="product in products" :key="product.id">
                    <p>{{ product.name }}</p>
                  </button>
                </div>
                <div v-if="!isFirstStep" class="table2">
                  <div class="table__header">
                      <div class="table-cell-header">№</div>
                      <div class="table-cell-header">Наименование</div>
                      <div class="table-cell-header">Ед.<br>измер.</div>
                      <div class="table-cell-header">Остаток</div>
                      <div class="table-cell-header">Цена<br>за ед.</div>
                      <div class="table-cell-header">Кол-во</div>
                      <div class="table-cell-header">Сумма</div>
                      <div class="table-cell-header">Дата поставки</div>
                      <div class="table-cell-header">№ УПД/СФ</div>
                      <div class="table-cell-header">Поставщик</div>
                      <div class="table-cell-header">Выбрать</div>
                  </div>
                  <div class="table__row" v-for="(item, index) in details" :key="index">
                    <div class="table-cell">{{ index+1 }}</div>
                    <div class="table-cell">{{ item.name }}</div>
                    <div class="table-cell">{{ item.unit }}</div>
                    <div class="table-cell">{{ item.supplied - item.written_off }}</div>
                    <div class="table-cell">{{ item.price }} руб</div>
                    <div class="table-cell">
                      <input class="table-cell-input" type="number" v-model="item.quantity">
                    </div>
                    <div class="table-cell">{{ (item.quantity !== undefined) ? (item.price * item.quantity).toFixed(2) : '0.00' }} руб</div>
                    <div class="table-cell">{{ this.formatDateTime(item.supply_date) }}</div>
                    <div class="table-cell">№ {{ item.upd_sf_number }}</div>
                    <div class="table-cell">{{ item.supplier_name }}</div>
                    <div class="table-cell">
                      <input class="table-cell-input" type="checkbox" v-model="item.isChecked">
                    </div>
                  </div>
                </div>
                <button v-if="!this.isFirstStep" @click="goToProducts">Назад</button>
                <button v-if="!this.isFirstStep" @click="addDetailsToPositions">Подтвердить</button>
              </div>
            </div>
          </div>
          <div class="positions">
            <div class="positions__header">
              <h3 class="positions__header__text">Позиции</h3>
            </div>
            <div class="table-section__container">
              <div class="table">
                <div class="table__header">
                    <div class="table-cell-header">№</div>
                    <div class="table-cell-header">Наименование</div>
                    <div class="table-cell-header">Ед.<br>измер.</div>
                    <div class="table-cell-header">Вид<br>операции</div>
                    <div class="table-cell-header">Назначение<br>списания</div>
                    <div class="table-cell-header">Остаток</div>
                    <div class="table-cell-header">Цена<br>за ед.</div>
                    <div class="table-cell-header">Кол-во</div>
                    <div class="table-cell-header">Сумма</div>
                    <div class="table-cell-header">Дата поставки</div>
                    <div class="table-cell-header">№ УПД/СФ</div>
                    <div class="table-cell-header">Поставщик</div>
                    <div class="table-cell-header">Удаление</div>
                </div>
                <div class="table__row" v-for="(item, index) in positions" :key="index">
                  <div class="table-cell">{{ index+1 }}</div>
                  <div class="table-cell">
                    <input class="table-cell-input" type="text" v-model="item.name" @input="onDetailNameInput(index)" @focus="showDetailsList(index)" @blur="hideDetailsList(index)" placeholder="Начните вводить наименование и выберите из списка...">
                    <div class="products-list-overlay" v-if="isInputActive || (selectedDetail && index === selectedDetail.index)">
                      <ul class="products-list">
                        <li class="products-list__item" v-for="detail in getDetails" :key="detail.id" @click="selectDetail(index, detail)">
                          {{ detail.name }}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="table-cell">
                    <input class="table-cell-input" type="text" v-model="item.unit">
                  </div>
                  <div class="table-cell">
                    <input class="table-cell-input" type="text" v-model="item.operationType">
                  </div>
                  <div class="table-cell">
                    <input class="table-cell-input" type="text" v-model="item.needs">
                  </div>
                  <div class="table-cell">{{ (item.supplied !== '') ? '' : item.supplied - item.written_off  }}</div>
                  <div class="table-cell">{{ (item.price !== '') ? item.price + ' руб': '' }}</div>
                  <div class="table-cell">
                    <input class="table-cell-input" type="number" v-model="item.quantity">
                  </div>
                  <div class="table-cell">{{ (item.price !== '' && item.quantity !== '') ? (item.price * item.quantity).toFixed(2) + ' руб': '' }}</div>
                  <div class="table-cell">{{ (item.supply_date !== '') ? this.formatDateTime(item.supply_date) : ''}}</div>
                  <div class="table-cell">{{ (item.upd_sf_number !== '') ? '№ ' + item.upd_sf_number : '' }}</div>
                  <div class="table-cell">{{ item.supplier_name }}</div>
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
            <button class="buttons__btn" @click="createOrder">Списать</button>
            <button class="buttons__btn" @click="closePopup">Закрыть</button>
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
      currentProduct: '',
      isFirstStep: true,
      isInputActive: false,
      isSubmitFormVisible: false,
      isProductsListPopupVisible: false,
      date: '',
      documentNumber: '',
      sentBy: '',
      acceptedBy: '',
      products: [],
      positions: [],
      details: []
    }
  },
  mounted () {
    this.fetchProducts().then(() => {
      this.products = this.getProducts
    })
    this.fetchDetails().then(() => {
      this.details = this.getDetails
    })
  },
  computed: {
    ...mapGetters(['getProducts', 'getDetails', 'getCompabilities'])
  },
  methods: {
    formatDateTime (dateTimeString) {
      const originalDate = new Date(dateTimeString)
      const day = originalDate.getDate().toString().padStart(2, '0')
      const month = (originalDate.getMonth() + 1).toString().padStart(2, '0')
      const year = originalDate.getFullYear().toString().padStart(2, '0')

      const formattedDate = `${day}.${month}.${year}`
      return formattedDate
    },
    async goToDetails (item) {
      await this.fetchCompabilities().then(() => {
        const compatibilities = this.getCompabilities
        this.details.forEach(detail => {
          detail.compatibleWith = compatibilities
            .filter(item => item.detail_id === detail.id)
            .map(item => item.product_id)
        })
      })
      console.log(this.details)
      this.details = this.details.filter(detail => {
        return detail.compatibleWith && detail.compatibleWith.some(id => id === item.id)
      })
      this.currentProduct = item
      this.isFirstStep = false
    },
    goToProducts () {
      this.details = this.getDetails
      this.currentProduct = null
      this.isFirstStep = true
    },
    async fetchProductsFromServer () {
      await this.fetchProducts().then(() => {
        this.products = this.getProducts
      })
    },
    async fetchDetailsFromServer () {
      await this.fetchDetails().then(() => {
        this.details = this.getDetails
      })
    },
    ...mapActions(['fetchProducts', 'fetchDetails', 'fetchCompabilities']),
    addDetailsToPositions () {
      const checkedDetails = this.details.filter(detail => detail.isChecked === true)
      checkedDetails.forEach(detail => {
        detail.needs = 'Производство ' + this.currentProduct.name
        detail.operationType = 'Списание на производство'
        this.positions.push(detail)
        detail.isChecked = false
      })
      this.closeProductsListPopup()
    },
    openProductsListPopup () {
      this.isProductsListPopupVisible = true
    },
    closeProductsListPopup () {
      this.isProductsListPopupVisible = false
      this.isFirstStep = true
      this.details = this.getDetails
    },
    onDetailNameInput (index) {
      this.selectedDetail = { index }
    },
    showDetailsList (index) {
      this.isInputActive = true
      this.selectedDetail = { index }
    },
    hideDetailsList (index) {
      this.isInputActive = false
      this.selectedDetail = { index }
    },
    selectDetail (index, detail) {
      this.positions[index].name = detail.name
      this.positions[index].detail_id = detail.id
      this.positions[index].unit = detail.unit
      this.positions[index].needs = 'Производство ' + this.currentProduct.name
      this.positions[index].operationType = 'Списание на производство'
      this.positions[index].price = detail.price
      this.positions[index].supplier_name = detail.supplier_name
      this.positions[index].supply_date = detail.supply_date
      this.positions[index].upd_sf_number = detail.upd_sf_number
      this.selectedDetail = null
    },
    onProductNameInput (index) {
      this.selectedProduct = { index }
    },
    showProductsList (index) {
      this.isInputActive = true
      this.selectedProduct = { index }
    },
    hideProductsList (index) {
      this.isInputActive = false
      this.selectedProduct = { index }
    },
    selectProduct (index, product) {
      this.positions[index].name = product.name
      this.positions[index].product_id = product.id
      this.selectedProduct = null
    },
    handleSearch () {
      console.log(this.products)
      const searchText = this.searchText.toLowerCase()
      if (searchText === '') {
        this.products = this.getProducts
      } else {
        this.products = this.products.filter(item => {
          return (
            item.name.toLowerCase().includes(searchText)
          )
        })
      }
    },
    addPositionRow () {
      const newPosition = {
        name: '',
        unit: '',
        operationType: '',
        needs: '',
        price: '',
        quantity: '',
        supply_date: '',
        upd_sf_number: '',
        supplier_name: ''
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
      this.isPopupVisible = false
      this.$emit('close-popup')
    },
    createOrder () {
      this.isSubmitFormVisible = true
    },
    async confirmActions () {
      try {
        const detailsDates = []
        const updatedDetails = [...this.details]
        updatedDetails.forEach(detail => {
          if ('quantity' in detail) {
            detail.written_off = detail.written_off + detail.quantity
            detailsDates.push({ detail_id: detail.id, write_off_date: this.date, quantity: detail.quantity })
          }
        })
        await this.$store.dispatch('updateDetails', updatedDetails)
        await this.$store.dispatch('createWriteOff', detailsDates)
        console.log('Потребности сделаны')
        this.$emit('written-off')
        this.closePopup()
      } catch (error) {
        console.error('Ошибка при обновлении заказа:', error)
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
.compability-popup-overlay
  display: flex
  width: 100%
  height: 100%
  position: fixed
  justify-content: center
  align-items: center
  left: 0
  top: 0
  background: rgba(0, 0, 0, 0.7)
  z-index: 3
.compability-popup
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  position: absolute
  max-width: 1300px
  width: 70%
  height: fit-content
  background: #fff
  padding: 20px
  border-radius: 8px
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3)
  text-align: center
  z-index: 3
.compability-popup__input
  width: 300px
  margin: 20px 0px 0px 0px
.products-list2
  padding: 5px 0px 5px 0px
  margin: 20px
  list-style-type: none
  background-color: #fff
  border: 1px solid #ddd
  height: 70%
  max-height: 600px
  width: 300px
  z-index: 552
  overflow-y: auto
.products-list2__item
  display: flex
  justify-content: space-between
  margin-bottom: 5px
  text-align: left
  font-size: 16px
  height: 15px
  cursor: pointer
  &:hover
    background-color: #f5f5f5
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
.positions
  display: flex
  flex-direction: column
.positions__header
  display: flex
  flex-direction: column
  align-items: center
  margin: 5px
.positions__header__text
  font-weight: 700
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
  overflow-x: hidden

.table
  display: grid
  width: 100%
  justify-content: center
  grid-template-columns: 5% 10% 5% 10% 10% 6% 8% 6% 8% 8% 8% 8% 8%
.table2
  display: grid
  width: 100%
  justify-content: center
  grid-template-columns: 5% 10% 10% 6% 8% 6% 8% 8% 8% 8% 8%
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
.products-list-overlay
  position: absolute
  top: 100%
  left: 0
  width: 100%
  z-index: 55
.products-list
  padding: 5px 0px 5px 0px
  list-style-type: none
  margin: 0
  background-color: #fff
  border: 1px solid #ddd
  max-height: 150px
  z-index: 552
  overflow-y: auto
.products-list__item
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
