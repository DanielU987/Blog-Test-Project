<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <!-- Выводим индикатор загрузки, если данные загружаются -->
        <div v-if="loading" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <!-- Если данные загружены, выводим содержимое -->
        <div v-else>
          <div v-if="post" class="card shadow-sm">
            <!-- Выводим информацию о посте -->
            <div class="card-header">
              <font-awesome-icon icon="circle-user" />
              {{ post.creator }}
            </div>
            <img :src="getPostImage(post)" class="card-img-top" alt="Post Image" />
            <div class="card-footer">
              <h2>{{ post.title }}</h2>
              <p>{{ post.content }}</p>
              <div class="d-flex justify-content-between align-items-center">
                <!-- Форма для добавления комментария -->
                <form @submit.prevent="addComment" class="flex-grow-1">
                  <div class="input-with-comment">
                    <textarea class="form-control" id="comment" rows="3" v-model="newComment"></textarea>
                    <button type="submit" class="btn btn-primary comment-btn">Отправить</button>
                  </div>
                </form>
                <!-- Кнопка для лайка поста -->
                <div class="d-flex align-items-center">
                  <button @click="toggleLike(post.id)" class="btn" :class="{ 'btn-primary': !isLiked, 'btn-danger': isLiked }">
                    <font-awesome-icon icon="fa-solid fa-heart" /> {{ post.likes }}
                  </button>
                </div>
              </div>
              <!-- Выводим комментарии -->
              <ul class="list-group">
                <li v-for="comment in post.comments" :key="comment.id" class="list-group-item">
                  <div>{{ comment.content }}</div>
                  <div class="text-muted">Автор: {{ comment.user }}</div>
                </li>
              </ul>
            </div>
            <!-- Кнопка для редактирования поста -->
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
import { mapGetters, mapActions } from 'vuex';
import CommentService from '../services/comment.service';

export default {
  data() {
    return {
      loading: true,
      newComment: "",
    };
  },
  computed: {
    ...mapGetters('post', ['getPostById']),
    post() {
      return this.getPostById(this.$route.params.id);
    },
    isAuthenticated() {
      return !!this.$store.state.auth.user;
    },
    userId() {
      return this.$store.state.auth.user.id;
    },
    isLiked() {
      const post = this.post;
      return post ? post.isLiked : false;
    },
    canEditPost() {
      const currentUser = this.$store.state.auth.user;
      return currentUser && this.post && this.post.creator === currentUser.username;
    },
  },
  created() {
    this.getPost().then(() => {
      this.loading = false;
      this.getComments(); // Загрузка комментариев при загрузке поста
    }).catch(error => {
      console.error('Error loading post:', error);
    });
  },
  methods: {
    ...mapActions('post', ['loadPosts', 'likePost', 'unlikePost']),
    ...mapActions('comment', ['createComment', 'loadCommentsForPost', 'loadAllComments']),
    getPost() {
      return this.loadPosts();
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
      const data = {
        postId: this.post.id, // Используйте this.post.id вместо this.postId
        userId: this.userId,
        content: this.newComment
      };
      this.createComment(data) // Используйте действие из модуля комментариев
        .then(() => {
          console.log('Comment added successfully');
          this.newComment = ""; // Сбросить поле ввода после добавления комментария
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getComments() {
      // Загрузка комментариев для текущего поста
      console.log(this.post.id)
      this.loadAllComments()
        .then((comments) => {
          console.log('Comments:', comments);
          console.log('Comments loaded successfully');
        })
        .catch(error => {
          console.error('Error loading comments:', error);
        });
    },
    toggleLike(postId) {
      const post = this.getPostById(postId);
      if (!post) return;

      const likeAction = post.isLiked ? 'unlikePost' : 'likePost';
      this.$store.dispatch(`post/${likeAction}`, postId)
        .then(() => {
          console.log('Like toggled successfully');
        })
        .catch(error => {
          console.error("Error occurred while toggling like:", error);
        });
    },
  },
};
</script>

<style>
.input-with-comment {
  position: relative;
}

.textarea {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.comment-btn {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
