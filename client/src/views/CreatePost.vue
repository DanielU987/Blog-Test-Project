<template>
  <div>
    <h2>Создать пост</h2>
    <form @submit.prevent="submitForm">
      <label for="title">Заголовок:</label>
      <input type="text" id="title" v-model="post.title" required />

      <label for="content">Содержание:</label>
      <textarea id="content" v-model="post.content" required></textarea>
      <button class="btn btn-primary" type="submit">Создать пост</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      post: {
        title: "",
        content: "",
      },
    };
  },
  methods: {
    submitForm() {
      axios
        .post("/api/posts", this.post)
        .then((response) => {
          console.log(response.data);
          this.$router.push("/posts");
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
