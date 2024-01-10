<template>
  <div>
    <h2>Создать пост</h2>
    <form @submit.prevent="submitForm">
      <!-- Добавьте поле для выбора файла -->
      <label for="image">Изображение:</label>
      <input type="file" id="image" accept="image/*" @change="handleImageChange" required />

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
        image: null, // Добавьте поле для хранения выбранного изображения
      },
    };
  },
  methods: {
    submitForm() {
      // Преобразуйте изображение в строку base64 перед отправкой на сервер
      const imageBase64 = this.post.image ? this.post.image.split(',')[1] : null;
      console.log("coc3"+imageBase64)
      axios
        .post("/api/posts", { ...this.post, image: imageBase64 })
        .then((response) => {
          console.log(response.data);
          this.$router.push("/posts");
        })
        .catch((error) => {
          console.error(error);
        });
    },
    handleImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.post.image = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
  },
};
</script>
