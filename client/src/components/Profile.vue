<template>
  <div class="container h-100">
    <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="rounded-top text-white d-flex flex-row" style="background-color: #000; height: 200px">
          <div class="ms-4 mt-5 d-flex flex-column" style="width: 150px">
            <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="Default Profile Image"
              class="img-fluid img-thumbnail mt-4 mb-2" style="width: 150px; z-index: 1" />

            <button type="button" class="btn btn-outline-danger" data-mdb-ripple-color="dark" @click="deleteUserAndPosts"
              style="z-index: 1">
              Delete profile
            </button>
          </div>
          <div class="ms-3" style="margin-top: 130px" v-if="this.profile">
            <h5>{{ this.profile.username }}</h5>
            <p>{{ this.profile.email }}</p>
          </div>
        </div>
        <div class="p-4 text-black" style="background-color: #f8f9fa">
          <div class="d-flex justify-content-end text-center py-1">
            <div>
              <p class="mb-1 h5">253</p>
              <p class="small text-muted mb-0">Photos</p>
            </div>
            <div class="px-3">
              <p class="mb-1 h5">1026</p>
              <p class="small text-muted mb-0">Followers</p>
            </div>
            <div>
              <p class="mb-1 h5">478</p>
              <p class="small text-muted mb-0">Following</p>
            </div>
          </div>
        </div>
          <div class="container">
            <div class="row">
              <div v-for="post in posts" :key="post.id" class="col-12 mb-3">
                <div class="card shadow-sm text-white bg-dark">
                  <div class="card-header d-flex justify-content-between align-items-center py-2 px-3">
                    <div>
                      <router-link :to="'/auth/profile/' + post.Users[0].username" class="nav-link">
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

                  <div class="card-body py-3 px-3">
                    <h5 class="card-title">
                      <router-link :to="'/posts/' + post.id" class="text-white">
                        {{ post.title }}
                      </router-link>
                    </h5>
                    <p class="card-text">{{ post.content }}</p>
                    <div class="image-container d-flex justify-content-center align-items-center">
                      <img class="bd-placeholder-img img-fluid" :src="getPostImage(post)" alt="Post Image" />
                    </div>
                  </div>
                  <div class="card-footer py-2 px-3">
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
            </div>
        </div>
      </div>
    </div>
 
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      loading: true,
      profile: {
        username: null,
        email: null
      }
    };
  },
  name: "Profile",
  computed: {
    ...mapState({
      currentUser: state => state.auth.user,
      posts: state => state.post.posts

    }),
    
    ...mapGetters('post', ['allPosts', 'getPostsByUser', 'getUserByName']),

    posts() {
      return this.getPostsByUser(this.$route.params["username"])
    }

    

  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    } else {
      this.$store.dispatch('post/loadPosts')
      .then(() => {
          // Загружаем посты пользователя с определенным именем при успешной загрузке всех постов
          this.profile = this.getUserByName(this.$route.params.username);
          this.loading = false;
        })
        .catch(error => {
          console.error("Error loading posts:", error);
          this.loading = false;
        });
      this.loading = false;

    }
  },
  methods: {
    ...mapActions('post', ['loadPosts', 'likePost', 'unlikePost']),
    deleteUserAndPosts() {
      const userId = this.currentUser.id;
      try {
        // Call the action to delete user and posts
      } catch (error) {
        console.error("Error deleting user and posts:", error);
      }
    },
    isCurrentUserPostOwner(post) {
      const currentUser = this.$store.state.auth.user;
      if (currentUser && post.Users.length > 0) {
        return post.Users.some(user => user.username === currentUser.username);
      }
      return false;
    },
    getPostImage(post) {
      if (post.image && post.image.type === "Buffer") {
        const bufferData = Buffer.from(post.image.data);
        return `data:image/png;base64, ${bufferData}`;
      }
      return ""; // You can provide a default image or handle the case when there is no image
    },
  },
};
</script>


<style scoped>

.image-container {
  position: relative;
}

.image-container img {
  width: 100%;
  height: auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.card {
  margin-bottom: 20px;
}
</style>