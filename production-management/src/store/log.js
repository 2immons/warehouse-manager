import axios from 'axios'

export default {
  state: {
    logs: []
  },
  mutations: {
    setLogs (state, logs) {
      state.logs = logs
    },
    removeNotification (state, payload) {
      if (payload.removeAll) {
        state.logs.splice(0, state.logs.length)
      } else {
        const index = state.logs.findIndex(log => log.id === payload.notification.id)
        if (index !== -1) {
          state.logs.splice(index, 1)
        }
      }
    }
  },
  actions: {
    async fetchNotifications ({ commit }) {
      try {
        const response = await axios.get('http://localhost:4444/api/notifications', { withCredentials: true })
        commit('setLogs', response.data.notifications)
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    },
    async createLog ({ commit }, log) {
      try {
        const response = await axios.post('http://localhost:4444/api/create-log', log, { withCredentials: true })
        console.log('Лог создан', response.data.success)
      } catch (error) {
        console.error('Ошибка при создании продукта:', error)
        throw error
      }
    },
    async readNotifications ({ commit, state }) {
      try {
        const responseLogs = await axios.put('http://localhost:4444/api/update-logs', state.logs, { withCredentials: true })
        console.log('Подтверждено готовность', responseLogs.data.success)
        commit('removeNotification', { removeAll: true })
      } catch (error) {
        console.error('Ошибка при отправке данных на сервер:', error)
        throw error
      }
    },
    async readNotification ({ commit }, notification) {
      try {
        const responseLog = await axios.put('http://localhost:4444/api/update-log', notification, { withCredentials: true })
        console.log('Подтверждено готовность', responseLog.data.success)
        commit('removeNotification', { notification: notification })
      } catch (error) {
        console.error('Ошибка при отправке данных на сервер:', error)
        throw error
      }
    }
  },
  getters: {
    getNotifications: (state) => state.logs,
    getNotificationsCount: (state) => state.logs.length
  }
}
