<template>
  <nav class="navbar fixed-top navbar-expand-sm navbar-dark bg-dark">
    <div class="container">
      <router-link to="/posts" class="navbar-brand">MyBlog</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarsExample03"
        aria-controls="navbarsExample03"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarsExample03">
        <ul class="navbar-nav me-auto mb-2 mb-sm-0">
          <li class="nav-item">
            <router-link to="/posts/create" class="nav-link">
              Create
              <font-awesome-icon icon="plus" /> 
            </router-link>
          </li>
        </ul>

        <div v-if="currentUser" class="navbar-nav ml-auto">
          <li class="nav-item">
            <router-link :to="'/auth/profile/' + currentUser.username" class="nav-link">
              <font-awesome-icon icon="user" />
              {{ currentUser.username }}
            </router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link" @click.prevent="logOut">
              <font-awesome-icon icon="sign-out-alt" /> LogOut
            </a>
          </li>
        </div>

        <div v-else class="navbar-nav ml-auto">
          <li class="nav-item">
            <router-link to="/auth/login" class="nav-link">
              <font-awesome-icon icon="sign-in-alt" /> Login
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/auth/register" class="nav-link">
              <font-awesome-icon icon="user-plus" /> Sign Up
            </router-link>
          </li>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch("auth/logout");
      this.$router.push("/auth/login");
    },
  },
};
</script>

<style scoped>

@media (max-width: 767px) {
  nav {
    display: none !important;
  }
}
</style>
