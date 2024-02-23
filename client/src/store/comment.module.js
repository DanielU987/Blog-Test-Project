// comment.module.js
import CommentService from "../services/comment.service";

export const comment = {
  namespaced: true,
  state: {
    comments: [], // Массив комментариев
    postId: null, // Идентификатор текущего поста, для которого отображаются комментарии
  },
  mutations: {
    addComment(state, comment) {
      state.comments.push(comment);
    },

    // Мутация для установки комментариев для конкретного поста в состояние хранилища
    setComments(state, comments) {
      state.comments = comments;
    },
    setPostId(state, postId) {
        state.postId = postId;
      },
    // Мутация для удаления комментария из состояния хранилища
    removeComment(state, commentId) {
      state.comments = state.comments.filter(
        (comment) => comment.id !== commentId
      );
    },
  },
  actions: {
    // Действие для загрузки комментариев по идентификатору поста
    createComment({ commit }, { userId, postId, content }) {
      return CommentService.createComment({ userId, postId, content })
        .then((response) => {
          commit("addComment", response.data);
          return response.data;
        })
        .catch((error) => {
          console.error("Error creating comment:", error);
          throw error;
        });
    },

    // Действие для загрузки всех комментариев для конкретного поста
    loadCommentsForPost({ commit }, postId) {
      return CommentService.getCommentsByPostId(postId)
        .then((response) => {
          commit("setComments", response.data);
          return response.data;
        })
        .catch((error) => {
          console.error("Error loading comments for post:", error);
          throw error;
        });
    },
    loadAllComments({ commit }) {
      // Загрузка всех комментариев
      return CommentService.getAllComments()
        .then((response) => {
          console.log("All comments:", response.data);
          return response.data;
        })
        .catch((error) => {
          console.error("Error loading all comments:", error);
          throw error;
        });
    },
    // Действие для удаления комментария
    deleteComment({ commit }, commentId) {
      return CommentService.deleteComment(commentId)
        .then(() => {
          commit("removeComment", commentId);
        })
        .catch((error) => {
          console.error("Error deleting comment:", error);
          throw error;
        });
    },
  },
  getters: {
    allComments(state) {
      return state.comments;
    },
  },
};
