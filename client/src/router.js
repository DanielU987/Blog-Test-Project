import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './views/Home.vue';
import CreatePost from './views/CreatePost.vue';
import EditPost from './views/EditPost.vue';
import PostList from './views/PostList.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/posts',
    name: 'Posts',
    component: PostList
  },
  {
    path: '/posts/create',
    name: 'CreatePost',
    component: CreatePost
  },
  {
    path: '/posts/edit/:id',
    name: 'EditPost',
    component: EditPost
  },
  {
    path: '/posts/view/:id',
    name: 'ViewPost',
    component: ViewPost
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;