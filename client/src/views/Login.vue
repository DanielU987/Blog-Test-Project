<template>
  <div class="form-placeholder">
    <div class="form-signin">
      <Form @submit="handleLogin" :validation-schema="schema">
        <h1 class="h3 mb-3 fw-normal">Sign in</h1>

        <div class="form-group mb-3">
          <label for="floatingInput">Username</label>
          <Field type="username" name="username" class="form-control" id="floatingInput" />
          
          <small class="form-text text-warning"><ErrorMessage name="username" class="error-feedback" /></small>
        </div>

        <div class="form-group mb-3">
          <label for="floatingPassword">Password</label>
          <Field type="password" name="password" class="form-control" id="floatingPassword"/>
          <small class="form-text text-warning"><ErrorMessage name="password" class="error-feedback" /></small>
        </div>

        <div class="form-group">
          <button class="btn btn-primary btn-block" :disabled="loading">
            <span v-show="loading" class="spinner-border spinner-border-sm"></span>
            <span>Login</span>
          </button>
        </div>

        <div class="form-group">
          <div v-if="message" class="alert alert-danger" role="alert">
            {{ message }}
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
  name: "Login",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      username: yup.string().required("Username is required!"),
      password: yup.string().required("Password is required!"),
    });

    return {
      loading: false,
      message: "",
      schema,
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  methods: {
    handleLogin(user) {
      this.loading = true;

      this.$store.dispatch("auth/login", user).then(
        () => {
          this.$router.push("/auth/profile/" +user.username);
        },
        (error) => {
          this.loading = false;
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },
  },
};
</script>

<style>
html,
body,
#app,
.form-placeholder {
  height: 100%;
}

.form-placeholder {
  display: flex;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}

.form-signin .form-group:focus-within {
  z-index: 2;
}

.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
