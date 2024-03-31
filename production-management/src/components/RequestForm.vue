<template>
    <div class="popup-overlay" @click="closePopup">
        <div class="popup" @click.stop>
          <div class="header">
              <h1 class="header__text">ЗАПРОС НА ПОСТАВКУ</h1>
              <hr class="div-line">
          </div>
          <div class="content">
            <div class="intro-info">
              Общая информация {{ organisation.name }}
            </div>
            <div class="positions">
              <div class="positions__header">
                <h3>Заголовок</h3>
              </div>
              <div class="positions__content">
                Позиции
              </div>
            </div>
            <div class="footer">
              <button @click="closePopup" class="buttons__btn">Подтвердить</button>
              <button @click="closePopup" class="buttons__btn">Закрыть</button>
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
.positions__content
  display: flex
  flex-direction: column
  align-items: flex-start
.footer
  display: flex
  margin-top: 20px
  gap: 5px
  justify-content: center
</style>
