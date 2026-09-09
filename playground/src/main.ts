import { createApp } from 'vue'
import App from './App.vue'
import CodePreview from './components/CodePreview.vue'
import router from './router'
import 'morya-ui/styles.css'

const app = createApp(App)
app.component('CodePreview', CodePreview)
app.use(router)
app.mount('#app')
