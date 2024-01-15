import axios from 'axios'

export default {
  state: {
    productions: []
  },
  mutations: {
    setProductions (state, productions) {
      state.productions = productions
    },
    createProduction (state, production) {
      state.productions.push(production)
    }
  },
  actions: {
    async createProduction ({ commit }, production) {
      try {
        const response = await axios.post('http://localhost:4444/api/create-production', production, { withCredentials: true })

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
    }
  },
  getters: {
    getProductions: (state) => state.productions
  }
}
