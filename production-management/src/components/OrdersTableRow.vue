<template>
    <div class="table__row">
      <div class="cell cell1">№ 1</div>
      <div class="cell cell2">2</div>
      <div class="cell cell3">3</div>
      <div class="cell cell4">1</div>
      <div class="cell cell5">1</div>
      <div class="cell cell6">
        <div class="position" v-for="index in 3" :key="index">
            1
        </div>
      </div>
      <div class="cell cell7">
        <div class="quantity" v-for="index in 3" :key="index">
            1
        </div>
      </div>
      <div class="cell cell8">
        <div class="ready" v-for="index in 3" :key="index">
            <input type="checkbox">
        </div>
      </div>
      <div class="cell cell9">
        <button class="button" @click="this.$emit('open-popup')">Отгрузить</button>
      </div>
      <div class="cell cell10">1</div>
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
// 5% 20% 6% 6% 10% 20% 6% 7% 10% 10%
.table__row
  display: flex
  border: 1px solid black
  width: 100%
  height: 100%
  flex-direction: row
  font-size: 12px
  text-align: center
.cell
  display: flex
  flex-direction: row
  align-items: center
  justify-content: center
.cell1
  width: 5%
.cell2
  width: 20%
.cell3
  width: 7%
.cell4
  width: 7%
.cell5
  width: 11%
.position
  display: flex
.quantity
  display: flex
.ready
  display: flex
.cell6
  flex-direction: column
  justify-content: space-evenly
  gap: 7px
  width: 17%
.cell7
  flex-direction: column
  justify-content: space-evenly
  gap: 7px
  width: 6%
.cell8
  flex-direction: column
  justify-content: space-evenly
  gap: 7px
  width: 7%
.cell9
  width: 10%
.cell10
  width: 10%
.button
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
