<template>
    <div>
      <h1>Регистрация</h1>
      <form @submit.prevent="registerUser">
        <label for="username">Имя пользователя:</label>
        <input type="text" v-model="registrationData.username" required>
        <br>
        <label for="email">Электронная почта:</label>
        <input type="email" v-model="registrationData.email" required>
        <br>
        <label for="password">Пароль:</label>
        <input type="password" v-model="registrationData.password" required>
        <br>
        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        registrationData: {
          username: '',
          email: '',
          password: '',
        },
      };
    },
    methods: {
      registerUser() {
        // Отправка данных на сервер (используйте axios или другой HTTP-клиент)
        // Пример: axios.post('http://localhost:3000/api/auth/register', this.registrationData)
      },
    },
  };
  </script>
  