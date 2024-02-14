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
              <button @click="toggleLike" class="btn" :class="{ 'btn-primary': !isLiked, 'btn-danger': isLiked }">
                {{ isLiked ? 'Убрать лайк' : 'Лайк' }}
              </button>
              <form @submit.prevent="addComment">
                <div class="mb-3">
                  <label for="comment" class="form-label">Добавить комментарий</label>
                  <textarea class="form-control" id="comment" rows="3" v-model="newComment"></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Отправить</button>
              </form> 
              
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
import CommentService from "../services/comment.service"
import LikeService from "../services/like.service"
export default {
  data() {
    return {
      post: null,
      canEditPost: false,
      loading: true, // Переменная для отслеживания состояния загрузки данных
      newComment: '',
      isLiked: false, // Переменная для отслеживания состояния лайка
      isAuthenticated: false, // Переменная для проверки аутентификации пользователя
    };
  },
  created() {
    const postId = this.$route.params.id;
    this.isAuthenticated = !!this.$store.state.auth.user; // Проверка аутентификации пользователя
    if (this.isAuthenticated) {
      const userId = this.$store.state.auth.user.id;
      this.getPost(postId, userId);
    } else {
      this.getPost(postId); // Если пользователь не аутентифицирован, получаем только пост без дополнительной информации
    }
  },
  methods: {
    getPost(postId, userId = null) {
      PostService.get(postId, userId)
        .then((response) => {
          this.post = response.data.post;
          if (this.isAuthenticated) {
            this.post.creator = this.$store.state.auth.user.username;
            this.canEditPost = response.data.userPostFound;
            this.isLiked = response.data.userPostFound; // Инициализация состояния лайка
          }
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
    addComment() {
      if (!this.isAuthenticated) {
        // Проверка аутентификации пользователя перед добавлением комментария
        console.log("Пользователь не аутентифицирован");
        return;
      }
      const postId = this.post.id;
      const userId = this.$store.state.auth.user.id;
      
      CommentService.create(postId, userId, this.newComment)
        .then(response => {
          // Обновите список комментариев или как-то еще обработайте успешное добавление комментария
          console.log(response.data);
          // Сбросить поле ввода после добавления комментария
          this.newComment = '';
        })
        .catch(error => {
          console.error(error);
          // Обработка ошибки при добавлении комментария
        });
    },
    toggleLike() {
      if (!this.isAuthenticated) {
        // Проверка аутентификации пользователя перед выполнением действий с лайком
        console.log("Пользователь не аутентифицирован");
        return;
      }
      const postId = this.post.id;
      const userId = this.$store.state.auth.user.id;
      
      if (this.isLiked) {
        // Если пост уже лайкнут, то снимаем лайк
        LikeService.unlike(postId, userId)
          .then(response => {
            // Обновите состояние лайка или как-то еще обработайте успешное удаление лайка
            console.log(response.data);
            this.isLiked = false; // Установить состояние лайка как false после успешного удаления лайка
          })
          .catch(error => {
            console.error(error);
            // Обработка ошибки при удалении лайка
          });
      } else {
        // Если пост еще не лайкнут, то лайкаем
        LikeService.like(postId, userId)
          .then(response => {
            // Обновите состояние лайка или как-то еще обработайте успешное добавление лайка
            console.log(response.data);
            this.isLiked = true; // Установить состояние лайка как true после успешного лайка
          })
          .catch(error => {
            console.error(error);
            // Обработка ошибки при добавлении лайка
          });
      }
    }
  },
};
</script>