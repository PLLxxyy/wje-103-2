import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Vant from 'vant';
import 'vant/lib/index.css';
import './assets/main.css';
import App from './App.vue';
import { router } from './router';
import { permissionDirective } from './directives/v-permission';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Vant);
app.use(permissionDirective);
app.mount('#app');
