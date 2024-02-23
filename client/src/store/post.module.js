// post.module.js
import PostService from "../services/post.service";
import LikeService from "../services/like.service";

export const post = {
  namespaced: true,
  state: {
    posts: [],
    userId: null,
  },
  mutations: {
    setPosts(state, posts) {
      state.posts = posts;
    },
    setUserId(state, userId) {
      state.userId = userId;
    },
    updatePostLikes(state, { postId, likes, isLiked }) {
      const postToUpdate = state.posts.find((post) => post.id === postId);
      if (postToUpdate) {
        postToUpdate.likes = likes.data["count"];
        postToUpdate.isLiked = isLiked;
      }
    },
  },
  actions: {
    loadPosts({ commit, dispatch, state }) {
      return new Promise((resolve, reject) => {
        dispatch("auth/getUserId", null, { root: true }) // Dispatch action to get userId from auth module
          .then((userId) => {
            commit("setUserId", userId);
            return PostService.getAll();
          })
          .then((response) => {
            commit("setPosts", response.data);
            return response.data; // Returning posts data
          })
          .then((posts) => {
            // Call service to check if each post is liked by the user
            return LikeService.checkIfLiked(state.userId).then((isLikedMap) => {
              // After checking likes, update each post with isLiked property
              posts.forEach((post) => {
                post.isLiked = isLikedMap.data[post.id] || false;
              });
              return posts; // Resolve with the updated posts
            });
          })
          .then((posts) => {
            // Call service to count likes for all posts
            return LikeService.countAllLikesForAllPosts().then((likesMap) => {
              posts.forEach((post) => {
                post.likes = likesMap.data[post.id] || 0;
              });
              return posts; // Resolve with the updated posts
            });
          })
          .then((posts) => {
            resolve(posts); // Resolve with the updated posts
          })
          .catch((error) => {
            console.error("Error occurred while loading posts:", error);
            reject(error);
          });
      });
    },
    likePost({ commit, state }, postId) {
      return new Promise((resolve, reject) => {
        LikeService.likePost(postId, state.userId)
          .then(() => {
            return LikeService.countAllLikesForOnePost(postId);
          })
          .then((updatedLikes) => {
            commit("updatePostLikes", {
              postId,
              likes: updatedLikes,
              isLiked: true,
            });
            resolve();
          })
          .catch((error) => {
            console.error("Error occurred while liking post:", error);
            reject(error);
          });
      });
    },
    unlikePost({ commit, state }, postId) {
      return new Promise((resolve, reject) => {
        LikeService.unlikePost(postId, state.userId)
          .then(() => {
            return LikeService.countAllLikesForOnePost(postId);
          })
          .then((updatedLikes) => {
            commit("updatePostLikes", {
              postId,
              likes: updatedLikes,
              isLiked: false,
            });
            resolve();
          })
          .catch((error) => {
            console.error("Error occurred while unliking post:", error);
            reject(error);
          });
      });
    },

    checkIfLiked({ commit }, { postId, userId }) {
      return LikeService.checkIfLiked(postId, userId)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error("Error occurred while checking if liked:", error);
          throw error;
        });
    },
  },
  getters: {
    allPosts(state) {
      return state.posts;
    },
    // геттер для получения поста по его id
    getPostById: (state) => (id) => {
      return state.posts.find((post) => post.id === Number(id));
    },
  },
};
