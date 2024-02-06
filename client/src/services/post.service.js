import http from "../http-common";

class PostService {
  getAll() {
    return http.get("/posts");
  }

  get(id, userId) {
    return http.get(`/posts/${id}`, { params: { userId:userId } });
  }

  create(data) {
    return http.post("/posts/create", data);
  }

  update(id, data) {
    return http.put(`/posts/edit/${id}`, data);
  }

  delete(id) {
    return http.delete(`/posts/${id}`);
  }

  deleteAll() {
    return http.delete(`/posts`);
  }

  findByTitle(title) {
    return http.get(`/posts?title=${title}`);
  }
}

export default new PostService();
