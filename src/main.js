import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import message from "./components/message.vue";
import loadingbar from "./components/loadingbar.vue";
import router from './router/index.js';
import axios from 'axios';
import VueAxios from 'vue-axios';
import store from "./utils/store.js";

const app = createApp(App);
app.use(store);
app.use(router);
app.use(VueAxios, axios);
app.component('message', message)
app.component('loadingbar', loadingbar)
app.mount("#app");
