import axios from 'axios'
import Cookies from 'js-cookie'

export default {
  state: {
    users: []
  },
  mutations: {
    setUsers (state, users) {
      state.users = users
    }
  },
  actions: {
    // async fetchUsers ({ commit }) {
    //   try {
    //     const response = await axios.get('http://localhost:4444/api/details', { withCredentials: true })
    //     commit('setDetails', response.data.details)
    //   } catch (error) {
    //     console.error('Error fetching orders:', error)
    //   }
    // },
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
    async loginUser ({ commit }, user) {
      try {
        const response = await axios.get('http://localhost:4444/api/login', user)

        if (!response.data.success) {
          console.log('Не успешная аутентификация')
          return false
        }

        Cookies.set('token', response.data.token)
        console.log('Успешная аутентификация', Cookies.get('token'), response.data.user)
        sessionStorage.setItem('username', response.data.user.name)
        Cookies.set('userId', response.data.user.id)
        sessionStorage.setItem('userId', response.data.user.id)
        sessionStorage.setItem('role', response.data.user.role)
        return true
      } catch (error) {
        console.error('Ошибка при авторизации:', error)
        throw error
      }
    },
    async registerUser ({ commit }, user) {
      try {
        const response = await axios.post('http://localhost:4444/api/register', user)
        return response
      } catch (error) {
        console.error('Ошибка при регистрации:', error)
        throw error
      }
    }
  },
  getters: {
    // getDetails: (state) => state.details
  }
}
