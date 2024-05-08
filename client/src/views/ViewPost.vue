<template>

  <div class="row justify-content-center">
    <div class="col-md-10">
      <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-else-if="post">
        <PostCard :post="post" />
      </div>
    </div>
  </div>

</template>

<script>
import PostCard from "@/components/PostCard.vue"; // Путь к вашему компоненту карточки поста

import { mapGetters } from 'vuex';

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
    ...mapGetters('post', ['getPostById', 'allPosts']),
    currentUser() {
      return this.$store.state.auth.user;
    },
    post() {
      return this.getPostById(this.$route.params.id);
    },
  },
  created() {
    console.log(this.allPosts); // Выведет все посты из хранилища
    this.loading = false; // Можно установить loading в false здесь, так как данные уже доступны из геттера
  },
};
</script>
<style scoped>
.image-container img {
  max-width: 100%;
  display: block;
  margin: 0 auto;
  width: 100%;
  max-height: unset !important;
}
</style>