<template>
  <div class="page">
    <WriteOffForm v-if="isWriteOffFormVisible" @close-popup="closeWriteOffForm" @written-off="fetchDetailsFromServer"/>
    <RequestForm v-if="isRequestFormVisible" @close-popup="closeRequestForm"/>
    <EnterSupplyForm v-if="isEnterSupplyFormVisible" @close-popup="closeEnterSupplyForm"/>
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
                  <button class="search-item-button" @click="handleItemClick('Дата поставки')">Дата поставки</button>
                  <button class="search-item-button" @click="handleItemClick('Остаток')">Остаток</button>
                  <button class="search-item-button" @click="handleItemClick('Поставщик')">Поставщик</button>
                  <button class="search-item-button" @click="handleItemClick('УПД/С-Ф')">УПД/С-Ф</button>
                  <button class="search-item-button" @click="handleItemClick('Цена за ед.')">Цена за ед.</button>
                  <button class="search-item-button-exit" @click="closeSearch">Закрыть поиск</button>
                </div>
              </Transition>
            </div>
            <div v-if="isSearchInputVisible" class="text-search-input">
              <input v-model="searchText" @input="handleSearch" type="text" :placeholder="isSearchInputDisabled ? 'Выберите колонку' : 'Поиск'" class="text-search__text" :disabled="isSearchInputDisabled">
            </div>
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
              <button class="buttons__btn" @click="openRequestForm">Запрос на поставку</button>
              <button class="buttons__btn" @click="openEnterSupplyForm">Внести поставку</button>
              <button class="buttons__btn" @click="openWriteOffForm">Списать на производство</button>
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
              <div class="table-cell-header">Ед.<br>измер.
                <button class="sort-btn" @click="toggleSort('unit')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="gray" class="bi bi-heart" viewBox="0 0 16 16">
                    <path d="M8 0l8 8-8 8-8-8z"/>
                  </svg>
                </button>
              </div>
              <div class="table-cell-header">Дата<br>поставки
                <button class="sort-btn" @click="toggleSort('supply_date')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="gray" class="bi bi-heart" viewBox="0 0 16 16">
                    <path d="M8 0l8 8-8 8-8-8z"/>
                  </svg>
                </button>
              </div>
              <div class="table-cell-header">Поставлено
                <button class="sort-btn" @click="toggleSort('supplied')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="gray" class="bi bi-heart" viewBox="0 0 16 16">
                    <path d="M8 0l8 8-8 8-8-8z"/>
                  </svg>
                </button>
              </div>
              <div class="table-cell-header">Списано
                <button class="sort-btn" @click="toggleSort('written_off')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="gray" class="bi bi-heart" viewBox="0 0 16 16">
                    <path d="M8 0l8 8-8 8-8-8z"/>
                  </svg>
                </button>
              </div>
              <div class="table-cell-header">Остаток
                <button class="sort-btn" @click="toggleSort('balance')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="gray" class="bi bi-heart" viewBox="0 0 16 16">
                    <path d="M8 0l8 8-8 8-8-8z"/>
                  </svg>
                </button>
              </div>
              <div class="table-cell-header">Наименование<br>поставщика
                <button class="sort-btn" @click="toggleSort('supplier_name')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="gray" class="bi bi-heart" viewBox="0 0 16 16">
                    <path d="M8 0l8 8-8 8-8-8z"/>
                  </svg>
                </button>
              </div>
              <div class="table-cell-header">Номер<br>УПД/С-Ф
                <button class="sort-btn" @click="toggleSort('upd_sf_number')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="gray" class="bi bi-heart" viewBox="0 0 16 16">
                    <path d="M8 0l8 8-8 8-8-8z"/>
                  </svg>
                </button>
              </div>
              <div class="table-cell-header">Цена<br>за ед.
                <button class="sort-btn" @click="toggleSort('price')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="gray" class="bi bi-heart" viewBox="0 0 16 16">
                    <path d="M8 0l8 8-8 8-8-8z"/>
                  </svg>
                </button>
              </div>
              <div class="table-cell-header">Остаток<br>на сумму
                <button class="sort-btn" @click="toggleSort('sum')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="gray" class="bi bi-heart" viewBox="0 0 16 16">
                    <path d="M8 0l8 8-8 8-8-8z"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="table__row" v-for="(item, index) in sortedItems" :key="index">
              <div class="table-cell">{{ item.id }}</div>
              <div class="table-cell">{{ item.name }}</div>
              <div class="table-cell">{{ item.unit }}</div>
              <div class="table-cell">{{ this.formatDateTime(item.supply_date) }}</div>
              <div class="table-cell">{{ item.supplied }}</div>
              <div class="table-cell">{{ item.written_off }}</div>
              <div class="table-cell">{{ item.supplied - item.written_off }}</div>
              <div class="table-cell">{{ item.supplier_name }}</div>
              <div class="table-cell">№ {{ item.upd_sf_number }}</div>
              <div class="table-cell">{{ item.price }} руб.</div>
              <div class="table-cell">{{ ((item.supplied - item.written_off) * item.price).toFixed(2) }} руб.</div>
            </div>
          </div>
        </div>
      </section>
      <PageFooter @click="handleClickOutside"/>
    </div>
  </div>
</template>

<script>
import SideBar from '@/components/SideBar.vue'
import PageHeader from '@/components/PageHeader.vue'
import WriteOffForm from '@/components/WriteOffForm.vue'
import RequestForm from '@/components/RequestForm.vue'
import EnterSupplyForm from '@/components/EnterSupplyForm.vue'
import PageFooter from '@/components/PageFooter.vue'
import { mapGetters, mapActions } from 'vuex'
import '@/styles/buttonsStyles.sass'

export default {
  emits: ['open-sidebar'],
  name: 'DetailsView',
  components: {
    SideBar, PageHeader, PageFooter, WriteOffForm, RequestForm, EnterSupplyForm
  },
  data () {
    return {
      sort: {
        field: null,
        order: 1
      },
      isSearchInputVisible: false,
      isSearchInputDisabled: true,
      showDropDown: false,
      searchButtonText: 'Поиск',
      searchColumn: '',
      searchText: '',
      isWriteOffFormVisible: false,
      isRequestFormVisible: false,
      isEnterSupplyFormVisible: false,
      isSideBarVisible: false,
      isSideBarAnimate: window.innerWidth < 1780,
      details: [],
      filteredItems: []
    }
  },
  computed: {
    ...mapGetters(['getDetails']),
    sortedItems () {
      return this.filteredItems.slice().sort((a, b) => {
        const field = this.sort.field
        const orderFactor = this.sort.order

        if (field) {
          if (field === 'supply_date') {
            const dateA = new Date(a[field])
            const dateB = new Date(b[field])

            return orderFactor * (dateA - dateB)
          } else if (field === 'balance') {
            const balanceA = 'balance' in a ? a.balance : a.supplied - a.written_off
            const balanceB = 'balance' in b ? b.balance : b.supplied - b.written_off

            return orderFactor * (balanceA - balanceB)
          } else if (field === 'sum') {
            const sumA = 'sum' in a ? a.sum : (a.supplied - a.written_off) * a.price
            const sumB = 'sum' in b ? b.sum : (b.supplied - b.written_off) * b.price

            return orderFactor * (sumA - sumB)
          } else if (field === 'price') {
            return orderFactor * (a[field] - (b[field]))
          } else if (typeof a[field] === 'string') {
            return orderFactor * a[field].localeCompare(b[field])
          } else {
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
    this.fetchDetails().then(() => {
      this.filteredItems = this.getDetails
    })
    window.addEventListener('resize', this.handleWindowResizeForSidebar)
  },
  beforeUnmount () {
    window.removeEventListener('resize', this.handleWindowResizeForSidebar)
  },
  methods: {
    ...mapActions(['fetchDetails']),
    async fetchDetailsFromServer () {
      await this.fetchDetails().then(() => {
        this.filteredItems = this.getDetails
      })
    },
    handleSearch () {
      const searchText = this.searchText.toLowerCase()
      if (searchText === '') {
        this.filteredItems = this.getDetails
        return
      }
      switch (this.searchColumn) {
        case 'Номер №':
          this.filteredItems = this.getDetails.filter(item => {
            return (
              item.id === parseFloat(searchText)
            )
          })
          break
        case 'Наименование':
          this.filteredItems = this.getDetails.filter(item => {
            return (
              item.name.toLowerCase().includes(searchText)
            )
          })
          break
        case 'Дата поставки':
          this.filteredItems = this.getDetails.filter(item => {
            const itemDate = formatDate(this.formatDateTime(item.supply_date))
            return itemDate.toLowerCase().includes(searchText)
          })
          break
        case 'Остаток':
          this.filteredItems = this.getDetails.filter(item => {
            return (
              item.supplied - item.written_off === parseFloat(searchText)
            )
          })
          break
        case 'Поставщик':
          this.filteredItems = this.getDetails.filter(item => {
            return (
              item.supplier_name.toLowerCase().includes(searchText)
            )
          })
          break
        case 'УПД/С-Ф':
          this.filteredItems = this.getDetails.filter(item => {
            return (
              item.upd_sf_number.toLowerCase().includes(searchText)
            )
          })
          break
        case 'Цена за ед.':
          this.filteredItems = this.getDetails.filter(item => {
            return (
              item.price.toLowerCase().includes(searchText)
            )
          })
          break
      }
      function formatDate (dateString) {
        const [day, month, year] = dateString.split('.')
        return `${day}.${month}.${year}`
      }
    },
    handleClickOutside () {
      if (window.innerWidth < 1780) {
        this.closeSideBar()
      }
    },
    formatDateTime (dateTimeString) {
      const originalDate = new Date(dateTimeString)
      const day = originalDate.getDate().toString().padStart(2, '0')
      const month = (originalDate.getMonth() + 1).toString().padStart(2, '0')
      const year = originalDate.getFullYear().toString().padStart(2, '0')

      const formattedDate = `${day}.${month}.${year}`
      return formattedDate
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
    closeSearch () {
      this.isSearchInputVisible = false
      this.showDropDown = !this.showDropDown
      this.searchColumn = 'Поиск'
      this.isSearchInputDisabled = true
    },
    handleItemClick (content) {
      this.searchButtonText = content
      this.isSearchInputVisible = true
      this.searchColumn = content
      this.showDropDown = false
      this.isSearchInputDisabled = false
    },
    openWriteOffForm: function () { this.isWriteOffFormVisible = true },
    closeWriteOffForm: function () { this.isWriteOffFormVisible = false },
    openRequestForm: function () { this.isRequestFormVisible = true },
    closeRequestForm: function () { this.isRequestFormVisible = false },
    openEnterSupplyForm: function () { this.isEnterSupplyFormVisible = true },
    closeEnterSupplyForm: function () { this.isEnterSupplyFormVisible = false },
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
.dl-enter-active, .dl-leave-active
  transition: transform 0.3s ease-out
.dl-enter-from, .dl-leave-to
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
  grid-template-columns: 5% 20% 5% 7% 8% 8% 8% 15% 10% 7% 7%
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
  height: 20px
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
  z-index: -1
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
.table__header .table-cell-header
  background-color: #f2f2f2
  border: 1px solid black
</style>
