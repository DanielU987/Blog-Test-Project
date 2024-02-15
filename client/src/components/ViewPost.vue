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
              <div class="d-flex justify-content-between align-items-center">
                <!-- Кнопка лайка -->
                <button @click="toggleLike" class="btn" :class="{ 'btn-primary': !isLiked, 'btn-danger': isLiked }">
                  <font-awesome-icon icon="fa-solid fa-heart" /> {{ likeCount }}
                </button>
                <!-- Форма добавления комментария -->
                <form @submit.prevent="addComment" class="flex-grow-1">
                  <div class="mb-3">
                    <label for="comment" class="form-label">Добавить комментарий</label>
                    <textarea class="form-control" id="comment" rows="3" v-model="newComment"></textarea>
                  </div>
                  <button type="submit" class="btn btn-primary">Отправить</button>
                </form>
              </div>
            </div>
            <button v-if="canEditPost" class="btn btn-warning" @click="redirectToEditPage">
              Изменить пост
            </button>
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
import CommentService from "../services/comment.service";
import LikeService from "../services/like.service";

export default {
  data() {
    return {
      post: null,
      canEditPost: false,
      loading: true,
      newComment: "",
      isLiked: false,
      isAuthenticated: false,
      likeCount: 0 // Добавим переменную для отображения общего количества лайков
    };
  },
  created() {
    const postId = this.$route.params.id;
    this.isAuthenticated = !!this.$store.state.auth.user;
    if (this.isAuthenticated) {
      const userId = this.$store.state.auth.user.id;
      this.getPost(postId, userId);
       // Получим количество лайков для этого поста
    } else {
      this.getPost(postId);
    }
    this.getLikeCountForPost(postId);
  },
  methods: {
    getPost(postId, userId = null) {
      PostService.get(postId, userId)
        .then((response) => {
          this.post = response.data;
          if (this.isAuthenticated) {
            this.post.creator = this.$store.state.auth.user.username;
            this.canEditPost = response.data.userPostFound;
            this.isLiked = response.data.userPostFound;
          }
          this.loading = false;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
          this.loading = false;
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
    addComment() {
      if (!this.isAuthenticated) {
        console.log("Пользователь не аутентифицирован");
        return;
      }
      const postId = this.post.id;
      const userId = this.$store.state.auth.user.id;
      CommentService.create(postId, userId, this.newComment)
        .then((response) => {
          console.log(response.data);
          this.newComment = "";
        })
        .catch((error) => {
          console.error(error);
        });
    },
    toggleLike() {
      if (!this.isAuthenticated) {
        console.log("Пользователь не аутентифицирован");
        return;
      }
      const postId = this.post.id;
      const userId = this.$store.state.auth.user.id;

      if (this.isLiked) {
        LikeService.unlike(postId, userId)
          .then((response) => {
            console.log(response.data);
            this.isLiked = false;
            this.getLikeCountForPost(postId); // Обновим количество лайков после отмены лайка
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        LikeService.like(postId, userId)
          .then((response) => {
            console.log(response.data);
            this.isLiked = true;
            this.getLikeCountForPost(postId); // Обновим количество лайков после постановки лайка
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    getLikeCountForPost(postId) {
      LikeService.countOne(postId)
        .then((response) => {
          this.likeCount = response.data.likeCount;
        })
        .catch((error) => {
          console.error(error);
        });
    }
  },
};
</script>

<style>
/* Ваши стили */
</style>
