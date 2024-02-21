import http from "../http-common";

class CommentService {
  create(data) {
    return http.post("/comments", data);
  }

  getAll() {
    return http.get(`/comments/`);
  }

  getCommentsByPostId(postId) {
    return http.get(`/comments/${postId}`);
  }

  delete(id) {
    return http.delete(`/comments/${id}`);
  }
}

export default new CommentService();