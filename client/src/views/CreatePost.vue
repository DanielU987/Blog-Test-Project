<template>

  <div v-if="loading" class="col-12 text-center">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div class="row justify-content-center">
    <div class="col-md-6 col-sm-12">
      <div class="submit-form">
        <div class="card shadow-sm bg-dark text-white">
          <input type="file" id="image" @change="handleImageChange" accept="image/*" class="form-control" />
          <div v-if="!post.image">
            <img src="../assets/blankImage.jpg" class="card-img-top" alt="Your image here" />
          </div>
          <div v-else>
            <img :src="getPostImage(post)" class="card-img-top" alt="Your image here" />
          </div>
          <div class="card-footer">
            <div class="mb-3">
              <label for="title" class="form-label">Title:</label>
              <input type="text" id="title" v-model="post.title" required class="form-control" />
            </div>
            <div class="mb-3">
              <label for="content" class="form-label">Content:</label>
              <textarea id="content" v-model="post.content" required class="form-control"></textarea>
            </div>
          </div>
          <button class="btn btn-success" @click="savePost">Submit</button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { mapState, mapActions } from "vuex";
import Compressor from 'compressorjs';

export default {
  computed: {
    ...mapState("auth", ["user"]),
  },
  data() {
    return {
      post: {
        title: "",
        content: "",
        image: null,
      },
      loading: true
    };
  },
  mounted() {
    this.loading = false
  },
  methods: {
    ...mapActions("post", ["createPost"]), // Импортируем действие создания поста из хранилища
    savePost() {
      console.log(this.$store.state.auth.status)
      if (!this.$store.state.auth.status) {
        console.log("User not logged in");
        return;
      }
      var data = {
        title: this.post.title,
        content: this.post.content,
        image: this.post.image,
        userId: this.user.id,
      };

      this.createPost(data) // Вызываем действие создания поста
        .then(() => {
          console.log("Post created successfully");
          this.$router.push("/");
        })
        .catch((error) => {
          console.error("Error occurred while creating post:", error);
        });
    },
    handleImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        new Compressor(file, {
          quality: 0.3, // Качество сжатия (от 0 до 1)
          success: (compressedFile) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              this.post.image = e.target.result.split(',')[1];
            };
            reader.readAsDataURL(compressedFile);
          },
          error: (e) => {
            console.log(e.message);
          },
        });
      }
    },
    getPostImage(post) {
      if (post.image && post.image.type === "Buffer") {
        const bufferData = Buffer.from(post.image.data);
        return `data:image/png;base64, ${bufferData}`;
      } else {
        return `data:image/png;base64, ${post.image}`;
      }
    },
  },
};
</script>
