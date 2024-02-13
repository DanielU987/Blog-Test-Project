import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // Импортируйте ваш маршрутизатор
import Header from "./views/Header.vue";
import store from "./store";
import { FontAwesomeIcon } from "./plugins/font-awesome";

createApp(App).use(router).use(store).component("Header", Header).component("font-awesome-icon", FontAwesomeIcon).mount("#app");
// Используйте маршрутизатор в приложении
