module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "tutorials",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING(255),
      },
      description: {
        type: Sequelize.STRING(255),
      },
      published: {
        type: Sequelize.TINYINT(1),
      },
    },
    {
      tableName: "tutorials",
    }
  );
  return User;
};
