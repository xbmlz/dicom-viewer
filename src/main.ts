import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { NoirPreset } from './theme'

import '@unocss/reset/tailwind.css'

import './styles/main.css'
import 'uno.css'

document.documentElement.classList.add('p-dark')

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: NoirPreset,
    options: {
      darkModeSelector: '.dark',
    },
  },
})
app.use(ToastService)

app.use(router)

app.mount('#app')
