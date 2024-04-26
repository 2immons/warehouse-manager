<template>
    <div class="popup-overlay" @click="closePopup">
      <SubmitForm v-if="isSubmitFormVisible" @confirm="confirmActions" @deny="denyActions"/>
      <div v-if="!isSubmitFormVisible" class="popup" @click.stop>
        <div class="header">
            <h1 class="header__text">ОБНОВЛЕНИЕ ДОКУМЕНТА</h1>
            <hr class="div-line">
        </div>
        <div class="content">
          <div class="content__file-view">
            fff
          </div>
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

            <label for="">Загрузить новый</label>
            <input type="file">
          </form>
          <div class="footer">
            <button class="buttons__btn" @click="updateDocument">Обновить документ</button>
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
      title: this.currentDocument.title,
      description: this.currentDocument.description,
      isDefault: this.currentDocument.isDefault,
      file_data: this.currentDocument.file_data,
      type: this.currentDocument.type
    }
  },
  props: {
    currentDocument: Object
  },
  methods: {
    closePopup () {
      this.$emit('close-popup')
    },
    updateDocument () {
      this.isSubmitFormVisible = true
    },
    async confirmActions () {
      try {
        await this.$store.dispatch('updateDocument', {
          id: this.currentDocument.id,
          title: this.title,
          description: this.description,
          isDefault: this.isDefault,
          file_data: this.file_data,
          type: this.type
        })

        const currentDateTime = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Samara' })

        await this.$store.dispatch('createLog', {
          user_id: Number(sessionStorage.getItem('userId')),
          operation: 'обновлен шаблон документа: ' + this.title,
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
  max-width: 500px
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
.footer
  display: flex
  margin-top: 20px
  gap: 5px
  justify-content: center
</style>
