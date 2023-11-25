<template>
    <div class="table-row">
      <div class="table-cell">1</div>
      <div class="table-cell">2</div>
      <div class="table-cell">3</div>
      <div class="table-cell">3</div>
      <div class="table-cell">1</div>
      <div class="table-cell">
        <button class="table-button" @click="this.$emit('open-popup')">Произвести</button>
      </div>
      <div class="table-cell"><input type="checkbox"></div>
    </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style lang="sass" scoped>
.table-row
  display: contents
  font-size: 12px
  text-align: center
.table-cell
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  text-align: center
  border: 1px solid #ddd
  padding: 1px
  font-size: 12px
  overflow: hidden
  white-space: nowrap
  text-overflow: ellipsis
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
</style>
