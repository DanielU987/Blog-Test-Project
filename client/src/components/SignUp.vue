<template>
  <div class="form-placeholder text-center">
    <div class="form-signup">
      <Form @submit="handleRegister" :validation-schema="schema">
        <h1 class="h3 mb-3 fw-normal">Sign up</h1>
        <div v-if="!successful">
          <div class="form-floating mb-3">
            <Field type="username" name="username" class="form-control" id="floatingInput" placeholder="CoolName123" />
            <label for="floatingInput">Username</label>
            <ErrorMessage name="username" class="error-feedback" />
          </div>
          <div class="form-floating mb-3">
            <Field type="email" name="email" class="form-control" id="floatingEmail" placeholder="CoolName123" />
            <label for="floatingEmail">Email</label>
            <ErrorMessage name="email" class="error-feedback" />
          </div>
          <div class="form-floating mb-3">
            <Field type="password" name="password" class="form-control" id="floatingPassword" placeholder="Password" />
            <label for="floatingPassword">Password</label>
            <ErrorMessage name="password" class="error-feedback" />
          </div>

          <div class="form-group">
            <button class="btn btn-primary btn-block" :disabled="loading">
              <span
                v-show="loading"
                class="spinner-border spinner-border-sm"
              ></span>
              Sign Up
            </button>
          </div>
        </div>
      </Form>

      <div
        v-if="message"
        class="alert"
        :class="successful ? 'alert-success' : 'alert-danger'"
      >
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
  name: "Register",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      username: yup
        .string()
        .required("Username is required!")
        .min(3, "Must be at least 3 characters!")
        .max(20, "Must be maximum 20 characters!"),
      email: yup
        .string()
        .required("Email is required!")
        .email("Email is invalid!")
        .max(50, "Must be maximum 50 characters!"),
      password: yup
        .string()
        .required("Password is required!")
        .min(6, "Must be at least 6 characters!")
        .max(40, "Must be maximum 40 characters!"),
    });

    return {
      successful: false,
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
  mounted() {
    if (this.loggedIn) {
      this.$router.push("/profile");
    }
  },
  methods: {
    handleRegister(user) {
      this.message = "";
      this.successful = false;
      this.loading = true;

      this.$store.dispatch("auth/register", user).then(
        (data) => {
          this.message = data.message;
          this.successful = true;
          this.loading = false;
        },
        (error) => {
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          this.successful = false;
          this.loading = false;
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

.form-signup {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}

.form-signup .form-floating:focus-within {
  z-index: 2;
}

.form-signup input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signup input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
