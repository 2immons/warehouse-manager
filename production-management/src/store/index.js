import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    organisation: {
      name: 'ООО "Вектор"',
      adress: 'Саратов',
      INN: '2223433322344',
      OGRN: '2223433322344',
      CEO: 'Иванов В.П.',
      isInSetting: false
    },
    products: [],
    details: [],
    logs: [],
    orders: [],
    counterparties: [],
    compabilities: [],
    productions: [],
    shippings: [],
    writeOffs: []
  },
  mutations: {
    setProductions (state, productions) {
      state.productions = productions
    },
    createProduction (state, production) {
      state.productions.push(production)
    },
    setShippings (state, shippings) {
      state.shippings = shippings
    },
    createShipping (state, shippings) {
      for (let i = 0; i < shippings.length; i++) {
        state.shippings.push(shippings[i])
      }
    },
    setWriteOffs (state, writeOffs) {
      state.writeOffs = writeOffs
    },
    createWriteOff (state, writeOffs) {
      for (let i = 0; i < writeOffs.length; i++) {
        state.writeOffs.push(writeOffs[i])
      }
    },
    setCounterparties (state, counterparties) {
      state.counterparties = counterparties
    },
    updateCounterparty (state, updatedCounterparty) {
      const index = state.counterparties.findIndex(counterparty => counterparty.id === updatedCounterparty.id)
      if (index !== -1) {
        state.counterparties.splice(index, 1, updatedCounterparty)
      }
    },
    createCounterparty (state, counterparty) {
      state.counterparties.push(counterparty)
    },
    deleteCounterparty (state, id) {
      const index = state.counterparties.findIndex(item => item.id === id)
      if (index !== -1) {
        state.counterparties.splice(index, 1)
      }
    },
    setDetails (state, details) {
      state.details = details
    },
    setCompabilities (state, compabilities) {
      state.compabilities = compabilities
    },
    createDetails (state, details) {
      for (let i = 0; i < details.length; i++) {
        state.details.push(details[i])
      }
    },
    updateDetails (state, updatedDetails) {
      state.products = updatedDetails
    },
    setOrders (state, orders) {
      state.orders = orders
    },
    updateOrders (state, updatedOrders) {
      state.orders = updatedOrders
    },
    createOrder (state, order) {
      state.orders.push(order)
    },
    updateOrder (state, updatedOrder) {
      const index = state.orders.findIndex(order => order.id === updatedOrder.id)
      if (index !== -1) {
        state.orders.splice(index, 1, updatedOrder)
      }
    },
    createProduct (state, product) {
      state.products.push(product)
    },
    setProducts (state, products) {
      state.products = products
    },
    updateProducts (state, updatedProducts) {
      state.products = updatedProducts
    },
    updateProduct (state, updatedProduct) {
      const index = state.products.findIndex(product => product.id === updatedProduct.id)
      if (index !== -1) {
        state.orders.splice(index, 1, updatedProduct)
      }
    }
  },
  getters: {
    getOrders: (state) => state.orders,
    getProducts: (state) => state.products,
    getDetails: (state) => state.details,
    getCounterparties: (state) => state.counterparties,
    getCompabilities: (state) => state.compabilities,
    getProductions: (state) => state.productions,
    getShippings: (state) => state.shippings,
    getWriteOffs: (state) => state.writeOffs
  },
  actions: {
    async createProduction ({ commit }, production) {
      try {
        const response = await axios.post('http://localhost:4444/api/create-production', production)

        if (response.data.success) {
          const production = response.data.production
          commit('createProduction', production)
        } else {
          console.log('Поставка не внесена')
        }
      } catch (error) {
        console.error('Ошибка при создании заказа даты:', error)
        throw error
      }
    },
    async createWriteOff ({ commit }, detailsDates) {
      try {
        const response = await axios.post('http://localhost:4444/api/create-write-off', detailsDates)

        if (response.data.success) {
          const writeOffs = response.data.writeOffs
          commit('createWriteOff', writeOffs)
        } else {
          console.log('Поставка не внесена')
        }
      } catch (error) {
        console.error('Ошибка при создании заказа даты:', error)
        throw error
      }
    },
    async createShipping ({ commit }, ordersDates) {
      try {
        const response = await axios.post('http://localhost:4444/api/create-shipping', ordersDates)

        if (response.data.success) {
          const shippings = response.data.shippings

          commit('createShipping', shippings)
        } else {
          console.log('Поставка не внесена')
        }
      } catch (error) {
        console.error('Ошибка при создании заказа даты:', error)
        throw error
      }
    },
    async fetchCounterparties ({ commit }) {
      try {
        const response = await axios.get('http://localhost:4444/api/agents')
        commit('setCounterparties', response.data.agents)
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    },
    async createCounterparty ({ commit }, { name, adress, INN, KPP }) {
      try {
        const response = await axios.post('http://localhost:4444/api/create-counterparty', {
          name,
          adress,
          INN,
          KPP
        })

        if (response.data.success) {
          const agent = response.data.agent
          commit('createCounterparty', agent)
        } else {
          console.log('Образец не создан')
        }
      } catch (error) {
        console.error('Ошибка при создании продукта:', error)
        throw error
      }
    },
    async updateCounterparty ({ commit }, updatedCounterparty) {
      try {
        commit('updateCounterparty', updatedCounterparty)
        await axios.put('http://localhost:4444/api/update-counterparty', updatedCounterparty)
      } catch (error) {
        console.error('Ошибка при обновлении данных заказа:', error)
        throw error
      }
    },
    async deleteCounterparty ({ commit }, id) {
      try {
        commit('deleteCounterparty', id)
        await axios.delete('http://localhost:4444/api/delete-counterparty/' + id)
      } catch (error) {
        console.error('Ошибка при обновлении данных заказа:', error)
        throw error
      }
    },
    async fetchDetails ({ commit }) {
      try {
        const response = await axios.get('http://localhost:4444/api/details')
        commit('setDetails', response.data.details)
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    },
    async fetchCompabilities ({ commit }) {
      try {
        const response = await axios.get('http://localhost:4444/api/compabilities')
        commit('setCompabilities', response.data.compatibilities)
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    },
    async createDetails ({ commit }, details) {
      try {
        const response = await axios.post('http://localhost:4444/api/enter-supply', details)

        if (response.data.success) {
          const details = response.data.details
          commit('createDetails', details)
        } else {
          console.log('Поставка не внесена')
        }
      } catch (error) {
        console.error('Ошибка при создании продукта:', error)
        throw error
      }
    },
    async updateDetails ({ commit }, updatedDetails) {
      try {
        const responseProducts = await axios.put('http://localhost:4444/api/update-details', updatedDetails)
        console.log('Подтверждено готовность', responseProducts.data.success)

        // const responseLogs = await axios.post('http://localhost:4444/api/create-logs', state.logs)
        // console.log('Создан лог', responseLogs.data.success)
        commit('updatedDetails', updatedDetails)
      } catch (error) {
        console.error('Ошибка при отправке данных на сервер:', error)
        throw error
      }
    },
    async fetchOrders ({ commit }) {
      try {
        const response = await axios.get('http://localhost:4444/api/orders')
        commit('setOrders', response.data.orders)
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    },
    async createOrder ({ commit }, order) {
      try {
        const response = await axios.post('http://localhost:4444/api/create-order', order)

        if (response.data.success) {
          const order = response.data.order
          commit('createOrder', order)
        } else {
          console.log('Заказ не размещен')
        }
      } catch (error) {
        console.error('Ошибка при создании заказа:', error)
        throw error
      }
    },
    async updateOrders ({ commit }, updatedOrders) {
      try {
        const response = await axios.put('http://localhost:4444/api/update-orders', updatedOrders)
        console.log('Подтверждено готовность', response.data.success)
        commit('updateOrders', updatedOrders)
      } catch (error) {
        console.error('Ошибка при отправке данных на сервер:', error)
      }
    },
    async updateOrder ({ commit }, updatedOrder) {
      try {
        commit('updateOrder', updatedOrder)
        await axios.put('http://localhost:4444/api/update-order', updatedOrder)
      } catch (error) {
        console.error('Ошибка при обновлении данных заказа:', error)
        throw error
      }
    },
    async createProduct ({ commit }, { name, description }) {
      try {
        const response = await axios.post('http://localhost:4444/api/createProduct', {
          name,
          description
        })

        if (response.data.success) {
          const product = response.data.product
          commit('createProduct', product)
        } else {
          console.log('Образец не создан')
        }
      } catch (error) {
        console.error('Ошибка при создании продукта:', error)
        throw error
      }
    },
    async fetchProducts ({ commit }) {
      try {
        const response = await axios.get('http://localhost:4444/api/products')
        commit('setProducts', response.data.products)
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    },
    async updateProducts ({ commit }, updatedProducts) {
      try {
        const responseProducts = await axios.put('http://localhost:4444/api/update-products', updatedProducts)
        console.log('Подтверждено готовность', responseProducts.data.success)

        // const responseLogs = await axios.post('http://localhost:4444/api/create-logs', state.logs)
        // console.log('Создан лог', responseLogs.data.success)
        commit('updateProducts', updatedProducts)
      } catch (error) {
        console.error('Ошибка при отправке данных на сервер:', error)
        throw error
      }
    },
    async updateProduct ({ commit }, updatedProduct) {
      try {
        commit('updateProduct', updatedProduct)
        await axios.put('http://localhost:4444/api/update-product', updatedProduct)
      } catch (error) {
        console.error('Ошибка при обновлении данных заказа:', error)
        throw error
      }
    }
  },
  modules: {
  }
})
