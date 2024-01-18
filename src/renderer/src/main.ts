import { createApp } from 'vue'
import App from './App.vue'
import AddModules from './modules'
import './styles/index.scss'

const app = createApp(App)

AddModules(app)
app.mount('#app')
