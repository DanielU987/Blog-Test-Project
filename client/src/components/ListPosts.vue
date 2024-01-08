<template>
  <div>
    <div class="card col-3" style="width: 18rem;" v-for="post in posts" :key="post.id">
      <img src="#" class="card-img-top" alt="...">
      <div class="card-body">
        <h3>{{ post.title }}</h3>
        <p class="card-text">{{ post.content }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import db from '@/../../server/db';
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
        this.posts = await db.getAllPosts();
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
/* Стили компонента, если необходимо */
</style>
