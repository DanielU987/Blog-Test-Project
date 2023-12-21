<template>
  <div>
    <h2>Список постов</h2>
    <ul>
      <li v-for="post in posts" :key="post.id">
        <h3>{{ post.title }}</h3>
        <p>{{ post.content }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      posts: [],
    };
  },
  mounted() {
    this.fetchPosts();
  },
  methods: {
    fetchPosts() {
      // Получение списка постов с сервера
      // Здесь используем API маршруты, например /api/posts
      axios
        .get("/api/posts")
        .then((response) => {
          // Обработка успешного ответа от сервера
          this.posts = response.data;
        })
        .catch((error) => {
          // Обработка ошибки
          console.error(error);
        });
    },
  },
};
</script>

<style scoped>
/* Стили компонента, если необходимо */
</style>
