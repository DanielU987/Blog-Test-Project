import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Импортируйте ваш маршрутизатор

const app = createApp(App);

// Используйте маршрутизатор в приложении
app.use(router);

app.mount('#app');
