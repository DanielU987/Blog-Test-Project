import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Импортируйте ваш маршрутизатор
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import Header from './components/Header.vue';

const app = createApp(App);

app.component('Header', Header);

// Используйте маршрутизатор в приложении
app.use(router);

app.mount('#app');
