<template>
    <footer class="navbar navbar-expand-sm navbar-dark fixed-bottom bg-dark">
        <div class="container-fluid">
            <router-link to="/posts" class="navbar-brand">
                <font-awesome-icon icon="fa-home"/>
            </router-link>
            <router-link to="/posts/create" class="navbar-brand">
                <font-awesome-icon icon="fa-plus"/>
            </router-link>
            <router-link v-if="currentUser" :to="'/auth/profile/' + currentUser.username" class="nav-link">
                <font-awesome-icon icon="user" />
            </router-link>

            <router-link v-else to="/auth/login" class="nav-link">
                <font-awesome-icon icon="sign-in-alt" /> Login
            </router-link>

        </div>
    </footer>
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
@media (min-width: 768px) {
    footer {
      display: none !important;
    }
  }
</style>