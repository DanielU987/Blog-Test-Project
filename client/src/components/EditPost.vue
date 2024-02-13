<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8 col-sm-12">
        <div v-if="loading" class="text-center">
          <!-- Показать индикатор загрузки, пока данные загружаются -->
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div v-else>
          <div v-if="post" class="card shadow-sm">
            <input type="file" id="image" @change="handleImageChange" accept="image/*" class="form-control mb-3"
              :value="post.image ? null : ''" />
            <img :src="getPostImage(post)" class="card-img-top" alt="Post Image" />
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
            <button class="btn btn-danger" @click="deletePost">
              Удалить пост
            </button>
            <button class="btn btn-success" @click="updatePost">
              Сохранить изменения
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import PostService from "../services/post.service";

export default {
  data() {
    return {
      postId: this.$route.params.id,
      post: {
        title: "",
        content: "",
        image: null,
      },
      loading: true
    };
  },
  created() {
    // Load existing post data for editing
    const postId = this.$route.params.id;
    const userId = this.$store.state.auth.user.id;
    this.getPost(postId, userId);
  },
  methods: {
    getPost(postId, userId) {
      PostService.get(postId, userId)
        .then((response) => {
          if (!response.data.userPostFound) {
            // Если пользователь не является владельцем поста, перенаправляем его
            this.$router.push("/");
            return;
          }
          this.post = response.data.post;
          this.loading = false;
          console.log(response.data);
        })
        .catch((e) => {
          this.loading = false;
          console.log(e);
        });
    },
    updatePost() {
      if (this.post.image.type === "Buffer") {
        this.post.image = `data:image/png;base64, ${Buffer.from(this.post.image.data)}`.split(",")[1];
      }
      PostService.update(this.post.id, this.post)
        .then((response) => {
          console.log(response.data);
          this.$router.push("/posts/");
          this.message = "The post was updated successfully!";
        })
        .catch((e) => {
          console.log(e);
        });
    },
    deletePost() {
      PostService.delete(this.post.id)
        .then((response) => {
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
          const base64Data = e.target.result.split(",")[1];
          this.post.image = base64Data;
          console.log("this.handleImageChange",this.post.image)
        };
        reader.readAsDataURL(file);
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
