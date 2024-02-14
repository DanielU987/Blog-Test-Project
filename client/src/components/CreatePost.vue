<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8 col-sm-12">
        <div class="submit-form">
          <div class="card shadow-sm">
            <input type="file" id="image" @change="handleImageChange" accept="image/*" class="form-control" />
            <img :src="getPostImage(post)" class="card-img-top" alt="Your image here" />
            <div class="card-footer">
              <div class="mb-3">
                <label for="title" class="form-label">Заголовок:</label>
                <input type="text" id="title" v-model="post.title" required class="form-control" />
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">Содержание:</label>
                <textarea id="content" v-model="post.content" required class="form-control"></textarea>
              </div>
            </div>
            <button class="btn btn-success" @click="savePost">Submit</button>
          </div>
        </div>
      </div>
    </div>
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
    getPostImage(post) {
      if (post.image) {
        if (post.image && post.image.type === "Buffer") {
          const bufferData = Buffer.from(post.image.data);
          return `data:image/png;base64, ${bufferData}`;
        } else {
          return `data:image/png;base64, ${post.image}`;
        }
      } else {
        return "//ssl.gstatic.com/accounts/ui/avatar_2x.png"
      }
    },
  },
};
</script>
