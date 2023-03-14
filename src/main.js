import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import message from "./components/message.vue";
import loadingbar from "./components/loadingbar.vue";
import ndialog from "./components/ndialog.vue";
import router from './router/index.js';
import axios from 'axios';
import VueAxios from 'vue-axios';
import store from "./utils/stores/store.js";
import websocket from 'vue-native-websocket';

const app = createApp(App);
app.use(store);
app.use(router);
// app.use(websocket, '', {
//     connectManually: true,
//     format: 'json',
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 2000,
// })
app.use(VueAxios, axios);
app.component('message', message)
app.component('loadingbar', loadingbar)
app.component('ndialog', ndialog)
app.mount("#app");
