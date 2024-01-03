<template>
  <div>
    <h2>Редактировать пост</h2>
    <form @submit.prevent="submitForm">
      <label for="title">Заголовок:</label>
      <input type="text" id="title" v-model="post.title" required />

      <label for="content">Содержание:</label>
      <textarea id="content" v-model="post.content" required></textarea>
      <button type="submit">Сохранить изменения</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      postId: this.$route.params.id,
      post: {
        title: "",
        content: "",
      },
    };
  },
  created() {
    // Загрузка существующего поста для редактирования
    axios
      .get(`/api/posts/${this.postId}`)
      .then((response) => {
        this.post = response.data;
      })
      .catch((error) => {
        console.error(error);
      });
  },
  methods: {
    submitForm() {
      axios
        .put(`/api/posts/${this.postId}`, this.post)
        .then((response) => {
          console.log(response.data);
          this.$router.push(`/posts/${this.postId}`);
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
