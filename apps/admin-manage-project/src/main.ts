import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import '@well-insight/ui/styles.css'
import './styles/app.css'

createApp(App).use(router).mount('#app')
