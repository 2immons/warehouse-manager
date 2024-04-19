<template>
    <div class="popup-overlay" @click="denyAction">
        <div class="popup" @click.stop>
          <div class="header">
              <h1 class="header__text">ВЫ УВЕРЕНЫ?</h1>
              <hr class="div-line">
          </div>
          <div class="content">
            <div class="content__buttons">
              <button class="button button--deny" @click="denyAction">Нет, отменить</button>
              <button class="button button--confirm" @click="confirmAction">Да, подтвердить</button>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      isPopupVisible: false
    }
  },
  methods: {
    confirmAction () {
      this.$emit('confirm')
    },
    denyAction () {
      this.$emit('deny')
    }
  }
}
</script>

<style scoped lang="sass">
.popup-overlay
  z-index: 5
  display: flex
  justify-content: center
  align-items: center
  position: fixed
  width: 100%
  height: 100%
  background: rgba(0, 0, 0, 0.7)
  z-index: 2

.popup
  z-index: 7
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
  display: flex
  flex-direction: column
  width: 95%
.content__buttons
  display: flex
  flex-direction: raw
  justify-content: space-evenly
  margin: 20px 0px 20px 0px
.button
  padding: 10px 10px
  width: 150px
  border-radius: 12px
  font-size: 15px
  font-weight: 700
  color: #ffffff
.button--confirm
  background-color: #4CAF50
  border-color: lighten(#4CAF50, 10%)
  &:hover
    background-color: lighten(#4CAF50, 5%)
  &:active
    background-color: lighten(#4CAF50, 7%)
.button--deny
  background-color: #FF3333
  border-color: lighten(#FF3333, 10%)
  &:hover
    background-color: lighten(#FF3333, 5%)
  &:active
    background-color: lighten(#FF3333, 7%)
</style>
