import axios from 'axios'

// В файле user.js
export default {
  state: {
    products: []
  },
  mutations: {
    createProduct (state, product) {
      state.products.push(product)
    },
    setProducts (state, products) {
      state.products = products
    },
    updateProducts (state, updatedProducts) {
      state.products = updatedProducts
    },
    updateProduct (state, updatedProduct) {
      const index = state.products.findIndex(product => product.id === updatedProduct.id)
      if (index !== -1) {
        state.orders.splice(index, 1, updatedProduct)
      }
    }
  },
  actions: {
    async createProduct ({ commit }, { name, description }) {
      try {
        const response = await axios.post('http://localhost:4444/api/createProduct', { withCredentials: true }, {
          name,
          description
        })

        if (response.data.success) {
          const product = response.data.product
          commit('createProduct', product)
        } else {
          console.log('Образец не создан')
        }
      } catch (error) {
        console.error('Ошибка при создании продукта:', error)
        throw error
      }
    },
    async fetchProducts ({ commit }) {
      try {
        const response = await axios.get('http://localhost:4444/api/products', { withCredentials: true })
        commit('setProducts', response.data.products)
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    },
    async updateProducts ({ commit }, updatedProducts) {
      try {
        const responseProducts = await axios.put('http://localhost:4444/api/update-products', updatedProducts, { withCredentials: true })
        console.log('Подтверждено готовность', responseProducts.data.success)

        // const responseLogs = await axios.post('http://localhost:4444/api/create-logs', state.logs)
        // console.log('Создан лог', responseLogs.data.success)
        commit('updateProducts', updatedProducts)
      } catch (error) {
        console.error('Ошибка при отправке данных на сервер:', error)
        throw error
      }
    },
    async updateProduct ({ commit }, updatedProduct) {
      try {
        commit('updateProduct', updatedProduct)
        await axios.put('http://localhost:4444/api/update-product', updatedProduct, { withCredentials: true })
      } catch (error) {
        console.error('Ошибка при обновлении данных заказа:', error)
        throw error
      }
    }
  },
  getters: {
    getProducts: (state) => state.products
  }
}
