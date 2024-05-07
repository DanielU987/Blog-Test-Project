<template>

  <div v-if="loading" class="col-12 text-center">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div v-else>



    <div class="rounded-top text-black d-flex align-items-center mpx-2" style="background-color: white; position: relative;">
      <!-- Left column for image and delete button -->
      <div class="d-flex flex-column align-items-center ml-2" style="width: 150px">
        <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="Default Profile Image"
          class="img-fluid img-thumbnail mt-4 mb-2" style="width: 150px; z-index: 1" />
      </div>

      <!-- Right column for profile information -->
      <div class="ms-3">
        <h5>{{ this.profile.username }}</h5>
        <p>{{ this.profile.email }}</p>
      </div>

      <!-- Dropdown button and menu -->
      <div class="position-absolute top-0 end-0">
        <div class="dropdown mr-1 mt-1">
          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
            data-bs-toggle="dropdown" aria-expanded="false">
            Actions
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
            <li><a class="dropdown-item" href="#" @click="deleteUserAndPosts">Delete Profile</a></li>
            <!-- Add more dropdown items as needed -->
          </ul>
        </div>
      </div>
    </div>
    <div class="row">
      <div v-for="post in posts" :key="post.id" class="col-12 mb-3">
        <PostCard :post="post" />
      </div>
    </div>
  </div>

</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import PostCard from "@/components/PostCard.vue"; // Путь к вашему компоненту карточки поста

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



.image-container img {
  position: relative;
}

.card-footer {
  border-color: #373739;
}

.card {
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