<template>
  <div>
    <h2>Редактировать пост</h2>
    <form @submit.prevent="submitForm">
      <label for="title">Заголовок:</label>
      <input type="text" id="title" v-model="post.title" required />

      <label for="content">Содержание:</label>
      <textarea id="content" v-model="post.content" required></textarea>

      <label for="image">Изображение:</label>
      <input
        type="file"
        id="image"
        @change="handleImageChange"
        accept="image/*"
      />

      <!-- Display the existing image if it exists -->
      <div v-if="post.image">
        <label>Текущее изображение:</label>
        <img
          :src="getPostImage(post)"
          v-on="post.image"
          class="card-img-top"
          alt="Post Image"
          style="max-width: 100%"
        />
      </div>
      <button class="btn btn-danger" @click="deletePost" >
        Удалить пост
      </button>
      <button class="btn btn-success" @click="updatePost">Сохранить изменения</button>
    </form>
  </div>
</template>

<script>
import PostService from '../services/post.service';

export default {
  data() {
    return {
      postId: this.$route.params.id,
      post: {
        title: "",
        content: "",
        image: null,
      },
    };
  },
  created() {
    // Load existing post data for editing
    const postId = this.$route.params.id;
    const userId = this.$store.state.auth.user.id;
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
    updatePost() {
      PostService.update(this.post.id, this.post, )
        .then(response => {
          console.log(response.data);
          this.$router.push("/posts/");
          this.message = 'The post was updated successfully!';
        })
        .catch(e => {
          console.log(e);
        });
    },
    deletePost() {
      PostService.delete(this.post.id)
        .then(response => {
          console.log(response.data);
          this.$router.push("/posts/");
        })
        .catch(e => {
          console.log(e);
        });
    },
    handleImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Data = e.target.result.split(',')[1];
          this.post.image = base64Data;
        };
        reader.readAsDataURL(file);
      }
    },
    getPostImage(post) {
      if (post.image && post.image.type === "Buffer") {
        const bufferData = Buffer.from(post.image.data);
        return `data:image/png;base64, ${bufferData}`;
      }
      else{
        return `data:image/png;base64, ${post.image}`;
      }
    },
  },
};
</script>
