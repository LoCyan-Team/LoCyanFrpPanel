import { createApp } from 'vue'
import './style.css'
import './twemoji-amazing.css'
import App from './App.vue'
import message from '@components/Message.vue'
import loadingbar from '@components/LoadingBar.vue'
import ndialog from '@components/Dialog.vue'
import router from '@router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import userData from '@/utils/stores/userData/store'
import userDataLocal from '@/utils/stores/userData/local'
import { printTitle } from '@/utils/title'
import Clipboard from 'v-clipboard'

printTitle()

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
app.component('message', message)
app.component('loadingbar', loadingbar)
app.component('ndialog', ndialog)

userDataLocal()
app.mount('#app')
