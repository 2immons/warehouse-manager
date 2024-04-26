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
    },
    updateDocument (state, updatedDocument) {
      const index = state.documents.findIndex(document => document.id === updatedDocument.id)
      if (index !== -1) {
        state.documents.splice(index, 1, updatedDocument)
      }
    },
    deleteDocument (state, id) {
      const index = state.documents.findIndex(item => item.id === id)
      if (index !== -1) {
        state.documents.splice(index, 1)
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
    },
    async updateDocument ({ commit }, updatedDocument) {
      try {
        commit('updateDocument', updatedDocument)
        await axios.put('http://localhost:4444/api/update-document', updatedDocument, { withCredentials: true })
      } catch (error) {
        console.error('Ошибка при обновлении документа:', error)
        throw error
      }
    },
    async deleteDocument ({ commit }, id) {
      try {
        commit('deleteDocument', id)
        await axios.delete('http://localhost:4444/api/delete-document/' + id, { withCredentials: true })
      } catch (error) {
        console.error('Ошибка при удалении документа:', error)
        throw error
      }
    }
  },
  getters: {
    getDocuments: (state) => state.documents
  }
}
