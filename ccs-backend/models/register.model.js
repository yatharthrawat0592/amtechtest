module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "ccs_tblCcsusersession",
    {
      UserId: {
        type: Sequelize.INTEGER(11),
        references: {
          model: "ccs_userinfo",
          key: "id",
        },
      },
      first_name: {
        type: Sequelize.STRING,
      },
      last_name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        //unique: true,
      },
      IpAddress: {
        type: Sequelize.STRING(50),
      },
      token: {
        type: Sequelize.STRING(500),
      },
      password: {
        type: Sequelize.STRING,
      },
      count: {
        type: Sequelize.INTEGER(50),
      },
      is_active: {
        type: Sequelize.TINYINT(0),
      },
    },
    {
      tableName: "ccs_tblCcsusersession",
    }
  );
  return User;
};
