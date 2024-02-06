<template>
  <div>
    <h2>Просмотр поста</h2>
    <div v-if="post">
      <h3>{{ post.title }}</h3>
      <p>{{ post.content }}</p>
      <img :src="getPostImage(post)" class="card-img-top" alt="Post Image" />
      <button
        v-if="canEditPost"
        class="btn btn-warning"
        @click="redirectToEditPage"
      >
        Изменить пост
      </button>
    </div>
    <div v-else>
      <p>Пост не найден</p>
    </div>
  </div>
</template>

<script>
import PostService from "../services/post.service";
export default {
  data() {
    return {
      post: null,
      canEditPost: false,
    };
  },
  created() {
    const postId = this.$route.params.id;

    let userId = null; // Declare userId variable outside the if block

    if (this.$store.state.auth.user && this.$store.state.auth.user.id) {
      userId = this.$store.state.auth.user.id; // Assign value if user id exists
    }
    this.getPost(postId, userId);
  },
  methods: {
    getPost(postId, userId) {
      PostService.get(postId, userId)
        .then((response) => {
          this.post = response.data.post;
          this.canEditPost = response.data.userPostFound;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getPostImage(post) {
      if (post.image && post.image.type === "Buffer") {
        const bufferData = Buffer.from(post.image.data);
        return `data:image/png;base64, ${bufferData}`;
      }
      return ""; // You can provide a default image or handle the case when there is no image
    },
    redirectToEditPage() {
      const editUrl = "/posts/edit/" + this.post.id;
      this.$router.push(editUrl);
    },
  },
};
</script>

<style scoped>
/* Стили компонента, если необходимо */
</style>
