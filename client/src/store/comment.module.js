// comment.module.js
import CommentService from "../services/comment.service";

export const comment = {
  namespaced: true,
  state: {
    comments: [],
    postId: null,
  },
  mutations: {
    addComment(state, comment) {
      state.comments.push(comment);
    },
    setComments(state, comments) {
      state.comments = comments;
    },
    setPostId(state, postId) {
      state.postId = postId;
    },
    removeComment(state, commentId) {
      state.comments = state.comments.filter(
        (comment) => comment.id !== commentId
      );
    },
    
  },
  actions: {
    async createComment({ commit }, { userId, postId, content }) {
      console.log(userId,postId,content)
      try {
        const response = await CommentService.createComment({ userId, postId, content });
        commit("addComment", response.data);
        return response.data;
      } catch (error) {
        console.error("Error creating comment:", error);
        throw error;
      }
    },

    async loadPostComments({ commit }, postId) {
      try {
        const response = await CommentService.getCommentsByPostId(postId);
        commit("setComments", response.data);
        console.log("Comments loaded successfully for post with id:", postId); // Добавляем вывод в консоль

        return response.data;
      } catch (error) {
        console.error("Error loading comments for post:", error);
        throw error;
      }
    },

    async loadAllComments({ commit }) {
      try {
        const response = await CommentService.getAllComments();
        commit("setComments", response.data);
        return response.data;
      } catch (error) {
        console.error("Error loading all comments:", error);
        throw error;
      }
    },

    async deleteComment({ commit }, commentId) {
      try {
        await CommentService.deleteComment(commentId);
        commit("removeComment", commentId);
      } catch (error) {
        console.error("Error deleting comment:", error);
        throw error;
      }
    },
  },
  getters: {
    allComments(state) {
      return state.comments;
    },
  },
};
