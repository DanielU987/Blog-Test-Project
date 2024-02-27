<template>
  <Navbar />
  <div class="container bg-black">
    <router-view></router-view>
  </div>
  
</template>

<script>
import Navbar from "./views/Navbar.vue";
export default {
  components: {
    Navbar
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color:white !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #2c2d30;
}
.card {
  border-radius: 25px;
  background-color: #202225;
}

.container {
  padding-right:0 ;
  padding-left:0 ;
}
@import'~bootstrap/dist/css/bootstrap.css'


</style>
