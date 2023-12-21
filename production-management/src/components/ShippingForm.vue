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
              Общая информация
            </div>
            <div class="positions">
              <div class="positions__header">
                <h3>Заголовок</h3>
              </div>
              <div class="positions__content">
                {{ this.currentOrder }}
              </div>
            </div>
            <div class="footer">
              <button @click="shipProduct">Отгрузить</button>
              <button @click="closePopup">Close Popup</button>
              <input type="file" ref='fileInput' />
              <button @click="generateDocument">Generate Document</button>
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

        this.currentOrder.positions.forEach(position => {
          products.forEach(product => {
            if (position.product_id === product.id) {
              product.shipped = product.shipped + position.quantity
            }
          })
        })

        await this.$store.dispatch('updateProducts', products)
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
.positions__content
  display: flex
  flex-direction: column
  align-items: flex-start
.footer
  display: flex
  justify-content: left
</style>
