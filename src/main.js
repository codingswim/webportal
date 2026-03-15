import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import i18n from './i18n'
import './styles/main.scss'
import { getCurrentTheme, setTheme } from './utils/theme'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(i18n)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// app.use(ElementPlus)
setTheme(getCurrentTheme())

app.mount('#app')
