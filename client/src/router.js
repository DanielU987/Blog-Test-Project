import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import CreatePost from './views/CreatePost.vue';
import EditPost from './views/EditPost.vue';
import ViewPost from './views/ViewPost.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/posts', component: Home },
  { path: '/posts/create', component: CreatePost, name: 'CreatePost' },
  { path: '/posts/edit/:id', component: EditPost, name: 'EditPost' },
  { path: '/posts/:id', component: ViewPost, name: 'ViewPost' },
  // Другие маршруты...
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
