import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// Configurer l'adresse de l'API ici pour tout le projet
const API_URL = 'https://fatourty.onrender.com'

axios.defaults.baseURL = API_URL

const app = createApp(App)

app.use(router)

app.mount('#app')
