import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// Configurer l'adresse de l'API ici pour tout le projet
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3000' 
    : 'https://fatourty.onrender.com'

axios.defaults.baseURL = API_URL

const app = createApp(App)

app.use(router)

app.mount('#app')
