<template>
    <div>
      <h2>Создать пост</h2>
      <form @submit.prevent="submitForm">
        <!-- Форма для создания поста -->
        <!-- ... -->
  
        <button type="submit">Создать пост</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        post: {
          title: '',
          content: '',
        },
      };
    },
    methods: {
      submitForm() {
        axios.post('/api/posts', this.post)
          .then(response => {
            console.log(response.data);
            this.$router.push('/posts');
          })
          .catch(error => {
            console.error(error);
          });
      },
    },
  };
  </script>
  