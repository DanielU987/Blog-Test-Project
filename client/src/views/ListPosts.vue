<template>
  <div class="row">
    <div v-if="loading" class="col-12 text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="posts && posts.length > 0" v-for="post in posts" :key="post.id" class="col-12 mb-3">
      <PostCard :post="post" />
    </div>
    <div v-else class="col-12 text-center">
      <p>No posts available.</p>
    </div>
  </div>
</template>


<script>
import PostCard from "@/components/PostCard.vue"; // Путь к вашему компоненту карточки поста
import { mapGetters } from "vuex";

export default {
  components: {
    PostCard,
  },
  data() {
    return {
      loading: true,
    };
  },
  computed: {
    ...mapGetters("post", ["allPosts"]),
    posts() {
      return this.allPosts;
    },
  },
  created() {
    this.retrievePosts();
  },
  methods: {
    retrievePosts() {
      this.$store
        .dispatch("post/loadPosts")
        .then(() => {
          this.loading = false;
        })
        .catch((error) => {
          console.error("Error occurred while loading posts:", error);
        });
    },
    
  },
};
</script>

<style scoped>
.col-12{
  padding-right: 0;
}
</style>
