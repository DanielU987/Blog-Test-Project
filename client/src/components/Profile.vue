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

        <div class="row">
          <div v-for="post in posts" :key="post.id" class="col-12 mb-3">
          <PostCard :post="post" />
        </div>
        </div>
    </div>
  </div>

</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import PostCard from "@/views/PostCard.vue"; // Путь к вашему компоненту карточки поста

export default {
  components: {
    PostCard,
  },
  data() {
    return {
      loading: true,
      profile: {
        username: null,
        email: null
      }
    };
  },
  computed: {
    ...mapState({
      currentUser: state => state.auth.user,
      posts: state => state.post.posts
    }),
    ...mapGetters('post', ['allPosts', 'getPostsByUser', 'getUserByName', 'getPostById']),

    posts() {
      return this.getPostsByUser(this.$route.params["username"])
    },
   
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
        });
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
  },
};
</script>


<style scoped>
.image-container {
  position: relative;
}

.col-12{
  padding:0
}

.image-container img {
  position: relative;
}

.card-footer {
  border-color: #373739;
}

.card {
  padding: 0;
  border-color: #373739;
}

.form-control {
  border-color: #373739;
}

.card-header {
  border-color: #373739;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 767px) {
  .row {
    padding-right: 0;
  }
}
</style>