import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import globalMethodsMixin from './mixins/globalMethods'

const app = createApp(App)

app.mixin(globalMethodsMixin)

app.use(store).use(router).mount('#app')
