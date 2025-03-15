import { createApp } from 'vue'
import '@/assets/style.css'
import '@/assets/twemoji-amazing.css'
import 'github-markdown-css/github-markdown.css'
import App from '@/App.vue'
import router from '@/router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import userData from '@/utils/stores/userData/store'
import userDataLocal from '@/utils/stores/userData/local'
import banner from '@/utils/title'
import Clipboard from 'v-clipboard'

banner()

const app = createApp(App)
app.use(userData)
app.use(router)
// app.use(websocket, '', {
//     connectManually: true,
//     format: 'json',
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 2000,
// })

const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)

app.use(Clipboard)
app.use(VueAxios, axios)

userDataLocal()
app.mount('#app')
