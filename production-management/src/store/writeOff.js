import axios from 'axios'

export default {
  state: {
    writeOffs: []
  },
  mutations: {
    setWriteOffs (state, writeOffs) {
      state.writeOffs = writeOffs
    },
    createWriteOff (state, writeOffs) {
      for (let i = 0; i < writeOffs.length; i++) {
        state.writeOffs.push(writeOffs[i])
      }
    }
  },
  actions: {
    async createWriteOff ({ commit }, detailsDates) {
      try {
        const response = await axios.post('http://localhost:4444/api/create-write-off', detailsDates, { withCredentials: true })

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
    async fetchWriteOffs ({ commit }) {
      try {
        const response = await axios.get('http://localhost:4444/api/products-write-offs', { withCredentials: true })
        commit('setWriteOffs', response.data.writeOffs)
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    }
  },
  getters: {
    getWriteOffs: (state) => state.writeOffs
  }
}
