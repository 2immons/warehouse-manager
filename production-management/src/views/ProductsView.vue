<template>
    <div class="page">
        <ProduceForm v-if="isProduceFormVisible" @close-popup="closeProduceForm"/>
        <CreateProductForm v-if="isCreateProductFormVisible" @close-popup="closeCreateProductForm"/>
        <Transition :name="isSideBarAnimate ? 'v' : null">
            <SideBar v-if="isSideBarVisible" @close-sidebar="closeSideBar" msg="Welcome to Your Vue.js App"/>
        </Transition>
        <div class="container">
            <PageHeader @open-sidebar="openSideBar" @click="handleClickOutside"/>
            <section class="table-section" @click="handleClickOutside">
                <div class="table-section__header">
                    <div class="text-search">
                      <input type="text" placeholder="Поиск" class="text-search__text">
                    </div>
                    <div class="date-searches">
                        <div class="date-search">
                          <label for="">С</label>
                          <input type="date" class="date-search__date">
                        </div>
                        <div class="date-search">
                          <label for="">До</label>
                          <input type="date" class="date-search__date">
                        </div>
                    </div>
                    <div class="buttons">
                        <button class="buttons__btn" @click="openCreateProductForm">Создать оборудование</button>
                        <button class="buttons__btn" @click="submitActions">Подтвердить</button>
                    </div>
                </div>
                <div class="table-section__container">
                    <div class="table">
                        <div class="table__header">
                            <div class="table-cell">№</div>
                            <div class="table-cell">Наименование</div>
                            <div class="table-cell">Кол-во<br>на складе</div>
                            <div class="table-cell">Произведено</div>
                            <div class="table-cell">Отгружено</div>
                            <div class="table-cell">Произвести</div>
                            <div class="table-cell">Готово<br>к отгрузке</div>
                        </div>
                        <div class="table__rows" v-for="index in 100" :key="index">
                            <ProductsTableRow @open-popup="openProduceForm"/>
                        </div>
                    </div>
                </div>
            </section>
            <PageFooter/>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import SideBar from '@/components/SideBar.vue'
import PageHeader from '@/components/PageHeader.vue'
import ProduceForm from '@/components/ProduceForm.vue'
import ProductsTableRow from '@/components/ProductsTableRow.vue'
import CreateProductForm from '@/components/CreateProductForm.vue'
import PageFooter from '@/components/PageFooter.vue'

export default {
  name: 'DetailsView',
  components: {
    SideBar, PageHeader, PageFooter, ProduceForm, ProductsTableRow, CreateProductForm
  },
  data () {
    return {
      isProduceFormVisible: false,
      isCreateProductFormVisible: false,
      isSideBarVisible: false,
      isSideBarAnimate: window.innerWidth < 1780
    }
  },
  mounted () {
    // Вызываем метод handleResize при монтировании компонента для установки начального значения
    this.handleResize()
    // Добавляем обработчик изменения размера окна
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount () {
    // Удаляем обработчик при уничтожении компонента
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleClickOutside () {
      if (window.innerWidth < 1780) {
        this.closeSideBar()
      }
    },
    handleResize () {
      // Используем медиа-запрос, чтобы определить, когда показывать компонент
      this.isSideBarVisible = window.innerWidth > 1780 // Например, компонент виден при ширине экрана больше 768px
    },
    openSideBar () {
      this.isSideBarVisible = true
    },
    closeSideBar () {
      this.isSideBarVisible = false
    },
    openProduceForm () {
      this.isProduceFormVisible = true
    },
    closeProduceForm () {
      this.isProduceFormVisible = false
    },
    openCreateProductForm () {
      this.isCreateProductFormVisible = true
    },
    closeCreateProductForm () {
      this.isCreateProductFormVisible = false
    },
    submitActions () {
      console.log(2)
    }
  }
}
</script>

<style lang="sass" scoped>
.v-enter-active, .v-leave-active
    transition: transform 0.3s ease
.v-enter-from, .v-leave-to
    transform: translateX(-100%)
.page
    display: flex
    flex-direction: row
    width: 100%
    height: 100vh
.container
    display: flex
    flex-direction: column
    width: 100%
.table-section
    display: flex
    flex-direction: column
    align-items: center
    align-content: center
    width: 100%
.table-section__header
    display: flex
    flex-direction: row
    justify-content: center
    align-items: center
    width: 99%
    gap: 50px
    height: 50px
.text-search
  display: flex
  width: 30%
.text-search__text
    width: 100%
    height: 30px
    display: flex
    align-items: center
    background-color: #fff
    border: 1px solid #ccc
    border-radius: 4px
    padding: 0 10px
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)
.date-searches
    width: 40%
    height: 26px
    display: flex
    flex-direction: row
    align-items: center
    justify-content: flex-end
    &:hover, &:focus
        cursor: pointer
.date-search
  display: flex
  flex-direction: row
  justify-content: center
  align-items: center
  gap: 5px
.date-search__date
  height: 30px
  width: 80%
  padding: 6px 12px
  font-size: 14px
  border: 1px solid #ccc
  border-radius: 12px
  outline: none
  box-sizing: border-box
  transition: border-color 0.3s
  &:hover, &:focus
      border-color: #007bff
.buttons
    display: flex
    flex-direction: row
    width: 30%
    justify-content: space-evenly
    gap: 2%
    align-items: center
.buttons__btn
    display: flex
    justify-content: center
    align-items: center
    height: 30px
    width: 60%
    background-color: #CDD3E2
    color: #fff
    border: 1px solid rgba(0,0,0,0.30)
    border-radius: 12px
    color: black
    padding: 6px
    font-size: 12px
    font-weight: 700
    cursor: pointer
    transition: background-color 0.3s
    &:hover
        background-color: darken(#CDD3E2, 10%)
.buttons__btn--create
    background-color: #A7B1CA
    &:hover
        background-color: darken(#A7B1CA, 20%)
.table-section__container
    border: 1px solid black
    display: flex
    flex-direction: column
    align-items: center
    align-content: center
    width: 99%
    height: 650px
    overflow-y: auto
.table
    display: grid
    width: 100%
    justify-content: center
    grid-template-columns: 5% 26% 12% 12% 10% 20% 15%
.table__header
    font-weight: 700
.table__header, .table-row, .table__rows
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
table-header .table-cell
    background-color: #f2f2f2
/* Адаптивные стил для таблицы */
// @media (max-width: 600px) {
//     .table-container {
//     grid-template-columns: repeat(1, 1fr);
//     }
// }
</style>
