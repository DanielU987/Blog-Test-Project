const { Sequelize } = require("sequelize");
const db = require("../models");
const { isNullOrUndefined } = require("util");
const Post = db.post;
const User = db.user;
const UserPost = db.userPost;
const Op = db.Sequelize.Op;

// Create and Save a new Post
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  console.log("!AAAA");
  const userId = req.body.userId;

  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      console.log("!BBBB");
      // Create a Post with userId
      const post = {
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
      };

      // Save Post in the database
      Post.create(post)
        .then((data) => {
          user.addPost(data);
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Post.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

// Retrieve all Posts from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  const condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

  Post.findAll({ where: condition })
    .then((posts) => {
      // Запрос для извлечения связей между пользователями и постами
      UserPost.findAll()
        .then((userPosts) => {
          // Извлечение всех пользователей для дальнейшего использования
          User.findAll({ raw: true })
            .then((users) => {
              const postData = posts.map((post) => {
                // Находим соответствующую запись о связи для текущего поста
                const userPost = userPosts.find((up) => up.postId === post.id);
                const postCreator = users.find((user) => user.id === userPost.userId);
                // Извлекаем только имя пользователя из объекта postCreator
                const creatorName = postCreator ? postCreator.username : "Anon";
                return {
                  id: post.id,
                  title: post.title,
                  content: post.content,
                  image: post.image,
                  createdAt: post.createdAt,
                  updatedAt: post.updatedAt,
                  creator: creatorName, // Поставляем только имя пользователя
                };
              });
              res.send(postData);
            })
            .catch((err) => {
              console.error("Ошибка при получении пользователей:", err);
              res.status(500).send({
                message: "Произошла ошибка при получении пользователей.",
              });
            });
        })
        .catch((err) => {
          console.error("Ошибка при получении данных о связи пользователь-пост:", err);
          res.status(500).send({
            message: "Произошла ошибка при получении данных о связи пользователь-пост.",
          });
        });
    })
    .catch((err) => {
      console.error("Ошибка при получении постов:", err);
      res.status(500).send({
        message: "Произошла ошибка при получении постов.",
      });
    });
};



// Find a single Post with an id
exports.findOne = (req, res) => {
  const postId = req.params.id;
  const userId = req.query.userId;

  // Проверяем, существует ли пост с данным postId
  Post.findByPk(postId)
    .then((post) => {
      if (!userId) {
        const responseData = {
          post: post,
        };
        return res.send(responseData);
      }

      // Проверяем, существует ли соответствующая строка в user_post для данного userId и postId
      UserPost.findOne({
        where: {
          postId: postId,
          userId: userId
        }
      })
        .then((userPost) => {
          const responseData = {
            post: post,
            userPostFound: !!userPost // Если userPost найден, вернется true, иначе false
          };
          res.send(responseData);
        })
        .catch((err) => {
          console.error("Ошибка при получении данных о связи пользователя и поста:", err);
          res.status(500).send({
            message: "Ошибка при получении данных о связи пользователя и поста."
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Ошибка при получении поста с id=" + postId,
      });
    });
};
// Update a Post by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Post.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Post was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Post with id=${id}. Maybe Post was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Post with id=" + id,
      });
    });
};

// Delete a Post with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Post.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Post was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Post with id=${id}. Maybe Post was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Post with id=" + id,
      });
    });
};

// Delete all Posts from the database.
exports.deleteAll = (req, res) => {
  Post.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Posts were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all posts.",
      });
    });
};
