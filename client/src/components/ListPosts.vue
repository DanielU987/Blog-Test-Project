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
        <div v-else-if="posts" v-for="post in posts" :key="post.id" class="col">
          <div class="card shadow-sm">
            <div class="card-header">
              <font-awesome-icon icon="circle-user" />
              {{ post.Users[0].username }}
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
                
                <button class="btn btn-sm btn-outline-secondary" disabled>
                  <font-awesome-icon icon="fa fa-comment"/> {{ post.Comments.length }}
                </button>
                <button @click="toggleLike(post.id)" class="btn btn-sm"
                  :class="{ 'btn-primary': !post.isLiked, 'btn-danger': post.isLiked }">                  
                  <font-awesome-icon icon="fa-solid fa-heart" /> {{ post.Likes.length }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Показать сообщение, если постов нет -->
        <div v-else class="col text-center">
          <p>No posts available.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      loading: true,
    };
  },
  computed: {
    ...mapGetters('post', ['allPosts', 'getPostById']),
    posts() {
      return this.allPosts;
    }
  },
  created() {
    this.retrievePosts();
  },
  methods: {
    ...mapActions('post', ['loadPosts', 'likePost', 'unlikePost', 'checkIfLiked']),
    retrievePosts() {
      this.$store.dispatch('post/loadPosts')
        .then((response) => {
          console.log(response)
          this.loading = false;
        })
        .catch(error => {
          console.error("Error occurred while loading posts:", error);
        });
    },
    isCurrentUserPostOwner(post) {
      const currentUser = this.$store.state.auth.user;
      return currentUser && post.creator === currentUser.username;
    },
    getPostImage(post) {
      if (post.image && post.image.type === 'Buffer') {
        const bufferData = Buffer.from(post.image.data);
        return `data:image/png;base64, ${bufferData}`;
      }
      return '';
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
