module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define("comment", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      // Идентификатор пользователя, который оставил комментарий
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      // Идентификатор поста, к которому относится комментарий
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
      // Другие поля комментария, если необходимо
    });
  
    return Comment;
  };