import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { VueQueryPlugin } from '@tanstack/vue-query'
import messages from '@/locales'

const i18n = createI18n({
  locale: 'fr',
  messages
})

import App from '@/components/App.vue'
import router from '@/router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(VueQueryPlugin)

app.mount('#app')
