import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";

import EditPost from "./components/EditPost.vue";

import RegisterUser from "./components/Registration.vue";
import LoginUser from "./components/Login.vue";

const CreatePost = () => import("./components/CreatePost.vue");
const ViewPost = () => import("./components/ViewPost.vue");

const Profile = () => import("./components/Profile.vue");
const BoardAdmin = () => import("./components/BoardAdmin.vue");
const BoardModerator = () => import("./components/BoardModerator.vue");
const BoardUser = () => import("./components/BoardUser.vue");

const routes = [
  { path: "/", component: Home },
  { path: "/posts", component: Home },
  { path: "/posts/create", component: CreatePost, name: "CreatePost" },
  { path: "/posts/edit/:id", component: EditPost, name: "EditPost" },
  { path: "/posts/:id", component: ViewPost, name: "ViewPost" },
  { path: "/auth/register", component: RegisterUser, name: "RegisterUser" },
  { path: "/auth/login", component: LoginUser, name: "LoginUser" },
  { path: "/auth/user", component: BoardUser, name: "BoardUser" },
  { path: "/auth/profile", component: Profile, name: "Profile" },
  { path: "/auth/mod", component: BoardModerator, name: "moderator" },
  { path: "/auth/admin", component: BoardAdmin, name: "admin" },
  // Другие маршруты...
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/auth/login", "/auth/register", "/posts", "/"];

  // Check if the route is "/posts" or starts with "/posts/" but not "/posts/edit/"
  if (to.path.startsWith("/posts") && !to.path.startsWith("/posts/edit") && !to.path.startsWith("/posts/create")) {
    publicPages.push(to.path);
  }

  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("user");

  if (authRequired && !loggedIn) {
    next("/auth/login");
  } else {
    next();
  }
});
export default router;
