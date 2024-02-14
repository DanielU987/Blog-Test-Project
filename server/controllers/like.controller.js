// controllers/postLike.js
const db = require("../models");

exports.likePost = (req, res) => {
  const userId = req.body.userId;
  const postId = req.body.postId;

  // Проверяем, существует ли пользователь и пост
  db.User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      db.Post.findByPk(postId)
        .then((post) => {
          if (!post) {
            return res.status(404).send({ message: "Post Not found." });
          }

          // Проверяем, не поставил ли пользователь уже лайк
          db.Like.findOne({
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
                db.Like.create({
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
  db.User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      db.Post.findByPk(postId)
        .then((post) => {
          if (!post) {
            return res.status(404).send({ message: "Post Not found." });
          }

          // Проверяем, существует ли лайк
          db.Like.findOne({
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
