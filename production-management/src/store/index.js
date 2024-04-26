import { createStore } from 'vuex'
import userModule from './user'
import productModule from './product'
import detailModule from './detail'
import logModule from './log'
import orderModule from './order'
import counterpartyModule from './counterparty'
import compabilityModule from './compability'
import productionModule from './production'
import shippingModule from './shipping'
import writeOffModule from './writeOff'
import documentModule from './documents'

export default createStore({
  modules: {
    user: userModule,
    product: productModule,
    detail: detailModule,
    log: logModule,
    order: orderModule,
    counterparty: counterpartyModule,
    compability: compabilityModule,
    production: productionModule,
    shipping: shippingModule,
    writeOff: writeOffModule,
    document: documentModule
  },
  state: {
    organisation: {
      name: 'ООО "Вектор"',
      adress: 'Саратов',
      INN: '2223433322344',
      OGRN: '2223433322344',
      CEO: 'Иванов В.П.',
      isInSetting: false
    }
  },
  mutations: {
  },
  getters: {
  },
  actions: {
  }
})
