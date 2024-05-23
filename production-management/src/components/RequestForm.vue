<template>
    <div class="popup-overlay" @click="closePopup">
        <div class="popup" @click.stop>
          <div class="header">
              <h1 class="header__text">ЗАПРОС НА ПОСТАВКУ</h1>
              <hr class="div-line">
          </div>
          <div class="content">
            <div class="intro-info">
              <div class="input-line">
                <label for="">Дата</label>
                <input type="date" v-model="this.UPD_SF_date" required>
                <label for="">Контактное лицо (имя, отчество)</label>
                  <input v-model="this.supplierName" type="text">
              </div>
              <div class="input-line">
                <div class="input-wrapper">
                  <label for="">Предоставить до:</label>
                  <input class="input-short" v-model="this.date" type="date" required>
                </div>
              </div>
            </div>
            <div class="positions">
              <div class="positions__header">
                <h3 class="positions__header__text">Позиции</h3>
              </div>
              <div class="positions__text">
                <textarea class="text" name="" id="" cols="30" rows="10" placeholder="Введите запрос..."></textarea>
              </div>
            </div>
            <div class="footer">
              <button @click="closePopup" class="buttons__btn">Подтвердить</button>
              <button @click="closePopup" class="buttons__btn">Закрыть</button>
              <button class="buttons__btn" @click="generateDocument">Сгенерировать документ</button>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import store from '@/store'

export default {
  data () {
    return {
      isPopupVisible: false
    }
  },
  computed: {
    organisation () {
      return store.state.organisation
    }
  },
  methods: {
    closePopup () {
      this.isPopupVisible = false
      this.$emit('close-popup')
    }
  }
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
  margin: 5px
.positions__header__text
  font-weight: 700
.positions__text
  display: flex
  justify-content: center
.text
  width: 100%
.footer
  display: flex
  margin-top: 20px
  gap: 5px
  justify-content: center
</style>
