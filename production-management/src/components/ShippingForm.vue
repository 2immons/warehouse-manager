<template>
    <div class="popup-overlay" @click="closePopup">
      <SubmitForm v-if="isSubmitFormVisible" @confirm="confirmActions" @deny="denyActions"/>
        <div v-if="!isSubmitFormVisible" class="popup" @click.stop>
          <div class="header">
              <h1 class="header__text">ОТГРУЗКА ПРОДУКЦИИ</h1>
              <hr class="div-line">
          </div>
          <div class="content">
            <div class="intro-info">
              <p for="">Заказ №: {{ this.currentOrder.id }}</p>
              <p for="">Документ №: {{ this.currentOrder.doc_number }}</p>
              <p for="">Клиент: {{ this.currentOrder.client_name }}</p>
              <p for="">Адрес клиента: {{ this.currentOrder.client_adress }}</p>
              <p for="">ИНН клиента: {{ this.currentOrder.client_inn }}</p>
              <p for="">КПП клиента: {{ this.currentOrder.client_kpp }}</p>
              <p for="">Дата создания заказа: {{ this.currentOrder.creation_date }}</p>
              <p for="">Исполнить до: {{ this.currentOrder.deadline }}</p>
              <br>
              <label for="">Дата отгрузки</label>
              <input v-model="this.deadline" type="date">
            </div>
            <div class="positions">
              <div class="positions__header">
                <h3 class="positions__header__text">Позиции</h3>
              </div>
              <div class="table-section__container">
                <div class="table">
                  <div class="table__header">
                      <div class="table-cell-header">№</div>
                      <div class="table-cell-header">Наименование продукта</div>
                      <div class="table-cell-header">Количество</div>
                      <div class="table-cell-header">Готовность</div>
                  </div>
                  <div class="table__row" v-for="(item, index) in currentOrder.positions" :key="index">
                    <div class="table-cell">{{ index+1 }}</div>
                    <div class="table-cell">
                      {{ item.product_name }}
                    </div>
                    <div class="table-cell">
                      {{ item.quantity }}
                    </div>
                    <div class="table-cell">
                      {{ item.is_ready_to_ship ? "Готово" : "Не готово" }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="footer">
              <button class="buttons__btn" @click="shipProduct">Отгрузить</button>
              <button class="buttons__btn" @click="closePopup">Закрыть</button>
              <input type="file" ref='fileInput' />
              <button class="buttons__btn" @click="generateDocument">Сгенерировать документ</button>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import SubmitForm from './SubmitForm.vue'
import { mapGetters, mapActions } from 'vuex'
import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import saveAs from 'file-saver'

export default {
  data () {
    return {
      isSubmitFormVisible: false,
      date: '',
      uploadedFile: null
    }
  },
  props: {
    currentOrder: Object
  },
  computed: {
    ...mapGetters(['getProducts'])
  },
  methods: {
    generateDocument () {
      const fileInput = this.$refs.fileInput

      if (!fileInput.files || fileInput.files.length === 0) {
        return
      }

      const file = fileInput.files[0]
      const reader = new FileReader()

      reader.onload = (event) => {
        const data = event.target.result
        this.generateDocx(data)
      }

      reader.readAsArrayBuffer(file)
    },
    generateDocx (data) {
      const zip = new PizZip(data)
      const doc = new Docxtemplater(zip)

      const templateData = {
        SF_number: '84',
        SF_date: '23.22.22',
        organisationName: 'век1',
        organisationAdress: 'век2',
        organisationINN_KPP: 'век3',
        clientName: this.currentOrder.client_name,
        clientAdress: '',
        clientINN_KPP: 'ИНН 23423424234234234',
        documentNumber: this.currentOrder.doc_number,
        positions: this.currentOrder.positions
      }

      doc.setData(templateData)
      doc.render()

      const generatedDocBuffer = doc.getZip().generate({
        type: 'blob',
        mimeType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      })

      const fileName = 'УПД_' + 2 + '_от_' + '22.22.2002г' + '_' + 'ВЕКТОР' + '_для_' + this.currentOrder.client_name.replace(/\s/g, '_') + '.docx'

      saveAs(generatedDocBuffer, fileName)
    },
    ...mapActions(['fetchProducts']),
    async fetchProductsFromServer () {
      await this.fetchProducts().then(() => {
        this.products = this.getProducts
      })
    },
    closePopup () {
      this.$emit('close-popup')
    },
    shipProduct () {
      this.isSubmitFormVisible = true
    },
    async confirmActions () {
      try {
        await this.$store.dispatch('updateOrder', {
          client_id: this.currentOrder.client_id,
          is_commercial_secret: this.currentOrder.isCommercialSecret,
          creation_date: this.currentOrder.creation_date,
          deadline: this.currentOrder.deadline,
          doc_number: this.currentOrder.doc_number,
          shipping_status: true,
          requirements: this.currentOrder.requirements,
          id: this.currentOrder.id
        })

        let products = []
        await this.fetchProducts().then(() => {
          products = this.getProducts
        })

        const ordersDates = []

        this.currentOrder.positions.forEach(position => {
          products.forEach(product => {
            if (position.product_id === product.id) {
              product.shipped = product.shipped + position.quantity
              ordersDates.push({ product_id: position.product_id, order_id: this.currentOrder.id, shipping_date: this.date, quantity: position.quantity })
            }
          })
        })

        await this.$store.dispatch('updateProducts', products)
        await this.$store.dispatch('createShipping', ordersDates)

        const currentDateTime = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Samara' })

        await this.$store.dispatch('createLog', {
          user_id: Number(sessionStorage.getItem('userId')),
          operation: 'отгружен заказ №' + this.currentOrder.id,
          date: currentDateTime.toString().slice(0, 19).replace('T', ' ')
        })

        this.isSubmitFormVisible = false
        console.log('Заказ отгружен')
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
  margin: 5px
.positions__header__text
  font-weight: 700
.positions__content
  display: flex
  flex-direction: column
  align-items: flex-start

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

.footer
  display: flex
  margin-top: 20px
  gap: 5px
  justify-content: center
</style>
