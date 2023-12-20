<template>
    <div>
      <h2>{{ post.title }}</h2>
      <p>{{ post.content }}</p>
      <!-- Дополнительные поля по необходимости -->
  
      <button @click="deletePost">Удалить пост</button>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        post: null,
      };
    },
    mounted() {
      // Получение данных поста для просмотра
      const postId = this.$route.params.id;
      axios.get(`/api/posts/${postId}`)
        .then((response) => {
          this.post = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    methods: {
      deletePost() {
        const postId = this.$route.params.id;
        // Отправка запроса на сервер для удаления поста
        axios.delete(`/api/posts/${postId}`)
          .then(() => {
            console.log('Пост успешно удален');
            // Перенаправление пользователя после удаления поста
            this.$router.push('/posts');
          })
          .catch((error) => {
            console.error('Ошибка при удалении поста', error);
          });
      },
    },
  };
  </script>
  