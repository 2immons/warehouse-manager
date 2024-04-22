import axios from 'axios'

export default {
  state: {
    documents: []
  },
  mutations: {
    setDocuments (state, documents) {
      state.documents = documents
    },
    createDocument (state, documents) {
      for (let i = 0; i < documents.length; i++) {
        state.documents.push(documents[i])
      }
    }
  },
  actions: {
    async createDocument ({ commit }, document) {
      try {
        const response = await axios.post('http://localhost:4444/api/create-document', document, { withCredentials: true })

        if (response.data.success) {
          const document = response.data.document
          commit('createDocument', document)
        } else {
          console.log('Документ не создан')
        }
      } catch (error) {
        console.error('Ошибка при создании документа:', error)
        throw error
      }
    },
    async fetchDocuments ({ commit }) {
      try {
        const response = await axios.get('http://localhost:4444/api/documents', { withCredentials: true })
        commit('setDocuments', response.data.documents)
      } catch (error) {
        console.error('Ошибка загрузки документов:', error)
      }
    }
  },
  getters: {
    getDocuments: (state) => state.documents
  }
}
