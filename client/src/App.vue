<template>
  <Navbar />
  <div class="container page-content">
    <router-view></router-view>
  </div>
  <Footer />
</template>

<script>
import Navbar from "./views/Navbar.vue";
import PostList from "@/components/ListPosts.vue";
import Footer from "./views/Footer.vue"

export default {
  components: {
    Navbar,
    PostList,
    Footer
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: white !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.bg-dark,
.card {
  background-color: #232322 !important;
}

.page-content {
  padding-top: 58px;
}

body {
  background-color: #151514;
}

.container {
  padding-right: 0;
  padding-left: 0;
}

@media (max-width: 767px) {
  .container {
    padding-top: 0;
    padding-bottom: 58px;

  }

  .page-content {
    padding-top: 0;
  }
}

@import'~bootstrap/dist/css/bootstrap.css'
</style>
