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
  
  countAll() {
    return http.get("/like/count-all"); // Добавлен запрос на получение общего количества лайков
  }

  countOne(postId) {
    return http.get(`/like/count-one/${postId}`); // Добавлен запрос на получение количества лайков для определенного поста
  }
}

export default new LikeService();