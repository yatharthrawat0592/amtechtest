module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "dbfrontendlog",
    {
      logId: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER(11),
      },
      logDate: {
        type: Sequelize.DATE,
      },
      action: {
        type: Sequelize.STRING(250),
      },
      apiEndpoint: {
        type: Sequelize.STRING(100),
      },
      payload: {
        type: Sequelize.TEXT("long"),
      },
      status: {
        type: Sequelize.STRING(500),
      },
      stackTrace: {
        type: Sequelize.STRING(2000),
        allowNull: true,
      },
      query: {
        type: Sequelize.TEXT("long"),
      },
    },
    {
      tableName: "dbfrontendlog",
      createdAt: false,
      updatedAt: false,
    }
  );

  return User;
};
