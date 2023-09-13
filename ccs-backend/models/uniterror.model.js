module.exports = (sequelize, Sequelize) => {
  const UnitError = sequelize.define(
    "tbleuniterror",
    {
      errorid: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      errNumEntries: {
        type: Sequelize.INTEGER(11),
      },
      errDateTime: {
        type: Sequelize.DATE,
      },
      errCode: {
        type: Sequelize.INTEGER(11),
      },
      errValue: {
        type: Sequelize.INTEGER(11),
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
  return UnitError;
};
