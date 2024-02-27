<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div v-if="loading" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div v-else>
          <div v-if="post" class="card shadow-sm">
            <div class="card-header">
              <font-awesome-icon icon="circle-user" />
              {{ post.Users[0].username }}
            </div>
            <img :src="getPostImage(post)" class="card-img-top" alt="Post Image" />
            <div class="card-footer">
              <h2>{{ post.title }}</h2>
              <p>{{ post.content }}</p>
              <div class="d-flex justify-content-between align-items-center">
                <form @submit.prevent="addComment" class="flex-grow-1">
                  <div class="input-with-comment">
                    <textarea class="form-control" id="comment" rows="3" v-model="newComment"></textarea>
                    <button type="submit" class="btn btn-primary comment-btn">Отправить</button>
                  </div>
                </form>
                <div class="d-flex align-items-center">
                  <button @click="toggleLike(post.id)" class="btn" :class="{ 'btn-primary': !isLiked, 'btn-danger': isLiked }">
                    <font-awesome-icon icon="fa-solid fa-heart" /> {{ post.Likes.length }}
                  </button>
                </div>
              </div>
              <ul class="list-group">
                <li v-for="comment in post.Comments" :key="comment.id" class="list-group-item">
                  <div>{{ comment.content }}</div>
                  
                  <div class="text-muted">Автор: {{ comment.User.username }}</div>
                </li>
              </ul>
            </div>
            <button v-if="canEditPost" class="btn btn-warning" @click="redirectToEditPage">
              Изменить пост
            </button>
          </div>
          <div v-else>
            <p>Пост не найден</p>
          </div>
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
      newComment: "",
    };
  },
  computed: {
    ...mapGetters('post', ['getPostById']),
    post() {
      console.log(this.getPostById(this.$route.params.id))
      return this.getPostById(this.$route.params.id);
    },
    isAuthenticated() {
      return !!this.$store.state.auth.user;
    },
    userId() {
      return this.$store.state.auth.user.id;
    },
    isLiked() {
      return this.post ? this.post.isLiked : false;
    },
    canEditPost() {
      const currentUser = this.$store.state.auth.user;
      return currentUser && this.post && this.post.creator === currentUser.username;
    },
  },
  created() {
    this.getPostData();
  },
  methods: {
    ...mapActions('post', ['loadPosts', 'likePost', 'unlikePost']),
    ...mapActions('comment', ['createComment', 'loadAllComments']),
    async getPostData() {
      try {
        await this.loadPosts();
        await this.loadAllComments();
        this.loading = false;
      } catch (error) {
        console.error('Error loading post and comments:', error);
      }
    },
    getPostImage(post) {
      if (post.image && post.image.type === "Buffer") {
        const bufferData = Buffer.from(post.image.data);
        return `data:image/png;base64, ${bufferData}`;
      }
      return "";
    },
    redirectToEditPage() {
      this.$router.push(`/posts/edit/${this.post.id}`);
    },
    async addComment() {
      if (!this.isAuthenticated) {
        console.log("Пользователь не аутентифицирован");
        return;
      }
      try {
        await this.createComment({
          postId: this.post.id,
          userId: this.userId,
          content: this.newComment
        });
        console.log('Comment added successfully');
        this.newComment = "";
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    },
    async toggleLike(postId) {
      try {
        const likeAction = this.post.isLiked ? 'unlikePost' : 'likePost';
        await this.$store.dispatch(`post/${likeAction}`, postId);
        console.log('Like toggled successfully');
      } catch (error) {
        console.error("Error occurred while toggling like:", error);
      }
    },
  },
};
</script>

<style>
.input-with-comment {
  position: relative;
}

.textarea {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.comment-btn {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>