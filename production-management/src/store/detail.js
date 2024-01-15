import axios from 'axios'

export default {
  state: {
    details: []
  },
  mutations: {
    setDetails (state, details) {
      state.details = details
    },
    createDetails (state, details) {
      for (let i = 0; i < details.length; i++) {
        state.details.push(details[i])
      }
    },
    updateDetails (state, updatedDetails) {
      state.products = updatedDetails
    }
  },
  actions: {
    async fetchDetails ({ commit }) {
      try {
        const response = await axios.get('http://localhost:4444/api/details', { withCredentials: true })
        commit('setDetails', response.data.details)
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    },
    async updateDetails ({ commit }, updatedDetails) {
      try {
        const responseProducts = await axios.put('http://localhost:4444/api/update-details', updatedDetails, { withCredentials: true })
        console.log('Подтверждено готовность', responseProducts.data.success)

        // const responseLogs = await axios.post('http://localhost:4444/api/create-logs', state.logs)
        // console.log('Создан лог', responseLogs.data.success)
        commit('updateDetails', updatedDetails)
      } catch (error) {
        console.error('Ошибка при отправке данных на сервер:', error)
        throw error
      }
    },
    async createDetails ({ commit }, details) {
      try {
        const response = await axios.post('http://localhost:4444/api/enter-supply', details, { withCredentials: true })

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
    }
  },
  getters: {
    getDetails: (state) => state.details
  }
}
