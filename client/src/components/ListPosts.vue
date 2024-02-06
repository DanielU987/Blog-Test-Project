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
import PostService from "../services/post.service";


export default {
  data() {
    return {
      posts: [],
    };
  },
  mounted() {
    this.retrievePosts();
  },
  methods: {
    retrievePosts() {
      PostService.getAll()
        .then(response => {
          this.posts = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    refreshList() {
      this.retrievePosts();
    },

    removeAllPosts() {
      PostService.deleteAll()
        .then(response => {
          console.log(response.data);
          this.refreshList();
        })
        .catch(e => {
          console.log(e);
        });
    },
    
    getPostImage(post) {
      if (post.image && post.image.type === 'Buffer') {
        const bufferData = Buffer.from(post.image.data);
        return `data:image/png;base64, ${bufferData}`;
      }
      return ''; // You can provide a default image or handle the case when there is no image
    },
  },
};
</script>

<style scoped>
/* Стили компонента, если необходимо */
</style>
