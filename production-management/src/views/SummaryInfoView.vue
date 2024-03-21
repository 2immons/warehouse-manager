<template>
  <div class="page">
    <SubmitForm v-if="isSubmitFormVisible" @confirm="confirmActions" @deny="denyActions"/>
    <ProduceForm v-if="isProduceFormVisible" :currentProduct="this.currentProduct" @close-popup="closeProduceForm" @product-creation="fetchCounterpartiesFromServer"/>
    <CreateCounterpartyForm v-if="isCreateCounterpartyFormVisible" @add-counterparty="fetchCounterpartiesFromServer" @close-popup="closeCreateCounterpartyForm"/>
    <UpdateCounterpartyForm :currentCounterparty="this.currentCounterparty" v-if="isUpdateCounterpartyFormVisible" @add-counterparty="fetchCounterpartiesFromServer" @close-popup="closeUpdateCounterpartyForm"/>
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
                  <button class="search-item-button" @click="handleItemClick('Адрес')">Адрес</button>
                  <button class="search-item-button" @click="handleItemClick('ИНН')">ИНН</button>
                  <button class="search-item-button" @click="handleItemClick('КПП')">КПП</button>
                  <button class="search-item-button-exit" @click="closeSearch">Закрыть поиск</button>
                </div>
              </Transition>
            </div>
            <div v-if="isSearchInputVisible" class="text-search-input">
              <input v-model="searchText" @input="handleSearch" type="text" :placeholder="isSearchInputDisabled ? 'Выберите колонку' : 'Поиск'" class="text-search__text" :disabled="isSearchInputDisabled">
            </div>
          </div>
          <div class="buttons">
              <button class="buttons__btn" @click="openCreateCounterpartyForm">Создать контрагента</button>
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
                  <div class="table-cell-header">Адрес
                    <button class="sort-btn" @click="toggleSort('adress')">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="gray" class="bi bi-heart" viewBox="0 0 16 16">
                        <path d="M8 0l8 8-8 8-8-8z"/>
                      </svg>
                    </button>
                  </div>
                  <div class="table-cell-header">ИНН
                    <button class="sort-btn" @click="toggleSort('inn')">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="gray" class="bi bi-heart" viewBox="0 0 16 16">
                        <path d="M8 0l8 8-8 8-8-8z"/>
                      </svg>
                    </button>
                  </div>
                  <div class="table-cell-header">КПП
                    <button class="sort-btn" @click="toggleSort('kpp')">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="gray" class="bi bi-heart" viewBox="0 0 16 16">
                        <path d="M8 0l8 8-8 8-8-8z"/>
                      </svg>
                    </button>
                  </div>
                  <div class="table-cell-header">Правка</div>
                  <div class="table-cell-header">Удалить</div>
              </div>
              <div class="table__row" v-for="(item, index) in sortedItems" :key="index">
                <div class="table-cell">{{ item.id }}</div>
                <div class="table-cell">{{ item.name }}</div>
                <div class="table-cell">{{ item.adress }}</div>
                <div class="table-cell">{{ item.inn }}</div>
                <div class="table-cell">{{ item.kpp }}</div>
                <div class="table-cell">
                  <button class="table-button table-button--edit" @click="openUpdateCounterpartyForm(item)">
                    <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="50px" height="50px"><path d="M 43.125 2 C 41.878906 2 40.636719 2.488281 39.6875 3.4375 L 38.875 4.25 L 45.75 11.125 C 45.746094 11.128906 46.5625 10.3125 46.5625 10.3125 C 48.464844 8.410156 48.460938 5.335938 46.5625 3.4375 C 45.609375 2.488281 44.371094 2 43.125 2 Z M 37.34375 6.03125 C 37.117188 6.0625 36.90625 6.175781 36.75 6.34375 L 4.3125 38.8125 C 4.183594 38.929688 4.085938 39.082031 4.03125 39.25 L 2.03125 46.75 C 1.941406 47.09375 2.042969 47.457031 2.292969 47.707031 C 2.542969 47.957031 2.90625 48.058594 3.25 47.96875 L 10.75 45.96875 C 10.917969 45.914063 11.070313 45.816406 11.1875 45.6875 L 43.65625 13.25 C 44.054688 12.863281 44.058594 12.226563 43.671875 11.828125 C 43.285156 11.429688 42.648438 11.425781 42.25 11.8125 L 9.96875 44.09375 L 5.90625 40.03125 L 38.1875 7.75 C 38.488281 7.460938 38.578125 7.011719 38.410156 6.628906 C 38.242188 6.246094 37.855469 6.007813 37.4375 6.03125 C 37.40625 6.03125 37.375 6.03125 37.34375 6.03125 Z"/></svg>
                  </button>
                </div>
                <div class="table-cell">
                  <button class="table-button table-button--remove" @click="openSubmitForm(item)">
                    <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="50px" height="50px"><path d="M 21 0 C 19.355469 0 18 1.355469 18 3 L 18 5 L 10.1875 5 C 10.0625 4.976563 9.9375 4.976563 9.8125 5 L 8 5 C 7.96875 5 7.9375 5 7.90625 5 C 7.355469 5.027344 6.925781 5.496094 6.953125 6.046875 C 6.980469 6.597656 7.449219 7.027344 8 7 L 9.09375 7 L 12.6875 47.5 C 12.8125 48.898438 14.003906 50 15.40625 50 L 34.59375 50 C 35.996094 50 37.1875 48.898438 37.3125 47.5 L 40.90625 7 L 42 7 C 42.359375 7.003906 42.695313 6.816406 42.878906 6.503906 C 43.058594 6.191406 43.058594 5.808594 42.878906 5.496094 C 42.695313 5.183594 42.359375 4.996094 42 5 L 32 5 L 32 3 C 32 1.355469 30.644531 0 29 0 Z M 21 2 L 29 2 C 29.5625 2 30 2.4375 30 3 L 30 5 L 20 5 L 20 3 C 20 2.4375 20.4375 2 21 2 Z M 11.09375 7 L 38.90625 7 L 35.3125 47.34375 C 35.28125 47.691406 34.910156 48 34.59375 48 L 15.40625 48 C 15.089844 48 14.71875 47.691406 14.6875 47.34375 Z M 18.90625 9.96875 C 18.863281 9.976563 18.820313 9.988281 18.78125 10 C 18.316406 10.105469 17.988281 10.523438 18 11 L 18 44 C 17.996094 44.359375 18.183594 44.695313 18.496094 44.878906 C 18.808594 45.058594 19.191406 45.058594 19.503906 44.878906 C 19.816406 44.695313 20.003906 44.359375 20 44 L 20 11 C 20.011719 10.710938 19.894531 10.433594 19.6875 10.238281 C 19.476563 10.039063 19.191406 9.941406 18.90625 9.96875 Z M 24.90625 9.96875 C 24.863281 9.976563 24.820313 9.988281 24.78125 10 C 24.316406 10.105469 23.988281 10.523438 24 11 L 24 44 C 23.996094 44.359375 24.183594 44.695313 24.496094 44.878906 C 24.808594 45.058594 25.191406 45.058594 25.503906 44.878906 C 25.816406 44.695313 26.003906 44.359375 26 44 L 26 11 C 26.011719 10.710938 25.894531 10.433594 25.6875 10.238281 C 25.476563 10.039063 25.191406 9.941406 24.90625 9.96875 Z M 30.90625 9.96875 C 30.863281 9.976563 30.820313 9.988281 30.78125 10 C 30.316406 10.105469 29.988281 10.523438 30 11 L 30 44 C 29.996094 44.359375 30.183594 44.695313 30.496094 44.878906 C 30.808594 45.058594 31.191406 45.058594 31.503906 44.878906 C 31.816406 44.695313 32.003906 44.359375 32 44 L 32 11 C 32.011719 10.710938 31.894531 10.433594 31.6875 10.238281 C 31.476563 10.039063 31.191406 9.941406 30.90625 9.96875 Z"/></svg>
                  </button>
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
import CreateCounterpartyForm from '@/components/CreateCounterpartyForm.vue'
import PageFooter from '@/components/PageFooter.vue'
import SubmitForm from '@/components/SubmitForm.vue'
import UpdateCounterpartyForm from '@/components/UpdateCounterpartyForm.vue'
import { mapGetters, mapActions } from 'vuex'
import '@/styles/buttonsStyles.sass'

export default {
  emits: ['open-sidebar'],
  name: 'productsView',
  components: {
    SideBar, PageHeader, PageFooter, ProduceForm, CreateCounterpartyForm, SubmitForm, UpdateCounterpartyForm
  },
  data () {
    return {
      sort: {
        field: null,
        order: 1
      },
      isCreateCounterpartyFormVisible: false,
      isUpdateCounterpartyFormVisible: false,
      isSearchInputVisible: false,
      isSearchInputDisabled: true,
      showDropDown: false,
      searchButtonText: 'Поиск',
      searchColumn: '',
      searchText: '',
      currentCounterparty: null,
      isProduceFormVisible: false,
      isSideBarVisible: false,
      isSubmitFormVisible: false,
      isSideBarAnimate: window.innerWidth < 1780,
      logs: [],
      filteredItems: []
    }
  },
  computed: {
    ...mapGetters(['getCounterparties']),
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
    this.fetchCounterparties().then(() => {
      this.filteredItems = this.getCounterparties
    })
  },
  beforeUnmount () {
    window.removeEventListener('resize', this.handleWindowResizeForSidebar)
  },
  methods: {
    ...mapActions(['fetchCounterparties']),
    handleSearch () {
      const searchText = this.searchText.toLowerCase()
      if (searchText === '') {
        this.filteredItems = this.getCounterparties
        return
      }
      switch (this.searchColumn) {
        case 'Номер №':
          this.filteredItems = this.getCounterparties.filter(item => {
            return (
              item.id === parseFloat(searchText)
            )
          })
          break
        case 'Наименование':
          this.filteredItems = this.getCounterparties.filter(item => {
            return (
              item.name.toLowerCase().includes(searchText)
            )
          })
          break
        case 'Адрес':
          this.filteredItems = this.getCounterparties.filter(item => {
            return (
              item.adress.toLowerCase().includes(searchText)
            )
          })
          break
        case 'ИНН':
          this.filteredItems = this.getCounterparties.filter(item => {
            return (
              item.inn.toLowerCase().includes(searchText)
            )
          })
          break
        case 'КПП':
          this.filteredItems = this.getCounterparties.filter(item => {
            return (
              item.kpp.toLowerCase().includes(searchText)
            )
          })
          break
      }
    },
    async fetchCounterpartiesFromServer () {
      await this.fetchCounterparties().then(() => {
        this.filteredItems = this.getCounterparties
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
      console.log(this.searchColumn)
      this.showDropDown = false
      this.isSearchInputDisabled = false
    },
    openProduceForm (item) {
      this.isProduceFormVisible = true
      this.currentProduct = item
    },
    closeProduceForm: function () { this.isProduceFormVisible = false },
    openCreateCounterpartyForm: function () { this.isCreateCounterpartyFormVisible = true },
    closeCreateCounterpartyForm: function () { this.isCreateCounterpartyFormVisible = false },
    openUpdateCounterpartyForm (item) {
      this.isUpdateCounterpartyFormVisible = true
      this.currentCounterparty = item
    },
    closeUpdateCounterpartyForm: function () { this.isUpdateCounterpartyFormVisible = false },
    openSubmitForm (item) {
      this.isSubmitFormVisible = true
      this.currentCounterparty = item
    },
    closeSubmitForm: function () { this.isSubmitFormVisible = false },
    clearInput (item) {
      item.ready_to_ship = item.produced - item.shipped
    },
    async confirmActions () {
      try {
        await this.$store.dispatch('deleteCounterparty', this.currentCounterparty.id)
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
  grid-template-columns: 5% 20% 25% 15% 15% 10% 10%
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
.table-cell-input
  width: 90%
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
