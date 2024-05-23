import axios from 'axios'

export default {
  state: {
    settings: []
  },
  mutations: {
    setSettings (state, settings) {
      state.settings = settings
    },
    updateSettings (state, updatedSettings) {
      state.settings = updatedSettings
    }
  },
  actions: {
    async fetchSettings ({ commit }) {
      try {
        const response = await axios.get('http://localhost:4444/api/settings', { withCredentials: true })
        commit('setSettings', response.data.settings)
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    },
    async updateSettings ({ commit }, updatedSettings) {
      try {
        const response = await axios.put('http://localhost:4444/api/update-settings', updatedSettings, { withCredentials: true })
        console.log('Настройки успешно обновлены: ', response.data.success)
        commit('updateSettings', updatedSettings)
      } catch (error) {
        console.error('Ошибка при отправке данных на сервер:', error)
      }
    }
  },
  getters: {
    getSettings: (state) => state.settings
  }
}
