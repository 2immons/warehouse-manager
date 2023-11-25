<template>
    <div class="table-row">
      <div class="table-cell">1</div>
      <div class="table-cell">2</div>
      <div class="table-cell">3</div>
      <div class="table-cell">1</div>
      <div class="table-cell">1</div>
      <div class="table-cell">1</div>
      <div class="table-cell">1</div>
      <div class="table-cell">1</div>
      <div class="table-cell">1</div>
      <div class="table-cell">1</div>
      <div class="table-cell">1</div>
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
  height: 15px
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
</style>
