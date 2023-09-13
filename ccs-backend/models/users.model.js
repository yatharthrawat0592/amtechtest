module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "ccs_userinfo",
    {
      id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        type: Sequelize.STRING,
      },
      last_name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.STRING(20),
      },
    },
    {
      tableName: "ccs_userinfo",
    }
  );
  return User;
};
