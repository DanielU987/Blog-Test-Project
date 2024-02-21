module.exports = (sequelize, Sequelize) => {
  const Like = sequelize.define("Like", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  });
  return Like;
};
