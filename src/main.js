import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './components/store/index'
import './css/tailwind.css'

import BaseDialog from './components/BaseComponents/BaseDialog.vue'
import BaseSpinner from './components/BaseComponents/BaseSpinner.vue'
import TheHeader from './components/BaseComponents/TheHeader.vue'

const app = createApp(App)

app.use(router)
app.use(store)

app.use('base-dialog', BaseDialog)
app.use('base-spinner', BaseSpinner)
app.use('the-header', TheHeader)

app.mount('#app')
