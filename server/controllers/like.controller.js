// controllers/postLike.js
const db = require("../models");
const User = db.user
const Post = db.post
const Like = db.like
exports.likePost = (req, res) => {
  const userId = req.body.userId;
  const postId = req.body.postId;

  // Проверяем, существует ли пользователь и пост
 User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
     Post.findByPk(postId)
        .then((post) => {
          if (!post) {
            return res.status(404).send({ message: "Post Not found." });
          }

          // Проверяем, не поставил ли пользователь уже лайк
          Like.findOne({
            where: {
              UserId: userId,
              PostId: postId,
            },
          })
            .then((existingLike) => {
              if (existingLike) {
                // Если лайк уже существует, удаляем его
                existingLike
                  .destroy()
                  .then(() => {
                    res.json({ message: "Post unliked successfully" });
                  })
                  .catch((error) => {
                    console.error(error);
                    res.status(500).json({ message: "Failed to unlike post" });
                  });
              } else {
                // Создаем лайк
                Like.create({
                  UserId: userId,
                  PostId: postId,
                })
                  .then((like) => {
                    res.json(like);
                  })
                  .catch((error) => {
                    console.error(error);
                    res.status(500).json({ message: "Failed to like post" });
                  });
              }
            })
            .catch((error) => {
              console.error(error);
              res.status(500).json({ message: "Failed to find existing like" });
            });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ message: "Failed to find post" });
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Failed to find user" });
    });
};

exports.unlikePost = (req, res) => {
  const userId = req.body.userId;
  const postId = req.params.id;

  // Проверяем, существует ли пользователь и пост
 User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
     Post.findByPk(postId)
        .then((post) => {
          if (!post) {
            return res.status(404).send({ message: "Post Not found." });
          }

          // Проверяем, существует ли лайк
          Like.findOne({
            where: {
              UserId: userId,
              PostId: postId,
            },
          })
            .then((existingLike) => {
              if (!existingLike) {
                // Если лайка не существует, возвращаем ошибку
                return res.status(404).send({ message: "Like Not found." });
              }

              // Удаляем лайк
              existingLike
                .destroy()
                .then(() => {
                  res.json({ message: "Post unliked successfully" });
                })
                .catch((error) => {
                  console.error(error);
                  res.status(500).json({ message: "Failed to unlike post" });
                });
            })
            .catch((error) => {
              console.error(error);
              res.status(500).json({ message: "Failed to find existing like" });
            });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ message: "Failed to find post" });
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Failed to find user" });
    });
};

exports.countLikesForOne = (req, res) => {
  const postId = req.params.id;

  Like.count({
    where: { postId: postId }
  })
    .then(count => {
      res.json({ likeCount: count });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: "Failed to get like count for post" });
    });
};

exports.countAllLikes = (req, res) => {
  Like.findAll({
    attributes: ['postId', [db.Sequelize.fn('COUNT', 'postId'), 'totalLikes']],
    group: ['postId']
  })
    .then(likeCounts => {
      res.json(likeCounts);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: "Failed to count total likes" });
    });
};