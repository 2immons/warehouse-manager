<template>
  <div class="page">
    <SubmitForm v-if="isSubmitFormVisible" @confirm="confirmActions" @deny="denyActions"/>
    <ProduceForm v-if="isProduceFormVisible" :currentProduct="this.currentProduct" @close-popup="closeProduceForm" @product-creation="fetchProductsFromServer"/>
    <CreateProductForm v-if="isCreateProductFormVisible" @add-product="fetchProductsFromServer" @close-popup="closeCreateProductForm"/>
    <Transition :name="isSideBarAnimate ? 'v' : null">
        <SideBar v-if="isSideBarVisible" @close-sidebar="closeSideBar"/>
    </Transition>
    <div class="container">
      <PageHeader @open-sidebar="openSideBar" @click="handleClickOutside"/>
      <section class="table-section" @click="handleClickOutside">
        <div class="table-section__header">
          <div class="text-search">
            <div class="text-search-button-wrapper">
              <button class="buttons__btn buttons__btn--search-btn" @click="toggleSearch">{{ searchButtonText }}</button>
              <Transition :name="showDropDown ? 'dl' : null">
                <div class="dropdown-list" v-if="showDropDown">
                  <button class="search-item-button" @click="handleItemClick('Номер №')">Номер №</button>
                  <button class="search-item-button" @click="handleItemClick('Наименование')">Наименование</button>
                  <button class="search-item-button-exit" @click="closeSearch">Закрыть поиск</button>
                </div>
              </Transition>
            </div>
            <div v-if="isSearchInputVisible" class="text-search-input">
              <input v-model="searchText" @input="handleSearch" type="text" :placeholder="isSearchInputDisabled ? 'Выберите колонку' : 'Поиск'" class="text-search__text" :disabled="isSearchInputDisabled">
            </div>
          </div>
          <div class="date-search">
            <div class="text-search-button-wrapper">
              <button class="buttons__btn buttons__btn--search-btn" @click="toggleDateSearch">{{ dateSearchButtonText }}</button>
              <Transition :name="showDropDown ? 'dl' : null">
                <div class="dropdown-list" v-if="showDateDropDown">
                  <button class="search-item-button" @click="handleDateSearchItemClick('Дата производства')">Дата производства</button>
                  <button class="search-item-button" @click="handleDateSearchItemClick('Дата отгрузки')">Дата отгрузки</button>
                  <button class="search-item-button-exit" @click="closeDateSearch">Закрыть поиск</button>
                </div>
              </Transition>
            </div>
            <div v-if="isDateSearchInputVisible" class="date-searches">
              <div class="date-search">
                <label for="">С</label>
                <input v-model="searchDateStart" @input="handleDateSearch" type="date" :placeholder="isSearchInputDisabled ? 'Выберите колонку' : 'Поиск'" class="date-search__date" :disabled="isSearchInputDisabled">
              </div>
              <div class="date-search">
                <label for="">До</label>
                <input v-model="searchDateEnd" @input="handleDateSearch" type="date" :placeholder="isSearchInputDisabled ? 'Выберите колонку' : 'Поиск'" class="date-search__date" :disabled="isSearchInputDisabled">
              </div>
            </div>
          </div>
          <div class="buttons">
            <button class="buttons__btn" @click="openCreateProductForm">Создать оборудование</button>
            <button class="buttons__btn" @click="openSubmitForm">Подтвердить готовность</button>
          </div>
        </div>
        <div class="table-section__container">
          <div class="table">
              <div class="table__header">
                  <div class="table-cell-header">№
                    <button class="sort-btn" @click="toggleSort('id')">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="gray" class="bi bi-heart" viewBox="0 0 16 16">
                        <path d="M8 0l8 8-8 8-8-8z"/>
                      </svg>
                    </button>
                  </div>
                  <div class="table-cell-header">Наименование
                    <button class="sort-btn" @click="toggleSort('name')">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="gray" class="bi bi-heart" viewBox="0 0 16 16">
                        <path d="M8 0l8 8-8 8-8-8z"/>
                      </svg>
                    </button>
                  </div>
                  <div class="table-cell-header">Произведено
                    <button class="sort-btn" @click="toggleSort('produced')">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="gray" class="bi bi-heart" viewBox="0 0 16 16">
                        <path d="M8 0l8 8-8 8-8-8z"/>
                      </svg>
                    </button>
                  </div>
                  <div class="table-cell-header">Отгружено
                    <button class="sort-btn" @click="toggleSort('shipped')">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="gray" class="bi bi-heart" viewBox="0 0 16 16">
                        <path d="M8 0l8 8-8 8-8-8z"/>
                      </svg>
                    </button>
                  </div>
                  <div class="table-cell-header">Остаток<br>на складе
                    <button class="sort-btn" @click="toggleSort('balance')">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="gray" class="bi bi-heart" viewBox="0 0 16 16">
                        <path d="M8 0l8 8-8 8-8-8z"/>
                      </svg>
                    </button>
                  </div>
                  <div class="table-cell-header">Произвести</div>
                  <div class="table-cell-header">Готово<br>к отгрузке
                    <button class="sort-btn" @click="toggleSort('ready_to_ship')">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="gray" class="bi bi-heart" viewBox="0 0 16 16">
                        <path d="M8 0l8 8-8 8-8-8z"/>
                      </svg>
                    </button>
                  </div>
              </div>
              <div class="table__row" v-for="(item, index) in sortedItems" :key="index">
                <div class="table-cell">{{ item.id }}</div>
                <div class="table-cell">{{ item.name }}</div>
                <div class="table-cell">{{ item.produced }}</div>
                <div class="table-cell">{{ item.shipped }}</div>
                <div class="table-cell">{{ item.produced - item.shipped }}</div>
                <div class="table-cell">
                  <button class="table-button" @click="openProduceForm(item)">Произвести</button>
                </div>
                <div class="table-cell table-cell--input">
                  <input class="table-cell-input" type="number" v-model="item.ready_to_ship" @change="addLogToLogsArray(item)">
                  <button class="button-clear-input" @click="clearInput(item)">=остаток</button>
                </div>
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
import CreateProductForm from '@/components/CreateProductForm.vue'
import PageFooter from '@/components/PageFooter.vue'
import SubmitForm from '@/components/SubmitForm.vue'
import { mapGetters, mapActions } from 'vuex'
import '@/styles/buttonsStyles.sass'

export default {
  emits: ['open-sidebar'],
  name: 'productsView',
  components: {
    SideBar, PageHeader, PageFooter, ProduceForm, CreateProductForm, SubmitForm
  },
  data () {
    return {
      sort: {
        field: null,
        order: 1
      },
      isSearchInputVisible: false,
      isDateSearchInputVisible: false,
      isSearchInputDisabled: true,
      isDateSearchInputDisabled: true,
      showDropDown: false,
      showDateDropDown: false,
      searchButtonText: 'Поиск',
      dateSearchButtonText: 'Дата',
      searchColumn: '',
      dateSearchColumn: '',
      searchText: '',
      searchDateStart: '',
      searchDateEnd: '',
      currentProduct: null,
      isProduceFormVisible: false,
      isCreateProductFormVisible: false,
      isSideBarVisible: false,
      isSubmitFormVisible: false,
      isSideBarAnimate: window.innerWidth < 1780,
      products: [],
      logs: [],
      filteredItems: []
    }
  },
  computed: {
    ...mapGetters(['getProducts', 'getShippings', 'getProductions']),
    sortedItems () {
      return this.filteredItems.slice().sort((a, b) => {
        const field = this.sort.field
        const orderFactor = this.sort.order

        if (field) {
          if (typeof a[field] === 'string') {
            // Use localeCompare for string comparison
            return orderFactor * a[field].localeCompare(b[field])
          } else {
            // Use numeric comparison for other types
            return orderFactor * (a[field] - b[field])
          }
        } else {
          return 0
        }
      })
    }
  },
  mounted () {
    this.handleWindowResizeForSidebar()
    window.addEventListener('resize', this.handleWindowResizeForSidebar)
    this.fetchProducts().then(() => {
      this.filteredItems = this.getProducts
    })
  },
  beforeUnmount () {
    window.removeEventListener('resize', this.handleWindowResizeForSidebar)
  },
  methods: {
    ...mapActions(['fetchProducts', 'fetchShippings', 'fetchProductions']),
    handleSearch () {
      const searchText = this.searchText.toLowerCase()
      if (searchText === '') {
        this.filteredItems = this.getProducts
        return
      }
      switch (this.searchColumn) {
        case 'Номер №':
          this.filteredItems = this.getProducts.filter(item => {
            return (
              item.id === parseFloat(searchText)
            )
          })
          break
        case 'Наименование':
          this.filteredItems = this.getProducts.filter(item => {
            return (
              item.name.toLowerCase().includes(searchText)
            )
          })
          break
      }
    },
    async handleDateSearch () {
      const searchDateStart = new Date(this.searchDateStart)
      const searchDateEnd = new Date(this.searchDateEnd)
      let dateItemsProductions = []
      let dateItemsShippings = []

      await this.fetchProductions().then(() => {
        dateItemsProductions = this.getProductions // detail_id, write_off_date, quantity
      })

      await this.fetchShippings().then(() => {
        dateItemsShippings = this.getShippings // detail_id, write_off_date, quantity
      })

      if (searchDateStart === '' || searchDateEnd === '') {
        this.filteredItems = this.getProducts
        return
      }
      let resultArray = []
      switch (this.dateSearchColumn) {
        case 'Дата производства':
          dateItemsProductions = this.getProductions.filter(item => new Date(item.production_date) >= searchDateStart && new Date(item.production_date) <= searchDateEnd)
          resultArray = Object.values(
            dateItemsProductions.reduce((acc, item) => {
              // eslint-disable-next-line
              const { product_id, quantity } = item
              acc[product_id] = acc[product_id] || { ...item, quantity: 0 }
              acc[product_id].quantity += quantity
              return acc
            }, {})
          )
          dateItemsProductions = resultArray
          this.filteredItems = this.getProducts.filter(item => dateItemsProductions.some(dateItem => dateItem.product_id === item.id))
          this.filteredItems.forEach(filteredItem => {
            const correspondingDateItem = dateItemsProductions.find(dateItem => dateItem.product_id === filteredItem.id)
            if (correspondingDateItem) {
              filteredItem.produced = correspondingDateItem.quantity
            }
          })
          break
        case 'Дата отгрузки':
          dateItemsShippings = this.getShippings.filter(item => new Date(item.shipping_date) >= searchDateStart && new Date(item.shipping_date) <= searchDateEnd)
          resultArray = Object.values(
            dateItemsShippings.reduce((acc, item) => {
              // eslint-disable-next-line
              const { product_id, quantity } = item
              acc[product_id] = acc[product_id] || { ...item, quantity: 0 }
              acc[product_id].quantity += quantity
              return acc
            }, {})
          )
          dateItemsShippings = resultArray
          this.filteredItems = this.getProducts.filter(item => dateItemsShippings.some(dateItem => dateItem.product_id === item.id))
          this.filteredItems.forEach(filteredItem => {
            const correspondingDateItem = dateItemsShippings.find(dateItem => dateItem.product_id === filteredItem.id)
            if (correspondingDateItem) {
              filteredItem.shipped = correspondingDateItem.quantity
            }
          })
          break
      }
    },
    async fetchProductsFromServer () {
      await this.fetchProducts().then(() => {
        this.filteredItems = this.getProducts
      })
    },
    handleClickOutside () {
      if (window.innerWidth < 1780) {
        this.closeSideBar()
      }
    },
    handleWindowResizeForSidebar: function () { this.isSideBarVisible = window.innerWidth > 1780 },
    openSideBar: function () { this.isSideBarVisible = true },
    closeSideBar: function () { this.isSideBarVisible = false },
    toggleSearch () { // переделать пересмотреть
      this.showDropDown = !this.showDropDown
      if (this.isSearchInputVisible) {
        this.isSearchInputDisabled = false
      } else {
        this.isSearchInputVisible = true
      }
    },
    toggleDateSearch () { // переделать пересмотреть
      this.showDateDropDown = !this.showDateDropDown
      if (this.isSearchInputVisible) {
        this.isDateSearchInputDisabled = false
      } else {
        this.isDateSearchInputVisible = true
      }
    },
    closeSearch () {
      this.isSearchInputVisible = false
      this.showDropDown = !this.showDropDown
      this.searchColumn = 'Поиск'
      this.isSearchInputDisabled = true
      this.filteredItems = this.getProducts
    },
    closeDateSearch () {
      this.isDateSearchInputVisible = false
      this.showDateDropDown = !this.showDateDropDown
      this.dateSearchButtonText = 'Дата'
      this.isDateSearchInputDisabled = true
      this.filteredItems = this.getProducts
    },
    handleItemClick (content) {
      this.searchButtonText = content
      this.isSearchInputVisible = true
      this.searchColumn = content
      this.showDropDown = false
      this.isSearchInputDisabled = false
    },
    handleDateSearchItemClick (content) {
      this.dateSearchButtonText = content
      this.isDateSearchInputVisible = true
      this.dateSearchColumn = content
      this.showDateDropDown = false
      this.isSearchInputDisabled = false
    },
    openProduceForm (item) {
      this.isProduceFormVisible = true
      this.currentProduct = item
    },
    closeProduceForm: function () { this.isProduceFormVisible = false },
    openCreateProductForm: function () { this.isCreateProductFormVisible = true },
    closeCreateProductForm: function () { this.isCreateProductFormVisible = false },
    openSubmitForm: function () { this.isSubmitFormVisible = true },
    closeSubmitForm: function () { this.isSubmitFormVisible = false },
    clearInput (item) {
      item.ready_to_ship = item.produced - item.shipped
    },
    async confirmActions () {
      const updatedProducts = [...this.getProducts]
      try {
        await this.$store.dispatch('updateProducts', updatedProducts)
      } catch (error) {
        console.error('Ошибка при обновлении продуктов:', error)
      }

      this.isSubmitFormVisible = false
    },
    addLogToLogsArray (item) {
      const log = {
        user_id: 2,
        date: this.getCurrentDate(),
        operation: 'Подтверждена готовность к отгрузке продукта ' + item.name + ' в количестве ' + item.ready_to_ship,
        is_read: false
      }
      this.logs.push(log)
    },
    denyActions () {
      console.log('Не подтверждено готовность')
      this.isSubmitFormVisible = false
    },
    toggleSort (field) {
      if (this.sort.field === field) {
        this.sort.order = -this.sort.order
      } else {
        this.sort.field = field
        this.sort.order = 1
      }
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
  height: 75%
.table-section__header
  display: flex
  flex-direction: row
  justify-content: space-between
  align-items: center
  width: 99%
  height: 50px
  margin: 10px 0px 10px 0px
.text-search
  display: flex
  gap: 5px
  flex-direction: row
.text-search-button-wrapper
  display: flex
  flex-direction: column
.text-search-button
  cursor: pointer
  border-radius: 12px
  width: 110px
  padding: 5px
.dropdown-list
  display: flex
  gap: 8px
  flex-direction: column
  width: 110px
  height: fit-content
  background: white
  border: 1px solid #ccc
  position: absolute
  margin-top: 32px
  z-index: 3
.search-item-button
  height: 30px
  cursor: pointer
  border: none
  background: none
  &:hover
    background: #ccc
    font-weight: 700
.search-item-button-exit
  margin-top: auto
  background: red
  cursor: pointer
  border: none
  &:hover
    background: red
.text-search-input
  display: flex
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
  height: 26px
  display: flex
  flex-direction: row
  align-items: center
  justify-content: flex-end
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
  display: contents
  font-size: 12px
  text-align: center
.table-header .table-cell
  background-color: #f2f2f2
.table__row
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
  padding: 2px
  font-size: 12px
  overflow: hidden
  white-space: nowrap
  text-overflow: ellipsis
.table-cell--input
  flex-direction: row
.table-cell-input
  width: 100%
  cursor: text
.table-cell-header
  display: flex
  flex-direction: raw
  position: relative
  justify-content: center
  align-items: center
  text-align: center
  border: 1px solid #ddd
  padding: 1px
  font-size: 12px
  height: 27px
  overflow: hidden
  white-space: nowrap
  text-overflow: ellipsis
  z-index: 0
.table__header .table-cell-header
    background-color: #f2f2f2
    border: 1px solid black
</style>
