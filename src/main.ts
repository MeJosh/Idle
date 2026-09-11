import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(PrimeVue, { unstyled: true })
  .use(ToastService)
  .mount('#app')
