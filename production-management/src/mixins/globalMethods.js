import axios from 'axios'

export default {
  methods: {
    getCurrentDate () {
      const jsDate = new Date()
      const correctedDate = new Date(jsDate.getTime() + jsDate.getTimezoneOffset() * -1 * 60 * 1000)
      return correctedDate.toISOString().slice(0, 16).replace('T', ' ')
    },
    async fetchDataFromServer (data) {
      switch (data) {
        case data === 'orders':
          try {
            const response = await axios.get('http://localhost:4444/api/orders')
            return response.data.orders
          } catch (error) {
            console.error('Error fetching products:', error)
          }
          break
        case data === 'products':
          try {
            const response = await axios.get('http://localhost:4444/api/products')
            return response.data.products
          } catch (error) {
            console.error('Error fetching products:', error)
          }
          break
        case data === 'details':
          try {
            const response = await axios.get('http://localhost:4444/api/details')
            return response.data.details
          } catch (error) {
            console.error('Error fetching products:', error)
          }
          break
        default:
          break
      }
    }
  }
}
