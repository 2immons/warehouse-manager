import axios from 'axios'

// В файле user.js
export default {
  state: {
    orders: []
  },
  mutations: {
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
    }
  },
  actions: {
    async fetchOrders ({ commit }) {
      try {
        const response = await axios.get('http://localhost:4444/api/orders', { withCredentials: true })
        commit('setOrders', response.data.orders)
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    },
    async createOrder ({ commit }, order) {
      try {
        const response = await axios.post('http://localhost:4444/api/create-order', order, { withCredentials: true })

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
        const response = await axios.put('http://localhost:4444/api/update-orders', updatedOrders, { withCredentials: true })
        console.log('Подтверждено готовность', response.data.success)
        commit('updateOrders', updatedOrders)
      } catch (error) {
        console.error('Ошибка при отправке данных на сервер:', error)
      }
    },
    async updateOrder ({ commit }, updatedOrder) {
      try {
        commit('updateOrder', updatedOrder)
        await axios.put('http://localhost:4444/api/update-order', updatedOrder, { withCredentials: true })
      } catch (error) {
        console.error('Ошибка при обновлении данных заказа:', error)
        throw error
      }
    }
  },
  getters: {
    getOrders: (state) => state.orders
  }
}
