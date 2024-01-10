<template>
  <div>
    <h2>Просмотр поста</h2>
    <div v-if="post">
      <h3>{{ post.title }}</h3>
      <p>{{ post.content }}</p>
      <img :src="getPostImage(post)" class="card-img-top" alt="Post Image">
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
    getPostImage(post) {
      if (post.picture && post.picture.type === 'Buffer') {
        const bufferData = Buffer.from(post.picture.data);
        return `data:image/png;base64,${bufferData.toString('base64')}`;
      }
      return ''; // You can provide a default image or handle the case when there is no image
    },
  },
};
</script>

<style scoped>
/* Стили компонента, если необходимо */
</style>
