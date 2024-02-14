import http from "../http-common";

class LikeService {
  like(postId, userId) {
    return http.post("/likes", {
      postId,
      userId
    });
  }

  unlike(id) {
    return http.delete(`/likes/${id}`);
  }
}

export default new LikeService();