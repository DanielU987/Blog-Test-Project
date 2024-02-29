<template>
  <Navbar />
  <div class="container bg-black">
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
  color:white !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.bg-dark {
  background-color: #111417 !important;
}

body{
  background-color: black;
}

.card {
  background-color: #36454F;
}

.container {
  padding-right:0 ;
  padding-left:0 ;
}
@import'~bootstrap/dist/css/bootstrap.css'


</style>
