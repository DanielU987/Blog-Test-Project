<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div v-if="loading" class="text-center">
          <!-- Показать индикатор загрузки, пока данные загружаются -->
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div v-else>
          <div v-if="post" class="card shadow-sm">
            <div class="card-header">
              <font-awesome-icon icon="circle-user" />
              {{ post.creator }}
            </div>
            <img :src="getPostImage(post)" class="card-img-top" alt="Post Image" />
            <div class="card-footer">
              <h2>{{ post.title }}</h2>
              <p>{{ post.content }}</p>
              
              <button v-if="canEditPost" class="btn btn-warning" @click="redirectToEditPage">
                Изменить пост
              </button>
            </div>
          </div>
          <div v-else>
            <p>Пост не найден</p>
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
      post: null,
      canEditPost: false,
      loading: true, // Переменная для отслеживания состояния загрузки данных
    };
  },
  created() {
    const postId = this.$route.params.id;
    let userId = null;

    if (this.$store.state.auth.user && this.$store.state.auth.user.id) {
      userId = this.$store.state.auth.user.id;
    }
    this.getPost(postId, userId);
  },
  methods: {
    getPost(postId, userId) {
      PostService.get(postId, userId)
        .then((response) => {
          this.post = response.data.post;
          this.post.creator = this.$store.state.auth.user.username;
          this.canEditPost = response.data.userPostFound;
          this.loading = false; // Установить loading в false, когда данные загружены
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
          this.loading = false; // Установить loading в false в случае ошибки
        });
    },
    getPostImage(post) {
      if (post.image && post.image.type === "Buffer") {
        const bufferData = Buffer.from(post.image.data);
        return `data:image/png;base64, ${bufferData}`;
      }
      return "";
    },
    redirectToEditPage() {
      const editUrl = "/posts/edit/" + this.post.id;
      this.$router.push(editUrl);
    },
  },
};
</script>

<style scoped>
/* Стили компонента, если необходимо */
</style>
