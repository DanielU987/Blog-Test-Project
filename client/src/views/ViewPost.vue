<template>
  <div>
    <h2>Просмотр поста</h2>
    <div v-if="post">
      <h3>{{ post.title }}</h3>
      <p>{{ post.content }}</p>
      <button class="btn btn-danger" @click="deletePost">Удалить пост</button>
    </div>
    <div v-else>
      <p>Пост не найден</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      post: null,
    };
  },
  mounted() {
    this.fetchPost();
  },
  methods: {
    fetchPost() {
      const postId = this.$route.params.id;
      axios
        .get(`http://localhost:3000/api/posts/${postId}`)
        .then((response) => {
          this.post = response.data;
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            // Обработка ошибки 404 (пост не найден)
            this.post = null;
          } else {
            console.error(error);
          }
        });
    },
    deletePost() {
      const postId = this.$route.params.id;
      axios
        .delete(`http://localhost:3000/api/posts/${postId}`)
        .then(() => {
          // Перенаправление на страницу со списком постов после удаления
          this.$router.push({ path: "/posts" });
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>

<style scoped>
/* Стили компонента, если необходимо */
</style>
