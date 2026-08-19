import { createApp } from 'vue'
import '@well-insight/ui/styles.css'
import App from './App.vue'
import CodePreview from './components/CodePreview.vue'
import router from './router'

const app = createApp(App)
app.component('CodePreview', CodePreview)
app.use(router)
app.mount('#app')
