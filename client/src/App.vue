<template>
  <Navbar />
  <div class="container">
    <router-view></router-view>
  </div>
  
</template>

<script>
import Header from "./views/Header.vue";
import Navbar from "./views/Navbar.vue";
export default {
  components: {
    Header,
    Navbar
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
@import'~bootstrap/dist/css/bootstrap.css'

</style>
