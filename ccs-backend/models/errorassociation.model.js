module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "tblerrorassociation",
    {
      id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      errCode: {
        type: Sequelize.INTEGER(11),
      },
      errName: {
        type: Sequelize.STRING(100),
      },
    },
    {
      tableName: "tblerrorassociation",
      createdAt: false,
      updatedAt: false,
    }
  );
  return User;
};
