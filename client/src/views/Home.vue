<template>
  <PostList />
</template>

<script>
import PostList from "@/components/ListPosts.vue";
import UserService from "../services/user.service";

export default {
  name: "Home",
  components: {
    PostList,
  },
  data() {
    return {
      content: "", // Initialize content in data
    };
  },
  mounted() {
    UserService.getPublicContent().then(
      (response) => {
        this.content = response.data;
      },
      (error) => {
        this.content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
      }
    );
  },
};
</script>

<style scoped>
/* Стили компонента, если необходимо */
</style>
