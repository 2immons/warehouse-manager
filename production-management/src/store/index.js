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
import settingsModule from './settings'

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
    document: documentModule,
    settings: settingsModule
  },
  state: {
  },
  mutations: {
  },
  getters: {
  },
  actions: {
  }
})
