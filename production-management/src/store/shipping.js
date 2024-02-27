import axios from 'axios'

export default {
  state: {
    shippings: []
  },
  mutations: {
    setShippings (state, shippings) {
      state.shippings = shippings
    },
    createShipping (state, shippings) {
      for (let i = 0; i < shippings.length; i++) {
        state.shippings.push(shippings[i])
      }
    }
  },
  actions: {
    async createShipping ({ commit }, ordersDates) {
      try {
        const response = await axios.post('http://localhost:4444/api/create-shipping', ordersDates, { withCredentials: true })

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
    async fetchShippings ({ commit }) {
      try {
        const response = await axios.get('http://localhost:4444/api/products-shippings', { withCredentials: true })
        commit('setShippings', response.data.shippings)
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    }
  },
  getters: {
    getShippings: (state) => state.shippings
  }
}
