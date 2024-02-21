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
                <form @submit.prevent="addComment" class="flex-grow-1">
                  <div class="input-with-comment">
                    <textarea class="form-control" id="comment" rows="3" v-model="newComment"></textarea>
                    <button type="submit" class="btn btn-primary comment-btn">Отправить</button>
                  </div>
                  <div class="d-flex align-items-center"> <!-- Изменение здесь -->
                    <button @click="toggleLike" class="btn" :class="{ 'btn-primary': !isLiked, 'btn-danger': isLiked }">
                      <font-awesome-icon icon="fa-solid fa-heart" /> {{ post.likes }}
                    </button>
                  </div>
                </form>
              </div>
              <ul class="list-group">
                <li v-for="comment in post.comments" :key="comment.id" class="list-group-item">
                  <div>{{ comment.content }}</div>
                  <div class="text-muted">Автор: {{ comment.user }}</div>
                </li>
              </ul>
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
      loading: true,
      newComment: "",
      isLiked: false,
      isAuthenticated: false,
      isCreator: false,
      postId: null,
      userId: null,

    };
  },
  mounted() {

  },
  created() {
    this.postId = this.$route.params.id;
    this.userId = this.$store.state.auth.user.id;
    this.isAuthenticated = !!this.$store.state.auth.user;

    this.getPost().then(() => {
      
      this.getLikes()
      this.checkIfLiked()
      this.canEditPost()
      this.getComments()
    }).catch(error => {
      console.error('Error loading post:', error);
    });

  },
  methods: {
    getPost() {
      return PostService.get(this.postId, this.userId)
        .then((response) => {
          this.post = response.data;
          this.loading = false;
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
      var data = {
        postId: this.postId,
        userId: this.userId,
        content: this.newComment
      };
      CommentService.create(data)
        .then((response) => {
          console.log(response.data);
          this.newComment = "";
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getComments() {
      CommentService.getCommentsByPostId(this.postId)
        .then(response => {
          this.post.comments = response.data;
          console.log(response.data)
        })
        .catch(error => {
          console.error('Error fetching comments:', error);
        });
    },
    toggleLike() {
      console.log(this.userId)
      if (this.isLiked) {
        LikeService.unlikePost(this.postId, this.userId)
          .then(() => {
            this.isLiked = false;
            this.post.likes--;
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        LikeService.likePost(this.postId, this.userId)
          .then(() => {
            this.isLiked = true;
            this.post.likes++;
          })
          .catch(error => {
            console.error(error);
          });
      }
    },
    canEditPost() {
      return this.isAuthenticated && this.isCreator;
    },
    checkIfLiked() {
      return LikeService.checkIfLiked(this.postId, this.userId)
        .then((res) => {
          this.isLiked = res.data;
        })
        .catch((error) => {
          console.error("Error occurred while checking if liked:", error);
          throw error; // Проброс ошибки, чтобы ее можно было обработать в коде, который вызывает эту функцию
        });
    },
    getLikes() {
      LikeService.countAllLikesForOnePost(this.postId) // Вызываем функцию из сервиса для получения количества лайков для конкретного поста
        .then(likesCount => {
          this.post.likes = likesCount.data["count"];
        })
        .catch(error => {
          console.error("Error occurred while retrieving likes count for the post:", error);
        });
    }
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
