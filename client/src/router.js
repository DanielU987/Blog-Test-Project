import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/ListPosts.vue";

import EditPost from "./views/EditPost.vue";

import RegisterUser from "./views/SignUp.vue";
import LoginUser from "./views/Login.vue";

const CreatePost = () => import("./views/CreatePost.vue");
const ViewPost = () => import("./views/ViewPost.vue");

const Profile = () => import("./views/Profile.vue");
const BoardAdmin = () => import("./views/BoardAdmin.vue");
const BoardModerator = () => import("./views/BoardModerator.vue");
const BoardUser = () => import("./views/BoardUser.vue");

const routes = [
  { path: "/", component: Home },
  { path: "/posts", component: Home },
  { path: "/posts/create", component: CreatePost, name: "CreatePost" },
  { path: "/posts/edit/:id", component: EditPost, name: "EditPost" },
  { path: "/posts/:id", component: ViewPost, name: "ViewPost" },
  { path: "/auth/register", component: RegisterUser, name: "RegisterUser" },
  { path: "/auth/login", component: LoginUser, name: "LoginUser" },
  { path: "/auth/user", component: BoardUser, name: "BoardUser" },
  { path: "/auth/profile/:username", component: Profile, name: "Profile" },
  { path: "/auth/mod", component: BoardModerator, name: "moderator" },
  { path: "/auth/admin", component: BoardAdmin, name: "admin" },
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
