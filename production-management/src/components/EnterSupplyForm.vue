<template>
    <div class="popup-overlay" @click="closePopup">
      <SubmitForm v-if="isSubmitFormVisible" @confirm="confirmActions" @deny="denyActions"/>
      <div v-if="!isSubmitFormVisible" class="popup" @click.stop>
        <div class="header">
            <h1 class="header__text">ВНЕСЕНИЕ ПОСТАВКИ</h1>
            <hr class="div-line">
        </div>
        <div class="content">
          <div class="intro-info">
            <div class="input-line">
              <label for="">Счет-фактура №</label>
              <input class="input-short" v-model="this.UPD_SF_Number" type="text">
              <label for="">от</label>
              <input v-model="this.date" type="date">
            </div>
            <div class="input-wrapper">
              <label for="">Статус документа (1 СФ+ПД(а), 2 ПД(а) )</label>
              <input class="input-short" v-model="this.status" type="text">
            </div>
            <div class="input-line">
              <div class="input-wrapper">
                <label for="">Продавец (наименование)</label>
                <input v-model="this.supplierName" type="text">
              </div>
              <div class="input-wrapper">
                <label for="">Продавец (адрес)</label>
                <input v-model="this.supplierAdress" type="text">
              </div>
            </div>
            <div class="input-line">
              <div class="input-wrapper">
                <label for="">Продавец (ИНН)</label>
                <input v-model="this.supplierINN" type="text">
              </div>
              <div class="input-wrapper">
                <label for="">Продавец (КПП)</label>
                <input v-model="this.supplierKPP" type="text">
              </div>
            </div>
            <div class="input-line">
              <div class="input-wrapper">
                <label for="">Основание передачи</label>
                <input v-model="this.supplyDocumentNumber" type="text">
              </div>
              <div class="input-wrapper">
                <label for="">Платежное поручение</label>
                <input v-model="this.payDocumentNumber" type="text">
              </div>
            </div>
            <div class="input-wrapper input-wrapper--row">
              <label for="">Принять НДС к вычету</label>
              <input v-model="this.client" type="checkbox">
            </div>
            <div class="input-wrapper input-wrapper--row">
              <label for="">Восстановить НДС</label>
              <input v-model="this.client" type="checkbox">
            </div>
            <div class="input-line">
              <div class="input-column-left">
                <div class="input-wrapper">
                  <label for="">Выбрать склад</label>
                  <input class="input-short" v-model="this.client" type="text">
                </div>
              </div>
              <div class="input-column-right">
                <div class="input-wrapper">
                  <label for="">Дата</label>
                  <input class="input-short" v-model="this.date" type="date">
                </div>
              </div>
            </div>
            <button class="buttons__btn" @click="addPositionRow">Добавить позицию вручную</button>
          </div>
          <div class="positions">
            <div class="positions__header">
              <h3 class="positions__header__text">Позиции</h3>
            </div>
            <div class="table-section__container">
              <div class="table">
                <div class="table__header">
                    <div class="table-cell-header">№</div>
                    <div class="table-cell-header">Услуга товар</div>
                    <div class="table-cell-header">Наименование</div>
                    <div class="table-cell-header">Ед.<br>измер.</div>
                    <div class="table-cell-header">Кол-во</div>
                    <div class="table-cell-header">Цена<br>без НДС</div>
                    <div class="table-cell-header">Сумма<br>без НДС</div>
                    <div class="table-cell-header">НДС, %</div>
                    <div class="table-cell-header">Сумма<br>НДС</div>
                    <div class="table-cell-header">Сумма<br>с НДС</div>
                    <div class="table-cell-header">Совместим<br>с</div>
                    <div class="table-cell-header">Удаление</div>
                </div>
                <div class="table__row" v-for="(position, index) in positions" :key="index">
                  <div class="table-cell">{{ index+1 }}</div>
                  <div class="table-cell">
                    <input class="table-cell-input" type="text" v-model="position.type">
                  </div>
                  <div class="table-cell">
                    <input class="table-cell-input" type="text" v-model="position.name">
                  </div>
                  <div class="table-cell">
                    <input class="table-cell-input" type="text" v-model="position.unit">
                  </div>
                  <div class="table-cell">
                    <input class="table-cell-input" type="number" v-model="position.quantity">
                  </div>
                  <div class="table-cell">
                    <input class="table-cell-input" type="number" step="0.01" v-model="position.price">
                  </div>
                  <div class="table-cell">{{ (position.quantity * position.price).toFixed(2) }}</div>
                  <div class="table-cell">
                    <input class="table-cell-input" type="number" step="0.01" v-model="position.NDS">
                  </div>
                  <div class="table-cell">{{ ((position.quantity * position.price) * position.NDS / 100).toFixed(2) }}</div>
                  <div class="table-cell">{{ (((position.quantity * position.price) * position.NDS / 100) + (position.quantity * position.price)).toFixed(2) }}</div>
                  <div class="table-cell">
                    <button class="table-button" @click="openCompatibilityPopup(position)">{{ (position.compatibleWith.length > 0) ? 'Посмотреть' : 'Отметить' }}</button>
                  </div>
                  <div class="table-cell">
                    <button class="table-button table-button--remove" @click="removePositionRow(position)">
                      <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="50px" height="50px"><path d="M 21 0 C 19.355469 0 18 1.355469 18 3 L 18 5 L 10.1875 5 C 10.0625 4.976563 9.9375 4.976563 9.8125 5 L 8 5 C 7.96875 5 7.9375 5 7.90625 5 C 7.355469 5.027344 6.925781 5.496094 6.953125 6.046875 C 6.980469 6.597656 7.449219 7.027344 8 7 L 9.09375 7 L 12.6875 47.5 C 12.8125 48.898438 14.003906 50 15.40625 50 L 34.59375 50 C 35.996094 50 37.1875 48.898438 37.3125 47.5 L 40.90625 7 L 42 7 C 42.359375 7.003906 42.695313 6.816406 42.878906 6.503906 C 43.058594 6.191406 43.058594 5.808594 42.878906 5.496094 C 42.695313 5.183594 42.359375 4.996094 42 5 L 32 5 L 32 3 C 32 1.355469 30.644531 0 29 0 Z M 21 2 L 29 2 C 29.5625 2 30 2.4375 30 3 L 30 5 L 20 5 L 20 3 C 20 2.4375 20.4375 2 21 2 Z M 11.09375 7 L 38.90625 7 L 35.3125 47.34375 C 35.28125 47.691406 34.910156 48 34.59375 48 L 15.40625 48 C 15.089844 48 14.71875 47.691406 14.6875 47.34375 Z M 18.90625 9.96875 C 18.863281 9.976563 18.820313 9.988281 18.78125 10 C 18.316406 10.105469 17.988281 10.523438 18 11 L 18 44 C 17.996094 44.359375 18.183594 44.695313 18.496094 44.878906 C 18.808594 45.058594 19.191406 45.058594 19.503906 44.878906 C 19.816406 44.695313 20.003906 44.359375 20 44 L 20 11 C 20.011719 10.710938 19.894531 10.433594 19.6875 10.238281 C 19.476563 10.039063 19.191406 9.941406 18.90625 9.96875 Z M 24.90625 9.96875 C 24.863281 9.976563 24.820313 9.988281 24.78125 10 C 24.316406 10.105469 23.988281 10.523438 24 11 L 24 44 C 23.996094 44.359375 24.183594 44.695313 24.496094 44.878906 C 24.808594 45.058594 25.191406 45.058594 25.503906 44.878906 C 25.816406 44.695313 26.003906 44.359375 26 44 L 26 11 C 26.011719 10.710938 25.894531 10.433594 25.6875 10.238281 C 25.476563 10.039063 25.191406 9.941406 24.90625 9.96875 Z M 30.90625 9.96875 C 30.863281 9.976563 30.820313 9.988281 30.78125 10 C 30.316406 10.105469 29.988281 10.523438 30 11 L 30 44 C 29.996094 44.359375 30.183594 44.695313 30.496094 44.878906 C 30.808594 45.058594 31.191406 45.058594 31.503906 44.878906 C 31.816406 44.695313 32.003906 44.359375 32 44 L 32 11 C 32.011719 10.710938 31.894531 10.433594 31.6875 10.238281 C 31.476563 10.039063 31.191406 9.941406 30.90625 9.96875 Z"/></svg>
                    </button>
                    <div class="compability-popup-overlay" v-if="isCompabilityPopupVisible" @click="closeCompatibilityPopup">
                      <div class="compability-popup" @click.stop>
                        <div class="header">
                          <h1 class="header__text">НАСТРОЙКА СОВМЕСТИМОСТИ</h1>
                          <hr class="div-line">
                        </div>
                        <input class="compability-popup__input" type="text" @input="handleSearch" v-model="searchText" placeholder="Начните вводить наименование и/или выберите из списка...">
                        <div class="products-list">
                          <div class="products-list__item" v-for="product in filteredItems" :key="product.id">
                            <p>{{ product.name }}</p>
                            <input type="checkbox" v-model="product.isCompatible">
                          </div>
                        </div>
                        <button @click="addCompabilityArrayTo">Подтвердить</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="footer">
            <button class="buttons__btn" @click="createOrder">Внести поставку</button>
            <button class="buttons__btn" @click="closePopup">Закрыть</button>
            <input type="file" @change="handleFileUpload" />
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import SubmitForm from './SubmitForm.vue'
import mammoth from 'mammoth'
import { mapGetters, mapActions } from 'vuex'
import '@/styles/buttonsStyles.sass'

export default {
  data () {
    return {
      isCompabilityPopupVisible: false,
      isInputActive: false,
      isSubmitFormVisible: false,
      UPD_SF_Number: '',
      date: '',
      status: '',
      supplierName: '',
      supplierAdress: '',
      supplierINN: '',
      supplierKPP: '',
      supplyDocumentNumber: '',
      payDocumentNumber: '',
      NDSto: '',
      restoreNDS: '',
      warehouse: '',
      products: [],
      positions: [],
      filteredItems: [],
      file: ''
    }
  },
  mounted () {
    this.fetchProducts().then(() => {
      this.filteredItems = this.getProducts
    })
  },
  computed: {
    ...mapGetters(['getProducts'])
  },
  methods: {
    ...mapActions(['fetchProducts']),
    addCompabilityArrayTo () {
      const compatibleProducts = this.filteredItems.filter(filteredItem => filteredItem.isCompatible === true)
      this.currentPosition.compatibleWith = compatibleProducts
      this.closeCompatibilityPopup()
    },
    handleSearch () {
      console.log(this.filteredItems)
      const searchText = this.searchText.toLowerCase()
      if (searchText === '') {
        this.filteredItems = this.getProducts
      } else {
        this.filteredItems = this.filteredItems.filter(item => {
          return (
            item.name.toLowerCase().includes(searchText)
          )
        })
      }
    },
    closeCompatibilityPopup () {
      this.filteredItems.forEach(product => {
        product.isCompatible = false
      })
      this.isCompabilityPopupVisible = false
      this.currentPosition = null
    },
    openCompatibilityPopup (position) {
      this.currentPosition = position
      if (position.compatibleWith.length > 0) {
        position.compatibleWith.forEach(compatibleProduct => {
          const productToUpdate = this.filteredItems.find(product => product.id === compatibleProduct.id)

          if (productToUpdate) {
            productToUpdate.isCompatible = true
          }
        })
      } else {
        this.filteredItems = this.getProducts
      }
      this.isCompabilityPopupVisible = true
    },
    handleFileUpload (event) {
      // Сохраните файл в переменной для дальнейшей обработки
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()

        reader.onload = () => {
          const arrayBuffer = reader.result
          this.parseDocx(arrayBuffer)
        }

        reader.readAsArrayBuffer(file)
      }
    },
    parseDocx (arrayBuffer) {
      mammoth.extractRawText({ arrayBuffer: arrayBuffer })
        .then((result) => {
          const text = result.value
          const lines = text.split('\n')

          // for (let index = 360; index < 450; index++) {
          //   console.log(lines[index])
          // }

          this.UPD_SF_Number = lines[4]
          this.date = lines[8]
          this.status = lines[48]
          this.supplierName = lines[34]
          this.supplierAdress = lines[42]
          this.supplierINN = lines[56]
          this.payDocumentNumber = lines[78]
          console.log(lines[84]) // поставка

          let i = 208 // первая строка с наименованием товара
          while (lines[i] !== '') {
            console.log(lines[i])
            console.log(lines[i + 4])
            console.log(lines[i + 6])
            console.log(lines[i + 8])
            console.log(lines[i + 10])
            console.log(lines[i + 12])
            console.log(lines[i + 16])
            console.log(lines[i + 18])
            console.log(lines[i + 20])
            this.addPositionRow2(lines[i], lines[i + 6], lines[i + 8], lines[i + 10], lines[i + 12], lines[i + 16], lines[i + 18], lines[i + 20])
            i = i + 34
          }

          this.supplyDocumentNumber = lines[i + 90] // 366
        })
        .catch((error) => {
          console.error('Ошибка при извлечении текста из файла:', error)
        })
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
      this.positions[index].compatibleWith = product.name
      this.positions[index].product_id = product.id
      this.selectedProduct = null
    },
    async fetchProductsFromServer () {
      await this.fetchProducts().then(() => {
        this.filteredItems = this.getProducts
      })
    },
    addPositionRow () {
      const newPosition = {
        type: '',
        name: '',
        unit: '',
        quantity: 0,
        price: 0,
        sum: 0,
        NDS: 0,
        NDSsum: 0,
        sumWithNDS: 0,
        compatibleWith: ''
      }
      this.positions.push(newPosition)
    },
    addPositionRow2 (name, unit, quantity, price, sum, NDS, NDSsum, sumWithNDS) {
      if (NDS === 'Без НДС') {
        NDS = 0
      }
      const newPosition = {
        type: '2',
        name: name,
        unit: unit,
        quantity: Number(quantity),
        price: parseFloat(price.replace(/\s/g, '').replace(',', '.')),
        sum: parseFloat(sum.replace(/\s/g, '').replace(',', '.')),
        NDS: NDS,
        NDSsum: parseFloat(NDSsum.replace(/\s/g, '').replace(',', '.')),
        sumWithNDS: parseFloat(sumWithNDS.replace(/\s/g, '').replace(',', '.')),
        compatibleWith: '2'
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
      console.log(this.positions)
      this.isSubmitFormVisible = true
    },
    async confirmActions () {
      const details = []
      this.positions.forEach(position => {
        const detail = {
          name: position.name,
          unit: position.unit,
          supplied: position.quantity,
          written_off: 0,
          supply_date: this.date,
          UPD_SF_number: this.UPD_SF_Number,
          supplier_name: this.supplierName,
          supplier_INN_KPP: this.supplierINN,
          price: position.price,
          compatibleWith: position.compatibleWith.map(product => product.id)
        }
        details.push(detail)
      })
      try {
        await this.$store.dispatch('createDetails', details)

        console.log('Потребности сделаны')
        this.$emit('supply-entered')
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
  width: fit-content
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
.products-list
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
.products-list__item
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
.input-column-left
  display: flex
  flex-direction: row
  width: 25%
.input-column-right
  display: flex
  flex-direction: row
  width: 75%
  gap: 5px
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
  height: 330px
  overflow-y: auto

.table
  display: grid
  width: 100%
  justify-content: center
  grid-template-columns: 5% 8% 15% 5% 8% 8% 8% 6% 9% 9% 11% 8%
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
.footer
  margin-top: 20px
  display: flex
  justify-content: center
</style>
