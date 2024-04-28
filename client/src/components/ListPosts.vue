<template>
  <div class="row">
    <div v-if="loading" class="col-12 text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="posts" v-for="post in posts" :key="post.id" class="col-12 mb-3">
      <div class="card text-white col-12">
        <div class="card-header bg-dark d-flex justify-content-between align-items-center py-2 px-3">
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

        <div class="card-body bg-dark py-3 px-3">
          <h5 class="card-title">
            <router-link :to="'/posts/' + post.id" class="text-white">
              {{ post.title }}
            </router-link>
          </h5>
          <p class="card-text">{{ post.content }}</p>
          <div class="image-container d-flex justify-content-center align-items-center">
            <img class="bd-placeholder-img img-fluid second-image" :src="getPostImage(post)" />
          </div>
          <button @click="toggleLike(post.id)" class="btn btn-sm me-1"
            :class="{ 'btn-outline-light': !post.isLiked, 'btn-outline-danger': post.isLiked, }">
            <font-awesome-icon icon="fa fa-heart" /> {{ post.Likes.length }}
          </button>
          <button @click="toggleCommentInput(post.id)" class="btn btn-sm btn-outline-light me-1">
            <font-awesome-icon icon="fa fa-comment" />
            {{ post.Comments.length }}
          </button>
        </div>

        <div class="card-footer bg-dark py-2 px-3">
          <div v-if="post.Comments.length > 0">
            <ul class="list-group">
              <!-- Показывать только первый комментарий, если статус поста showAllComments равен false -->
              <li v-if="!post.showAllComments && post.Comments[0].User" class="list-group-item bg-dark text-white">
                <div class="font-weight-bold">
                  <font-awesome-icon icon="user" />{{ post.Comments[0].User.username }}
                </div>
                <div>{{ post.Comments[0].content }}</div>
              </li>
              <!-- Показывать все комментарии, если статус поста showAllComments равен true -->
              <li v-else v-for="comment in post.Comments" :key="comment.id" class="list-group-item bg-dark text-white">
                <div class="font-weight-bold">
                  <font-awesome-icon icon="user" />{{ comment.User && comment.User.username }}
                </div>
                <div>{{ comment.content }}</div>
              </li>
            </ul>
            <form @submit.prevent="addComment(post.id)" class="flex-grow-1">
              <div class="input-group ">
                <input class="form-control bg-dark text-white" :id="'comment-input-' + post.id"
                  v-model="commentInputs[post.id]" />
                <div class="input-group-append">
                  <button type="submit" class="btn btn-outline-secondary comment-btn"><font-awesome-icon
                      icon="paper-plane" /></button>
                </div>
              </div>
            </form>
            <!-- Кнопка для показа всех комментариев -->
            <button @click="toggleComments(post)" class="btn btn-sm btn-outline-light mt-2">
              {{ post.showAllComments ? 'Скрыть комментарии' : 'Показать все комментарии' }}
            </button>
          </div>
          <form v-else v-if="showCommentForm[post.id]" @submit.prevent="addComment(post.id)" class="flex-grow-1">
            <div class="input-group ">
              <input class="form-control bg-dark text-white" :id="'comment-input-' + post.id"
                v-model="commentInputs[post.id]" />
              <div class="input-group-append">
                <button type="submit" class="btn btn-outline-secondary comment-btn">
                  <font-awesome-icon icon="paper-plane" />
                </button>
              </div>
            </div>
          </form>
        </div>

      </div>
    </div>
    <!-- Показать сообщение, если постов нет -->
    <div v-else class="col-12 text-center">
      <p>No posts available.</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  data() {
    return {
      loading: true,
      commentInputs: {},
      showCommentForm: {},
    };
  },
  computed: {
    ...mapGetters("post", ["allPosts", "getPostById"]),
    posts() {
      return this.allPosts;
    },
    isAuthenticated() {
      return !!this.$store.state.auth.user;
    },
    userId() {
      return this.$store.dispatch("post/loadPosts")
    },
  },
  created() {
    this.retrievePosts();
  },
  methods: {
    ...mapActions("post", [
      "loadPosts",
      "likePost",
      "unlikePost",
      "checkIfLiked",
    ]),
    ...mapActions('comment', ['createComment', 'loadPostComments']),
    ...mapMutations('comment', ['addCommentToPost']),

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
    isCurrentUserPostOwner(post) {
      const currentUser = this.$store.state.auth.user;
      if (currentUser && post.Users.length > 0) {
        return post.Users.some(
          (user) => user.username === currentUser.username
        );
      }
      return false;
    },
    getPostImage(post) {
      if (post.image && post.image.type === "Buffer") {
        const bufferData = Buffer.from(post.image.data);
        return `data:image/png;base64, ${bufferData}`;
      }
      return "";
    },
    getBackgroundImage(post) {
      if (post.image && post.image.type === "Buffer") {
        const bufferData = Buffer.from(post.image.data);
        return `"data:image/png;base64, ${bufferData}"`;
      }
      return "";
    },
    toggleLike(postId) {
      const post = this.getPostById(postId);
      if (!post) return;
      const likeAction = post.isLiked ? "unlikePost" : "likePost";

      this.$store.dispatch(`post/${likeAction}`, postId).catch((error) => {
        console.error("Error occurred while toggling like:", error);
      });
    },
    focusCommentInput(postId) {
      this.$nextTick(() => {
        const input = document.getElementById(`comment-input-${postId}`);
        if (input) {
          input.focus();
        }
      });
    },
    toggleCommentInput(postId) {
      this.showCommentForm[postId] = !this.showCommentForm[postId];
      if (this.showCommentForm[postId]) {
        this.focusCommentInput(postId);
      }
    },
    toggleComments(post) {
      post.showAllComments = !post.showAllComments;
    },
    async addComment(postId) {
      if (!this.isAuthenticated) {
        console.log("Пользователь не аутентифицирован");
        return;
      }
      try {
        await this.createComment({
          postId: postId,
          userId: this.$store.state.auth.user.id,
          content: this.commentInputs[postId]
        });
        console.log('Comment added successfully');

        const post = this.posts.find(post => post.id === postId);

        const cooment = {
          content: this.commentInputs[postId],
          User: {
            username: this.$store.state.auth.user.username
          }
        }

        if (post && post.Comments) {
          post.Comments.push(cooment);
        }
        console.log(post.Comments)
        this.commentInputs[postId] = "";
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    },
  },
};
</script>

<style scoped>
.image-container {
  position: relative;
}

.first-image {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 100%;
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

/* Добавленные стили для мобильных устройств */
@media (max-width: 576px) {
  .card {
    width: 100%;
  }

  .col-12 {
    padding-right: 0;
  }
}
</style>
