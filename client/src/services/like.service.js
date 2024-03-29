import http from "../http-common";

class LikeService {
  likePost(postId, userId) {
    return http.post(`/likes/${postId}`, { userId: userId });
  }

  unlikePost(postId, userId) {
    return http.delete(`/likes/${postId}`, { data: { userId: userId } });
  }

  countAllLikesForAllPosts(){
    return http.get(`/likes/`);
  }

  countAllLikesForOnePost(postId){
    return http.get(`/likes/${postId}`);
  }

  checkIfLiked(userId) {
    return http.get(`/likes/check`, { params: { userId: userId } });
  }
}

export default new LikeService();
