<template>
    <div>
      <h1>Вход</h1>
      <form @submit.prevent="loginUser">
        <label for="username">Имя пользователя:</label>
        <input type="text" v-model="loginData.username" required>
        <br>
        <label for="password">Пароль:</label>
        <input type="password" v-model="loginData.password" required>
        <br>
        <button type="submit">Войти</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        loginData: {
          username: '',
          password: '',
        },
      };
    },
    methods: {
      loginUser() {
        // Отправка данных на сервер (используйте axios или другой HTTP-клиент)
        // Пример: axios.post('http://localhost:3000/api/auth/login', this.loginData)
      },
    },
  };
  </script>
  