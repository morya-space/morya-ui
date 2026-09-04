import { createApp } from 'vue'
import App from './App.vue'
import CodePreview from './components/CodePreview.vue'
import router from './router'
import '@wex-design/ui/styles.css'

const app = createApp(App)
app.component('CodePreview', CodePreview)
app.use(router)
app.mount('#app')
