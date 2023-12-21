<template>
    <div>
      <h2>{{ post.title }}</h2>
      <p>{{ post.content }}</p>
      <!-- Дополнительная информация о посте -->
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        postId: this.$route.params.id,
        post: {},
      };
    },
    created() {
      // Загрузка информации о посте для просмотра
      axios.get(`/api/posts/${this.postId}`)
        .then(response => {
          this.post = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
  };
  </script>
  