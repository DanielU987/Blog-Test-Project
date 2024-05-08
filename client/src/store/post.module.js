import PostService from "../services/post.service";
import LikeService from "../services/like.service";

export const post = {
  namespaced: true,
  state: {
    posts: [],
    userId: null,
  },

  actions: {
    async loadPosts({ commit, dispatch }) {
      try {
        const vuexPersistedState = JSON.parse(localStorage.getItem("vuex"));
console.log("Data stored by vuex-persistedstate:", vuexPersistedState);
        const userId = await dispatch("auth/getUserId", null, { root: true });
        if (!userId) {
          const response = await PostService.getAll();
          const posts = response.data;
          commit("setPosts", posts);
          return posts;
        }
  
        commit("setUserId", userId);
        const response = await PostService.getAll();
        const posts = response.data;
        posts.forEach((post) => {
          post.isLiked = post.Likes.some((like) => like.UserId === userId);
          post.Comments.sort((a, b) => a.id - b.id);
        });
        commit("setPosts", posts);
        return posts;
      } catch (error) {
        console.error("Error occurred while loading posts:", error);
        throw error;
      }
    },
    async likePost({ commit, state }, postId) {
      try {
        commit("incrementPostLikes", postId);
        await LikeService.likePost(postId, state.userId);
      } catch (error) {
        console.error("Error occurred while liking post:", error);
        throw error;
      }
    },
    async unlikePost({ commit, state }, postId) {
      try {
        commit("decrementPostLikes", postId);
        await LikeService.unlikePost(postId, state.userId);
      } catch (error) {
        console.error("Error occurred while unliking post:", error);
        throw error;
      }
    },
    async createPost({ commit }, postData) {
      try {
        const response = await PostService.create(postData);
        const createdPost = response.data;
        commit("addPost", createdPost);
        return createdPost;
      } catch (error) {
        console.error("Error occurred while creating post:", error);
        throw error;
      }
    },
    async updatePost({ commit }, postData) {
      try {
        const response = await PostService.update(postData.id, postData);
        const updatedPost = response.data;
        return updatedPost;
      } catch (error) {
        console.error("Error occurred while updating post:", error);
        throw error;
      }
    },
    async deletePost({ commit }, postId) {
      try {
        await PostService.delete(postId);
        commit("removePostById", postId);
      } catch (error) {
        console.error("Error occurred while deleting post:", error);
        throw error;
      }
    },
  },

  getters: {
    allPosts(state) {
      return state.posts;
    },
    getPostById: (state) => (id) => {
      return state.posts.find((post) => post.id === Number(id));
    },
    getPostsByUser: (state) => (username) => {
      return state.posts.filter((post) => post.Users[0].username === username);
    },
    getUserByName: (state) => (username) => {
      const user = state.posts.find(post => post.Users[0].username === username);
      if (user) {
        return {
          username: user.Users[0].username,
          email: user.Users[0].email
        };
      } else {
        return null;
      }
    }
  },

  mutations: {
    setPosts(state, posts) {
      state.posts = posts;
    },
    setUserId(state, userId) {
      state.userId = userId;
    },
    removePostById(state, postId) {
      state.posts = state.posts.filter((post) => post.id !== postId);
    },
    incrementPostLikes(state, postId) {
      const post = state.posts.find((post) => post.id === postId);
      if (post) {
        post.Likes.push({});
        post.isLiked = true;
      }
    },
    decrementPostLikes(state, postId) {
      const post = state.posts.find((post) => post.id === postId);
      if (post) {
        post.Likes.pop();
        post.isLiked = false;
      }
    },
    addPost(state, post) {
      state.posts.push(post); 
    },
  },
};
