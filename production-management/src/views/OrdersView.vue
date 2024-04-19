<template>
    <div class="page">
        <SubmitForm v-if="isSubmitFormVisible" @confirm="confirmActions" @deny="denyActions"/>
        <ShippingForm :currentOrder="this.currentOrder" v-if="isShippingFormVisible" @close-popup="closeShippingForm" @order-shipped="fetchOrdersFromServer"/>
        <UpdateOrderForm :currentOrder="this.currentOrder" v-if="isUpdateOrderFormVisible" @close-popup="closeUpdateOrderForm" @order-shipped="fetchOrdersFromServer"/>
        <CreateOrderForm v-if="isCreateOrderFormVisible" @close-popup="closeCreateOrderForm" @order-creation="fetchOrdersFromServer"/>
        <RequirementsForm :currentOrder="this.currentOrder" v-if="isRequirementFormVisible" @close-popup="closeRequirementForm" @requirements-creation="fetchOrdersFromServer"/>
        <Transition :name="isSideBarAnimate ? 'v' : null">
            <SideBar v-if="isSideBarVisible" @close-sidebar="closeSideBar" msg="Welcome to Your Vue.js App"/>
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
                          <button class="search-item-button" @click="handleItemClick('Клиент')">Клиент</button>
                          <button class="search-item-button" @click="handleItemClick('Дата заказа')">Дата заказа</button>
                          <button class="search-item-button" @click="handleItemClick('Исполнить до даты')">Исполнить<br>до даты</button>
                          <button class="search-item-button" @click="handleItemClick('№ договора')">№ договора</button>
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
                          <button class="search-item-button" @click="handleDateSearchItemClick('Дата заказа')">Дата заказа</button>
                          <button class="search-item-button" @click="handleDateSearchItemClick('Исполнить до')">Исполнить до</button>
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
                    <button class="buttons__btn" @click="toggleShippedVisibility">{{ this.notShippedVisible ? 'Скрыть отгруженные' : 'Показать отгруженные' }}</button>
                    <button class="buttons__btn" @click="openCreateOrderForm">Разместить заказ</button>
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
                      <!-- сделать невидимым клиента для производства -->
                      <div class="table-cell-header">Клиент
                        <button class="sort-btn" @click="toggleSort('client_name')">
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="gray" class="bi bi-heart" viewBox="0 0 16 16">
                            <path d="M8 0l8 8-8 8-8-8z"/>
                          </svg>
                        </button>
                      </div>
                      <div class="table-cell-header">Дата заказа
                        <button class="sort-btn" @click="toggleSort('creation_date')">
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="gray" class="bi bi-heart" viewBox="0 0 16 16">
                            <path d="M8 0l8 8-8 8-8-8z"/>
                          </svg>
                        </button>
                      </div>
                      <div class="table-cell-header">Исполнить<br>до даты
                        <button class="sort-btn" @click="toggleSort('deadline')">
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="gray" class="bi bi-heart" viewBox="0 0 16 16">
                            <path d="M8 0l8 8-8 8-8-8z"/>
                          </svg>
                        </button>
                      </div>
                      <div class="table-cell-header">№ договора<br>о поставке
                        <button class="sort-btn" @click="toggleSort('doc_number')">
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="gray" class="bi bi-heart" viewBox="0 0 16 16">
                            <path d="M8 0l8 8-8 8-8-8z"/>
                          </svg>
                        </button>
                      </div>
                      <div class="table-cell-header">Позиции заказа</div>
                      <div class="table-cell-header">Кол-во</div>
                      <div class="table-cell-header">Готово</div>
                      <div class="table-cell-header">Отгружено
                        <button class="sort-btn" @click="toggleSort('shipping_status')">
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="gray" class="bi bi-heart" viewBox="0 0 16 16">
                            <path d="M8 0l8 8-8 8-8-8z"/>
                          </svg>
                        </button>
                      </div>
                      <div class="table-cell-header">Потребности<br>производства</div>
                      <div class="table-cell-header">Правка</div>
                    </div>
                    <div class="table__row" v-for="(item, index) in sortedItems" :key="index">
                      <div class="table-cell">{{ item.id }}</div>
                      <div class="table-cell">
                        {{ (item.is_commercial_secret && userRole === 2) ? 'Скрыт из-за коммерческой тайны' : item.client_name }}
                      </div>
                      <div class="table-cell">{{ this.formatDateTime(item.creation_date) }}</div>
                      <div class="table-cell">{{ this.formatDateTime(item.deadline) }}</div>
                      <div class="table-cell">{{ item.doc_number }}</div>
                      <div class="table-cell table-cell--position">
                        <div class="ready" v-for="(position, index) in item.positions" :key="index">
                            {{ position.product_name }}
                        </div>
                      </div>
                      <div class="table-cell table-cell--position">
                        <div class="ready" v-for="(position, index) in item.positions" :key="index">
                            {{ position.quantity }}
                        </div>
                      </div>
                      <div class="table-cell table-cell--position">
                        <div class="ready" v-for="(position, index) in item.positions" :key="index">
                            <input type="checkbox" v-model="position.is_ready_to_ship">
                        </div>
                      </div>
                      <div class="table-cell">
                        <button v-if="!item.shipping_status" class="table-button" @click="openShippingForm(item)">Отгрузить</button>
                        <p v-if="item.shipping_status">Отгружен</p>
                      </div>
                      <div class="table-cell">
                        <button class="table-button" @click="openRequirementForm(item)">
                          {{ (item.requirements === null || item.requirements === '')  ? 'Добавить' : 'Посмотреть' }}
                        </button>
                      </div>
                      <div class="table-cell">
                        <button class="table-button table-button--edit" @click="openUpdateOrderForm(item)">
                          <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="50px" height="50px"><path d="M 43.125 2 C 41.878906 2 40.636719 2.488281 39.6875 3.4375 L 38.875 4.25 L 45.75 11.125 C 45.746094 11.128906 46.5625 10.3125 46.5625 10.3125 C 48.464844 8.410156 48.460938 5.335938 46.5625 3.4375 C 45.609375 2.488281 44.371094 2 43.125 2 Z M 37.34375 6.03125 C 37.117188 6.0625 36.90625 6.175781 36.75 6.34375 L 4.3125 38.8125 C 4.183594 38.929688 4.085938 39.082031 4.03125 39.25 L 2.03125 46.75 C 1.941406 47.09375 2.042969 47.457031 2.292969 47.707031 C 2.542969 47.957031 2.90625 48.058594 3.25 47.96875 L 10.75 45.96875 C 10.917969 45.914063 11.070313 45.816406 11.1875 45.6875 L 43.65625 13.25 C 44.054688 12.863281 44.058594 12.226563 43.671875 11.828125 C 43.285156 11.429688 42.648438 11.425781 42.25 11.8125 L 9.96875 44.09375 L 5.90625 40.03125 L 38.1875 7.75 C 38.488281 7.460938 38.578125 7.011719 38.410156 6.628906 C 38.242188 6.246094 37.855469 6.007813 37.4375 6.03125 C 37.40625 6.03125 37.375 6.03125 37.34375 6.03125 Z"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
            </section>
            <PageFooter @click="handleClickOutside"/>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters, mapActions } from 'vuex'
import SideBar from '@/components/SideBar.vue'
import PageHeader from '@/components/PageHeader.vue'
import PageFooter from '@/components/PageFooter.vue'
import ShippingForm from '@/components/ShippingForm.vue'
import CreateOrderForm from '@/components/CreateOrderForm.vue'
import RequirementsForm from '@/components/RequirementsForm.vue'
import SubmitForm from '@/components/SubmitForm.vue'
import UpdateOrderForm from '@/components/UpdateOrderForm.vue'
import '@/styles/buttonsStyles.sass'

export default {
  name: 'ordersView',
  components: {
    SideBar, PageHeader, PageFooter, ShippingForm, CreateOrderForm, RequirementsForm, SubmitForm, UpdateOrderForm
  },
  data () {
    return {
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
      currentOrder: null,
      isSubmitFormVisible: false,
      isShippingFormVisible: false,
      isCreateOrderFormVisible: false,
      isSideBarVisible: false,
      isRequirementFormVisible: false,
      isUpdateOrderFormVisible: false,
      isSideBarAnimate: window.innerWidth < 1780,
      userRole: 0,
      notShippedVisible: true,
      orders: [],
      logs: [],
      sort: {
        field: null,
        order: 1
      },
      filteredItems: []
    }
  },
  computed: {
    ...mapGetters(['getOrders']),
    sortedItems () {
      return this.filteredItems.slice().sort((a, b) => {
        const field = this.sort.field
        const orderFactor = this.sort.order

        if (field) {
          if (field === 'creation_date' || field === 'deadline') {
            const dateA = new Date(a[field])
            const dateB = new Date(b[field])

            return orderFactor * (dateA - dateB)
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
    this.userRole = Number(sessionStorage.getItem('role'))
    this.fetchOrders().then(() => {
      this.filteredItems = this.getOrders
    })
    window.addEventListener('resize', this.handleWindowResizeForSidebar)
  },
  beforeUnmount () {
    window.removeEventListener('resize', this.handleWindowResizeForSidebar)
  },
  methods: {
    ...mapActions(['fetchOrders']),
    toggleShippedVisibility () {
      if (this.notShippedVisible) {
        this.notShippedVisible = false
        this.filteredItems = this.getOrders.filter(item => item.shipping_status === false)
      } else {
        this.notShippedVisible = true
        this.filteredItems = this.getOrders
      }
    },
    handleSearch () {
      const searchText = this.searchText.toLowerCase()
      if (searchText === '') {
        this.filteredItems = this.getOrders
        return
      }
      switch (this.searchColumn) {
        case 'Номер №':
          this.filteredItems = this.getOrders.filter(item => {
            return (
              item.id === parseFloat(searchText)
            )
          })
          break
        case 'Клиент':
          this.filteredItems = this.getOrders.filter(item => {
            return (
              item.client_name.toLowerCase().includes(searchText)
            )
          })
          break
        case 'Дата заказа':
          this.filteredItems = this.getOrders.filter(item => {
            const itemDate = formatDate(this.formatDateTime(item.creation_date))
            return itemDate.toLowerCase().includes(searchText)
          })
          break
        case 'Исполнить до даты':
          this.filteredItems = this.getOrders.filter(item => {
            const itemDate = formatDate(this.formatDateTime(item.deadline))
            return itemDate.toLowerCase().includes(searchText)
          })
          break
        case '№ договора':
          this.filteredItems = this.getOrders.filter(item => {
            return (
              String(item.doc_number).toLowerCase().includes(searchText)
            )
          })
          break
      }
      function formatDate (dateString) {
        const [day, month, year] = dateString.split('.')
        return `${day}.${month}.${year}`
      }
    },
    handleDateSearch () {
      const searchDateStart = new Date(this.searchDateStart)
      const searchDateEnd = new Date(this.searchDateEnd)
      if (searchDateStart === '' || searchDateEnd === '') {
        this.filteredItems = this.getOrders
        return
      }
      switch (this.dateSearchColumn) {
        case 'Дата заказа':
          this.filteredItems = this.getOrders.filter(item => new Date(item.creation_date) >= searchDateStart && new Date(item.creation_date) <= searchDateEnd)
          break
        case 'Исполнить до':
          this.filteredItems = this.getOrders.filter(item => new Date(item.deadline) >= searchDateStart && new Date(item.deadline) <= searchDateEnd)
          break
        case 'Дата отгрузки': // TODO
          this.filteredItems = this.getOrders.filter(item => new Date(item.deadline) >= searchDateStart && new Date(item.deadline) <= searchDateEnd)
          break
      }
    },
    toggleSort (field) {
      if (this.sort.field === field) {
        this.sort.order = -this.sort.order
      } else {
        this.sort.field = field
        this.sort.order = 1
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
    async fetchOrdersFromServer () {
      await this.fetchOrders().then(() => {
        this.filteredItems = this.getOrders
      })
    },
    async confirmActions () {
      const updatedOrders = [...this.filteredItems]
      try {
        await this.$store.dispatch('updateOrders', updatedOrders)
      } catch (error) {
        console.error('Ошибка при отправке данных на сервер:', error)
      }
      this.isSubmitFormVisible = false
    },
    denyActions () {
      console.log('Не подтверждено готовность')
      this.isSubmitFormVisible = false
    },
    handleClickOutside () {
      if (window.innerWidth < 1780) {
        this.closeSideBar()
      }
    },
    handleWindowResizeForSidebar: function () { this.isSideBarVisible = window.innerWidth > 1780 },
    openSideBar: function () { this.isSideBarVisible = true },
    closeSideBar: function () { this.isSideBarVisible = false },
    toggleSearch () {
      this.showDropDown = !this.showDropDown
      if (this.isSearchInputVisible) {
        this.isSearchInputDisabled = false
      } else {
        this.isSearchInputVisible = true
      }
    },
    toggleDateSearch () {
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
      this.filteredItems = this.getOrders
    },
    closeDateSearch () {
      this.isDateSearchInputVisible = false
      this.showDateDropDown = !this.showDateDropDown
      this.dateSearchButtonText = 'Дата'
      this.isDateSearchInputDisabled = true
      this.filteredItems = this.getOrders
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
    openShippingForm (item) {
      this.isShippingFormVisible = true
      this.currentOrder = item
    },
    closeShippingForm: function () { this.isShippingFormVisible = false },
    openUpdateOrderForm (item) {
      this.isUpdateOrderFormVisible = true
      this.currentOrder = item
    },
    closeUpdateOrderForm: function () { this.isUpdateOrderFormVisible = false },
    openSubmitForm: function () { this.isSubmitFormVisible = true },
    closeSubmitForm: function () { this.isSubmitFormVisible = false },
    openCreateOrderForm: function () { this.isCreateOrderFormVisible = true },
    closeCreateOrderForm: function () { this.isCreateOrderFormVisible = false },
    openRequirementForm (item) {
      this.isRequirementFormVisible = true
      this.currentOrder = item
    },
    closeRequirementForm: function () { this.isRequirementFormVisible = false }
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
  overflow-x: hidden
.table
  display: grid
  width: 100%
  justify-content: center
  grid-template-columns: 5% 18% 9% 9% 9% 15% 5% 5% 10% 10% 5%
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
  border: 1px solid black
.table-cell
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  text-align: center
  padding: 10px
  font-size: 14px
  overflow: hidden
  white-space: nowrap
  text-overflow: ellipsis
  margin-bottom: 10px
  border-bottom: 1px solid #ddd
  border-top: 1px solid #ddd
.table-cell-input
  width: 90%
  cursor: text
.ready
  display: flex
.table-cell--position
  display: flex
  flex-direction: column
  justify-content: space-evenly
  gap: 7px
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
