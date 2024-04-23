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
          // Сортировка комментариев по их ID в порядке возрастания
          post.Comments.sort((a, b) => a.id - b.id);
        });
        console.log(posts);
        commit("setPosts", posts);
        return posts;
      } catch (error) {
        console.error("Error occurred while loading posts:", error);
        throw error;
      }
    },
    async likePost({ commit, state }, postId) {
      try {
        await LikeService.likePost(postId, state.userId);
        commit("incrementPostLikes", postId);
      } catch (error) {
        console.error("Error occurred while liking post:", error);
        throw error;
      }
    },
    async unlikePost({ commit, state }, postId) {
      try {
        await LikeService.unlikePost(postId, state.userId);
        commit("decrementPostLikes", postId);
      } catch (error) {
        console.error("Error occurred while unliking post:", error);
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
  },
};
