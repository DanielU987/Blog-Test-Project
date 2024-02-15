module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define("posts", {
    title: {
      type: Sequelize.STRING,
    },
    content: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.BLOB,
    },
    likesCount: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  });


  return Post;
};