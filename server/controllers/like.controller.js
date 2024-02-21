const { Sequelize } = require("sequelize");
const db = require("../models");
const Post = db.post;
const Like = db.like;

exports.likePost = (req, res) => {
  const PostId = req.params.id;
  const UserId = req.body.userId; // Предполагается, что UserId доступен в запросе
  db.post.findByPk(PostId)
    .then((post) => {
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      db.like.findOrCreate({ where: { PostId: PostId, UserId: UserId } })
        .then(([like, created]) => {
          if (!created) {
            return res.status(400).json({ message: "Post already liked" });
          }
          res.json({ message: "Post liked successfully" });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ message: "Failed to like post" });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Failed to find post" });
    });
};

exports.unlikePost = (req, res) => {
  const PostId = req.params.id;
  const UserId = req.body.userId; // Предполагается, что UserId доступен в запросе

  db.like.destroy({ where: { PostId: PostId, UserId: UserId } })
    .then((numDeleted) => {
      if (numDeleted === 0) {
        return res.status(400).json({ message: "Post not liked by user" });
      }
      res.json({ message: "Post unliked successfully" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Failed to unlike post" });
    });
};

exports.checkIfLiked = (req, res) => {
  const PostId = req.params.id;
  
  const UserId = req.query.userId;

  Like.findOne({ where: { PostId: PostId, UserId: UserId } })
  .then((like) => {
     res.send(!!like) // Возвращаем true, если найден лайк, иначе false
  })
  .catch((err) => {
    console.error(err);
    res.status(500).json({ message: "Error checking if post liked by user" });
  });
}

exports.countAllLikesForAllPosts = (req, res) => {
  Like.findAll({
    attributes: ["PostId", [Sequelize.fn("COUNT", "PostId"), "totalLikes"]],
    group: ["PostId"],
  })
  .then((likes) => {
    const likesMap = likes.reduce((acc, like) => {
      acc[like.PostId] = like.dataValues.totalLikes;
      return acc;
    }, {});
    console.log(likesMap)
    res.send(likesMap);
  })
  .catch((err) => {
    console.error("Failed to retrieve likes:", err);
    res.status(500).send({ message: "Failed to retrieve likes" });
  });
}

exports.countAllLikesForOnePost = (req, res) =>{
  const postId = req.params.id;
  Like.count({ where: { PostId: postId } })
    .then((count) => { 
      res.send({ count });
    })
    .catch(err => {
      console.error("Error counting likes for post:", err);
      res.status(500).send({
        message: "An error occurred while counting likes for the post."
      });
    });
}