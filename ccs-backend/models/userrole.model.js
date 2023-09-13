module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "userroles",
    {
      roles: {
        type: Sequelize.STRING(20),
      },
    },
    {
      tableName: "userroles",
    }
  );
  return User;
};
