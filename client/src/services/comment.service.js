import http from "../http-common";

class CommentService {
  create(postId, userId, content) {
    return http.post("/comments", {
      postId,
      userId,
      content
    });
  }

  getAll(postId) {
    return http.get(`/comments/${postId}`);
  }

  delete(id) {
    return http.delete(`/comments/${id}`);
  }
}

export default new CommentService();