<template>
    <form @submit="submitForm">
      <div>
        <label for="title">Заголовок:</label>
        <input type="text" id="title" v-model="post.title" required />
      </div>
      <div>
        <label for="content">Содержание:</label>
        <textarea id="content" v-model="post.content" required></textarea>
      </div>
      <div>
        <button type="submit">Сохранить</button>
      </div>
    </form>
  </template>
  
  <script>
  import axios from 'axios';
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
        // Отправка данных на сервер для создания или редактирования поста
        axios
          .post("/api/posts", this.post)
          .then((response) => {
            // Обработка успешного ответа от сервера
            console.log(response.data);
            this.$router.push('/posts'); 
          })
          .catch((error) => {
            // Обработка ошибки
            console.error(error);
          });
      },
    },
  };
  </script>
  