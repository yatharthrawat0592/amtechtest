module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "tbleuniterror",
    {
      errorid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      errNumEntries: {
        type: Sequelize.INTEGER,
      },
      errDateTime: {
        type: Sequelize.DATE,
      },
      errCode: {
        type: Sequelize.INTEGER,
      },
      errValue: {
        type: Sequelize.INTEGER,
      },
      errDescription: {
        type: Sequelize.STRING(100),
      },
      unitid: {
        type: Sequelize.STRING(50),
      },
    },
    {
      tableName: "tbleuniterror",
      createdAt: false,
      updatedAt: false,
    }
  );
  return User;
};
