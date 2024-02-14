<template>
  <div class="container h-100">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="card">
        <div class="rounded-top text-white d-flex flex-row" style="background-color: #000; height: 200px">
          <div class="ms-4 mt-5 d-flex flex-column" style="width: 150px">
            <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="Default Profile Image"
              class="img-fluid img-thumbnail mt-4 mb-2" style="width: 150px; z-index: 1" />

            <button type="button" class="btn btn-outline-danger" data-mdb-ripple-color="dark" @click="deleteUserAndPosts"
              style="z-index: 1">
              Delete profile
            </button>
          </div>
          <div class="ms-3" style="margin-top: 130px" v-if="currentUser">
            <h5>{{ currentUser.username }}</h5>
            <p>{{ currentUser.email }}</p>
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
        <div class="album py-5 bg-light">
          <div class="container">
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
              <div class="col" v-for="post in posts" :key="post.id">
                <div class="card shadow-sm">
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
                        <router-link :to="'/posts/edit/' + post.id"
                          class="btn btn-sm btn-outline-secondary">Edit</router-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import authService from "@/services/auth.service";
import PostService from "../services/post.service";

export default {
  name: "Profile",
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
    
  },
  data() {
    return {
      posts: [],
    };
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    this.retrievePosts();
  },
  methods: {
    retrievePosts() {
      PostService.getAll()
        .then((response) => {
          // Фильтруем посты по создателю
          this.posts = response.data.filter(
            (post) => post.creator === this.currentUser.username
          );
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async deleteUserAndPosts() {
      const userId = this.$store.state.auth.user.id;
      try {
        const result = await authService.deleteUserAndPosts(
          this.currentUser.id
        );
        console.log(result);
      } catch (error) {
        console.error("Error deleting user and posts:", error);
      }
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
.card, .album {
  padding: 0 !important;
}

.image-container {
  position: relative;
  width: 100%;
  height: 225px; /* Высота изображения */
  overflow: hidden;
  background-color: #333; /* Цвет фона */
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Изображение будет сжиматься или растягиваться чтобы полностью заполнить контейнер */
}

</style>
