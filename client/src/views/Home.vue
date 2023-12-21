<template>
  <div>
    <h1>Добро пожаловать на блог</h1>
    <PostList />
  </div>
</template>

<script>
import PostList from "@/components/ListPosts.vue";

export default {
  components: {
    PostList,
  },
};
</script>

<style scoped>
/* Стили компонента, если необходимо */
</style>
