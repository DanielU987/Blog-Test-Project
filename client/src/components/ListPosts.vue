<template>
  <div class="container">
    <div class="row">
      <div v-if="loading" class="col-12 text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-else-if="posts" v-for="post in posts" :key="post.id" class="col-12 mb-3">
        <div class="card shadow-sm text-white">
          <div class="card-header bg-dark  d-flex justify-content-between align-items-center py-2 px-3">
            <div>
              <router-link :to="'auth/profile/' + post.Users[0].username" class="nav-link">
                <font-awesome-icon icon="user" />
                <span class="ms-2">{{ post.Users[0].username }}</span>
              </router-link>              
            </div>
            <div class="btn-group">
              <router-link :to="'/posts/' + post.id" class="btn btn-sm btn-outline-light me-1">View</router-link>
              <router-link v-if="isCurrentUserPostOwner(post)" :to="'/posts/edit/' + post.id"
                class="btn btn-sm btn-outline-light">Edit</router-link>
            </div>
          </div>

          <div class="card-body bg-dark  py-3 px-3">
            <h5 class="card-title">
              <router-link :to="'/posts/' + post.id" class="text-white">
                {{ post.title}}
              </router-link></h5>
            <p class="card-text">{{ post.content }}</p>
            <div class="image-container d-flex justify-content-center align-items-center">
              <!--<img class="bd-placeholder-img img-fluid first-image" :src="getPostImage(post)" alt="Post Image" />-->
              <img class="bd-placeholder-img img-fluid second-image" :src="getPostImage(post)" alt="Post Image" />
            </div>

          </div>
          <div class="card-footer bg-dark py-2 px-3">

            <button @click="toggleLike(post.id)" class="btn btn-sm me-1"
              :class="{ 'btn-outline-light': !post.isLiked, 'btn-outline-danger': post.isLiked }">
              <font-awesome-icon icon="fa fa-heart" /> {{ post.Likes.length }}
            </button>
            <router-link :to="'/posts/' + post.id" class="btn btn-sm btn-outline-light me-1">
              <font-awesome-icon icon="fa fa-comment" /> {{ post.Comments.length }}
            </router-link>
          </div>
        </div>
      </div>
      <!-- Показать сообщение, если постов нет -->
      <div v-else class="col-12 text-center">
        <p>No posts available.</p>
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
        .then(() => {
          this.loading = false;
        })
        .catch(error => {
          console.error("Error occurred while loading posts:", error);
        });
    },

    isCurrentUserPostOwner(post) {
      const currentUser = this.$store.state.auth.user;
      if (currentUser && post.Users.length > 0) {
        return post.Users.some(user => user.username === currentUser.username);
      }
      return false;
    },
    getPostImage(post) {
      if (post.image && post.image.type === 'Buffer') {
        const bufferData = Buffer.from(post.image.data);
        return `data:image/png;base64, ${bufferData}`;
      }
      return '';
    },
    getBackgroundImage(post) {
      if (post.image && post.image.type === 'Buffer') {
        const bufferData = Buffer.from(post.image.data);
        return `"data:image/png;base64, ${bufferData}"`;
      }
      return '';
    },

    toggleLike(postId) {
      const post = this.getPostById(postId);
      if (!post) return;
      const likeAction = post.isLiked ? 'unlikePost' : 'likePost';

      this.$store.dispatch(`post/${likeAction}`, postId)
        .catch(error => {
          console.error("Error occurred while toggling like:", error);
        });
    },

  },

};
</script>

<style scoped>
.bg-dark {
  background-color: #111417 !important;
}

.image-container {
  position: relative;
}

.first-image{
  position: absolute;
  width:100%;
  height:100%;
  top: 100%;
}
.image-container img {
  position: relative;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Добавленные стили для мобильных устройств */
@media (max-width: 576px) {
  .card {
    width: 100%;
  }
  .col-12{
    padding-right: 0;
  }
}
</style>
