<template>
    <div>
      <h2>Редактировать пост</h2>
      <form @submit.prevent="submitForm">
        <!-- Форма для редактирования поста -->
        <!-- ... -->
  
        <button type="submit">Сохранить изменения</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        postId: this.$route.params.id,
        post: {
          title: '',
          content: '',
        },
      };
    },
    created() {
      // Загрузка существующего поста для редактирования
      axios.get(`/api/posts/${this.postId}`)
        .then(response => {
          this.post = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    methods: {
      submitForm() {
        axios.put(`/api/posts/${this.postId}`, this.post)
          .then(response => {
            console.log(response.data);
            this.$router.push(`/posts/${this.postId}`);
          })
          .catch(error => {
            console.error(error);
          });
      },
    },
  };
  </script>
  