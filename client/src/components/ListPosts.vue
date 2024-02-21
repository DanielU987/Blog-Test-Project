<template>
  <div class="album py-5 bg-light">
    <div class="container">
      <div class="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-xl-3 g-3">
        <!-- Показывать загрузку, пока данные загружаются -->
        <div v-if="loading" class="col text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <!-- Показывать посты, когда данные загрузились -->
        <div v-else v-for="post in posts" :key="post.id" class="col">
          <div class="card shadow-sm">
            <div class="card-header">
              <font-awesome-icon icon="circle-user" />
              {{ post.creator }}

            </div>
            <div class="image-container">
              <img class="bd-placeholder-img card-img-top" :src="getPostImage(post)" alt="Post Image" />
            </div>
            <div class="card-body">
              <h5>
                <router-link :to="'/posts/' + post.id" class="text-dark">{{ post.title }}</router-link>
              </h5>
              <p class="card-text">{{ post.content }}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <router-link :to="'/posts/' + post.id" class="btn btn-sm btn-outline-secondary">View</router-link>
                  <router-link v-if="isCurrentUserPostOwner(post)" :to="'/posts/edit/' + post.id"
                    class="btn btn-sm btn-outline-secondary">Edit</router-link>
                </div>
                <!-- Добавляем кнопку для лайков -->
                <button @click="toggleLike(post.id)" class="btn btn-sm"
                  :class="{ 'btn-primary': !isLiked(post.id), 'btn-danger': isLiked(post.id) }">
                  <font-awesome-icon icon="fa-solid fa-heart" /> {{ post.likes }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PostService from "../services/post.service";
import LikeService from "../services/like.service"; // Импортируем сервис для работы с лайками

export default {
  data() {
    return {
      posts: [],
      loading: true,
    };

  },
  mounted() {
    this.retrievePosts();
  },
  created() {
    this.postId = this.$route.params.id;
    this.userId = this.$store.state.auth.user.id;
  },
  methods: {
    retrievePosts() {
      PostService.getAll()
        .then(response => {
          this.posts = response.data;
          this.loading = false;
          // Вызываем функцию для получения количества лайков для каждого поста
          this.countAllLikes();
        })
        .catch(e => {
          console.log(e);
          this.loading = false;
        });
    },
    countAllLikes() {
      LikeService.countAllLikes() // Вызываем функцию из сервиса для получения количества лайков для каждого поста
        .then(likesMap => {
          console.log(likesMap)
          this.posts.forEach(post => {
            const postId = parseInt(post.id); // Преобразуем строку в число
            post.likes = likesMap.data[postId] || 0;
            console.log(likesMap.data[postId])
          });
        })
        .catch(error => {
          console.error("Error occurred while retrieving likes count for posts:", error);
        });
    },
    isCurrentUserPostOwner(post) {
      if (this.$store.state.auth.user) {
        return post.creator === this.$store.state.auth.user.username;
      } else {
        return false;
      }
    },
    getPostImage(post) {
      if (post.image && post.image.type === 'Buffer') {
        const bufferData = Buffer.from(post.image.data);
        return `data:image/png;base64, ${bufferData}`;
      }
      return '';
    },
    // Функция для определения, лайкнул ли текущий пользователь пост или нет
    isLiked(postId) {
      return LikeService.checkIfLiked(postId, this.userId)
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          console.error("Error occurred while checking if liked:", error);
          throw error; // Проброс ошибки, чтобы ее можно было обработать в коде, который вызывает эту функцию
        });
    },
    // Функция для добавления или удаления лайка для поста
    toggleLike(postId) {
      let postToUpdate = this.posts.find(post => post.id === postId);
      console.log(postToUpdate)
      if (!postToUpdate) return; // Пост не найден, выходим из функции

      this.isLiked(postId)
        .then((liked) => {
          if (liked) {
            return LikeService.unlikePost(postId, this.userId);
          } else {
            return LikeService.likePost(postId, this.userId);
          }
        })
        .then(() => {
          postToUpdate.likes += postToUpdate.isLiked ? -1 : 1;
          postToUpdate.isLiked = !postToUpdate.isLiked;
        })
        .catch(error => {
          console.error(error);
        });
    },
  },
};
</script>

<style scoped>
.image-container {
  position: relative;
  width: 100%;
  height: 225px;
  /* Высота изображения */
  overflow: hidden;
  background-color: #333;
  /* Цвет фона */
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Изображение будет сжиматься или растягиваться чтобы полностью заполнить контейнер */
}

.album {
  padding: 15px
}
</style>
