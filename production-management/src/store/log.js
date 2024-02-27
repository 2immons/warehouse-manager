import axios from 'axios'

export default {
  state: {
    notifications: [],
    logs: []
  },
  mutations: {
    setNotifications (state, notifications) {
      state.notifications = notifications
    },
    setLogs (state, logs) {
      state.logs = logs
    },
    removeNotification (state, payload) {
      if (payload.removeAll) {
        state.notifications.splice(0, state.notifications.length)
      } else {
        const index = state.logs.findIndex(log => log.id === payload.notification.id)
        if (index !== -1) {
          state.notifications.splice(index, 1)
        }
      }
    }
  },
  actions: {
    async fetchNotifications ({ commit }) {
      try {
        const response = await axios.get('http://localhost:4444/api/notifications', { withCredentials: true })
        commit('setNotifications', response.data.notifications)
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    },
    async fetchLogs ({ commit }) {
      try {
        const response = await axios.get('http://localhost:4444/api/logs', { withCredentials: true })
        commit('setLogs', response.data.logs)
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
    getNotifications: (state) => state.notifications,
    getLogs: (state) => state.logs,
    getNotificationsCount: (state) => state.notifications.length
  }
}
