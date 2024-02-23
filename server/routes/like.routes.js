module.exports = (app) => {
  const like = require("../controllers/like.controller");

  var router = require("express").Router();

  router.post("/:id", like.likePost);

  router.delete("/:id", like.unlikePost);

  router.get("/check", like.checkIfLiked);

  router.get("/", like.countAllLikesForAllPosts);

  router.get("/:id", like.countAllLikesForOnePost);

  
  app.use("/api/likes", router);
};
