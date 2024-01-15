import axios from 'axios'

export default {
  state: {
    counterparties: []
  },
  mutations: {
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
    }
  },
  actions: {
    async fetchCounterparties ({ commit }) {
      try {
        const response = await axios.get('http://localhost:4444/api/agents', { withCredentials: true })
        commit('setCounterparties', response.data.agents)
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    },
    async createCounterparty ({ commit }, { name, adress, INN, KPP }) {
      try {
        const response = await axios.post('http://localhost:4444/api/create-counterparty', { withCredentials: true }, {
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
        await axios.put('http://localhost:4444/api/update-counterparty', updatedCounterparty, { withCredentials: true })
      } catch (error) {
        console.error('Ошибка при обновлении данных заказа:', error)
        throw error
      }
    },
    async deleteCounterparty ({ commit }, id) {
      try {
        commit('deleteCounterparty', id)
        await axios.delete('http://localhost:4444/api/delete-counterparty/' + id, { withCredentials: true })
      } catch (error) {
        console.error('Ошибка при обновлении данных заказа:', error)
        throw error
      }
    }
  },
  getters: {
    getCounterparties: (state) => state.counterparties
  }
}
