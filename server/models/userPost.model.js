module.exports = (sequelize, Sequelize) => {
  const UserPost = sequelize.define(
    "user_post",
    {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users", // Имя вашей таблицы пользователей
          key: "id", // Предполагается, что у вас есть столбец с идентификатором пользователя
        },
      },
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "posts", // Имя вашей таблицы постов
          key: "id", // Предполагается, что у вас есть столбец с идентификатором поста
        },
      },
    },
    {
      tableName: "user_post", // Указываем явно имя таблицы
    }
  );

  return UserPost;
};
