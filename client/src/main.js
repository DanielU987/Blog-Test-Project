import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // Импортируйте ваш маршрутизатор
import store from "./store";
import { FontAwesomeIcon } from "./plugins/font-awesome";

// Создание экземпляра приложения Vue
const app = createApp(App);
app.use(router);
app.use(store);
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
