<template>
    <div class="popup-overlay" @click="closePopup">
      <SubmitForm v-if="isSubmitFormVisible" @confirm="confirmActions" @deny="denyActions"/>
      <div v-if="!isSubmitFormVisible" class="popup" @click.stop>
        <div class="header">
            <h1 class="header__text">ДОБАВЛЕНИЕ ДОКУМЕНТА</h1>
            <hr class="div-line">
        </div>
        <div class="content">
          <form class="content__inputs" @submit.prevent>
            <label for="">Имя файла</label>
            <input v-model="title" type="text">

            <label for="">Описание файла</label>
            <input v-model="description" type="text">

            <label for="">Выбрать стандартность для:</label>

            <div class="document-types">
              <div class="type">
                <input type="radio" id="option1" value="1" v-model="type">
                <label for="option1">Акт о приозводстве</label>
              </div>
              <div class="type">
                <input type="radio" id="option2" value="2" v-model="type">
                <label for="option2">Списание на производство</label>
              </div>
              <div class="type">
                <input type="radio" id="option3" value="3" v-model="type">
                <label for="option3">Запрос на поставку</label>
              </div>
            </div>

            <label for="">Загрузить</label>
            <input type="file" @change="handleFileUpload">
          </form>
          <div class="footer">
            <button class="buttons__btn" @click="createDocument">Добавить документ</button>
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
      title: '',
      description: '',
      file_data: '',
      isDefault: '',
      type: ''
    }
  },
  methods: {
    closePopup () {
      this.$emit('close-popup')
    },
    createDocument () {
      this.isSubmitFormVisible = true
    },
    async confirmActions () {
      try {
        await this.$store.dispatch('createDocument', {
          title: this.title,
          description: this.description,
          file_data: this.file_data
        })

        const currentDateTime = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Samara' })

        await this.$store.dispatch('createLog', {
          user_id: Number(sessionStorage.getItem('userId')),
          operation: 'добавлен шаблон документа: ' + this.title,
          date: currentDateTime.toString().slice(0, 19).replace('T', ' ')
        })

        this.isSubmitFormVisible = false
        this.$emit('create-document')
        this.closePopup()
      } catch (error) {
        console.error('Ошибка при создании документа:', error)
      }
    },
    denyActions () {
      console.log('Создание документа отменено')
      this.isSubmitFormVisible = false
    },
    handleFileUpload (event) {
      const file = event.target.files[0]
      const reader = new FileReader()

      reader.onload = (e) => {
        const byteArray = new Uint8Array(reader.result)
        this.file_data = byteArray
      }

      reader.readAsArrayBuffer(file)
    }
  },
  components: { SubmitForm }
}
</script>

<style scoped lang="sass">
.popup-overlay
  display: flex
  top: 0
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
  min-width: 350px
  width: 40%
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
.content__inputs
  display: flex
  flex-direction: column
  gap: 5px
  input[type=text]
    height: 30px
    display: flex
    background-color: #fff
    border: 1px solid #ccc
    border-radius: 4px
    padding: 0 10px
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)
.document-types
  display: flex
  flex-direction: column
.type
  display: flex
  justify-content: left
  text-align: left
.footer
  display: flex
  margin-top: 20px
  gap: 5px
  justify-content: center
</style>
