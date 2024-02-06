import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // Импортируйте ваш маршрутизатор
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import Header from "./views/Header.vue";
import store from "./store";
import { FontAwesomeIcon } from "./plugins/font-awesome";

createApp(App).use(router).use(store).component("Header", Header).component("font-awesome-icon", FontAwesomeIcon).mount("#app");
// Используйте маршрутизатор в приложении
