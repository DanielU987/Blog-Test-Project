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
                  <router-link v-if="isCurrentUserPostOwner(post)" :to="'/posts/edit/' + post.id" class="btn btn-sm btn-outline-secondary">Edit</router-link>
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
import PostService from "../services/post.service";

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
  methods: {
    retrievePosts() {
      PostService.getAll()
        .then(response => {
          this.posts = response.data;
          this.loading = false;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
          this.loading = false;
        });
    },
    isCurrentUserPostOwner(post) {
      if(this.$store.state.auth.user){
        return post.creator === this.$store.state.auth.user.username;
      }else{
        return false
      }
      
    },
    getPostImage(post) {
      if (post.image && post.image.type === 'Buffer') {
        const bufferData = Buffer.from(post.image.data);
        return `data:image/png;base64, ${bufferData}`;
      }
      return ''; 
    },
  },
};
</script>

<style scoped>
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

.album {
  padding: 15px
}

</style>
