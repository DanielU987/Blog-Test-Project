<template>
    <header class="p-3 text-bg-dark">
        <div class="container">
            <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                <router-link to="/" class="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
                    <svg class="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap">
                        <use xlink:href="#bootstrap"></use>
                    </svg>
                </router-link>

                <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                    <li>
                        <router-link to="/" class="nav-link px-2 text-secondary">Home</router-link>
                    </li>
                    <li>
                        <router-link to="/posts/create" class="nav-link px-2 text-white">Create</router-link>
                    </li>
                </ul>

                <form class="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
                    <input v-model="searchQuery" type="search" class="form-control form-control-dark text-bg-dark"
                        placeholder="Search..." aria-label="Search" />
                </form>

                <div class="text-end">
                    <button type="button" class="btn btn-outline-light me-2" @click="login">
                        Login
                    </button>
                    <button type="button" class="btn btn-warning" @click="signUp">
                        Sign-up
                    </button>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
export default {
    data() {
        return {
            searchQuery: "",
        };
    },
    methods: {
        login() {
            // Логика для обработки нажатия кнопки "Login"
        },
        signUp() {
            // Логика для обработки нажатия кнопки "Sign-up"
        },
    },
};
</script>

<style scoped>
/* Ваши стили могут быть добавлены здесь */
</style>
