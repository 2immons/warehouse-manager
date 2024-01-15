import axios from 'axios'

export default {
  state: {
    compabilities: []
  },
  mutations: {
    setCompabilities (state, compabilities) {
      state.compabilities = compabilities
    }
  },
  actions: {
    async fetchCompabilities ({ commit }) {
      try {
        const response = await axios.get('http://localhost:4444/api/compabilities', { withCredentials: true })
        commit('setCompabilities', response.data.compatibilities)
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    }
  },
  getters: {
    getCompabilities: (state) => state.compabilities
  }
}
