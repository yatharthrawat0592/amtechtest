module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "tblCcsFirmware",
    {
      firmwareId: {
        type: Sequelize.STRING(50),
        primaryKey: true,
      },
      firmwareBinary: {
        type: Sequelize.TEXT("long"),
      },
      firmwareVersion: {
        type: Sequelize.DOUBLE,
      },
      firmwareActive: {
        type: Sequelize.TINYINT(1),
      },
      firmwareUpdatedAt: {
        type: Sequelize.DATE,
      },
      firmwareName: {
        type: Sequelize.STRING(200),
      },
    },
    {
      tableName: "tblCcsFirmware",
      createdAt: false,
      updatedAt: false,
    }
  );

  return User;
};
