<template>
  <div class="row">
    <div class="card col-3"  v-for="post in posts" :key="post.id">
      <img :src="getPostImage(post)" class="card-img-top img-fluid" style="min-width: 100%; max-width: 100%;" alt="Post Image">
      <div class="card-body">
        <h3>{{ post.title }}</h3>
        <p class="card-text">{{ post.content }}</p>
        <router-link :to="'/posts/' + post.id" class="btn btn-primary">Подробнее</router-link>
      </div>
    </div>
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
    async fetchPosts() {
      try {
        const response = await axios.get('/api/posts'); // Путь к вашему API
        this.posts = response.data;
      } catch (error) {
        console.error(error);
      }
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
