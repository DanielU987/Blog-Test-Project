<template>
  <div class="submit-form">
    <div class="form-group">
      <label for="title">Заголовок</label>
      <input
        type="text"
        class="form-control"
        id="title"
        required
        v-model="post.title"
        name="title"
      />
    </div>

    <div class="form-group">
      <label for="content">Содержание</label>
      <input
        class="form-control"
        id="content"
        required
        v-model="post.content"
        name="content"
      />
    </div>

    <label for="image">Изображение:</label>
    <input
      type="file"
      id="image"
      accept="image/*"
      @change="handleImageChange"
    />

    <button @click="savePost" class="btn btn-success">Submit</button>
  </div>
</template>

<script>
import PostService from "../services/post.service";
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState("auth", ["loggedIn", "user"]),
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  data() {
    return {
      post: {
        title: "",
        content: "",
        image: null,
      },
    };
  },
  methods: {
    savePost() {
      if (!this.loggedIn) {
        // Пользователь не вошел в систему
        console.log("User not logged in");
        return;
      }

      var data = {
        title: this.post.title,
        content: this.post.content,
        image: this.post.image,

        userId: this.user.id,
      };

      PostService.create(data)
        .then((response) => {
          this.post.id = response.data.id;
          console.log(response.data);
          this.$router.push("/posts/");
        })
        .catch((e) => {
          console.log(e);
        });
    },
    handleImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Data = e.target.result.split(',')[1];
          this.post.image = base64Data;
        };
        reader.readAsDataURL(file);
      }
    },
  },
};
</script>
