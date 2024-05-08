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
          <img :src="getPostImage(post)" class="card-img-top" alt="Your image here" />
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
          <button class="btn btn-danger" @click="remove">
            Delete
          </button>
          <button class="btn btn-success" @click="update">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Compressor from 'compressorjs';
export default {
  data() {
    return {
      postId: this.$route.params.id,
      loading: true
    };
  },
  created() {
    this.loading = false;
  },
  computed: {
    ...mapGetters('post', ['getPostById']),

    post() {
      return this.getPostById(this.$route.params.id);
    }
  },
  methods: {
    ...mapActions("post", ["updatePost", "deletePost"]),

    async update() {
      try {
        if (this.post.image.type === "Buffer") {
        this.post.image = `data:image/png;base64, ${Buffer.from(this.post.image.data)}`.split(",")[1];
      }
        await this.updatePost(this.post);
        this.$router.push("/posts");
      } catch (error) {
        console.error("Error occurred while updating post:", error);
      }
    },
    async remove() {
      try {
        await this.deletePost(this.postId);
        this.$router.push("/posts");
      } catch (error) {
        console.error("Error occurred while deleting post:", error);
      }
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
