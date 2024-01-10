<template>
  <div>
    <h2>Редактировать пост</h2>
    <form @submit.prevent="submitForm">
      <label for="title">Заголовок:</label>
      <input type="text" id="title" v-model="post.title" required />

      <label for="content">Содержание:</label>
      <textarea id="content" v-model="post.content" required></textarea>

      <label for="image">Изображение:</label>
      <input
        type="file"
        id="image"
        @change="handleImageChange"
        accept="image/*"
      />

      <!-- Display the existing image if it exists -->
      <div v-if="post.picture">
        <label>Текущее изображение:</label>
        <img
          :src="getPostImage(post)"
          class="card-img-top"
          alt="Post Image"
          style="max-width: 100%"
        />
      </div>

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
        image: null,
      },
    };
  },
  created() {
    // Load existing post data for editing
    this.loadPost();
  },
  methods: {
    async loadPost() {
      try {
        const response = await axios.get(`/api/posts/${this.postId}`);
        this.post = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async submitForm() {
      const imageBase64 = this.post.image ? this.post.image.split(",")[1]: null;

      try {
        // Use the extracted base64-encoded string directly
        const response = await axios.put(`/api/posts/${this.postId}`, {...this.post,image: imageBase64,
        });
        this.$router.push(`/posts/${this.postId}`);
      } catch (error) {
        console.error(error);
        // Handle errors, provide feedback to the user
      }
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
    getPostImage(post) {
      if (post.picture && post.picture.type === "Buffer") {
        const bufferData = Buffer.from(post.picture.data);
        return `data:${post.picture.type};base64,${bufferData.toString(
          "base64"
        )}`;
      }
      return ""; // You can provide a default image or handle the case when there is no image
    },
  },
};
</script>
