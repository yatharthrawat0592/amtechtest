module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "tblccsunit",
    {
      unitId: {
        type: Sequelize.STRING(50),
        primaryKey: true,
        allowNull: true,
      },
      serial: {
        type: Sequelize.STRING(50),
      },
      model: {
        type: Sequelize.STRING(50),
      },
      firmwareVersion: {
        type: Sequelize.DOUBLE,
      },
      hardwareVersion: {
        type: Sequelize.DOUBLE,
      },
      wifiVersion: {
        type: Sequelize.DOUBLE,
      },
      cfmSetPoint: {
        type: Sequelize.INTEGER,
      },
      elevation: {
        type: Sequelize.INTEGER,
      },
      pAmbient: {
        type: Sequelize.DOUBLE,
      },
      lastUpdateSent: {
        type: Sequelize.DATE,
      },
      lastUpdateReceived: {
        type: Sequelize.DATE,
      },
      rebootDateTime: {
        type: Sequelize.DATE,
      },
      errLog: {
        type: Sequelize.INTEGER,
        references: {
          model: "tbleuniterror",
          key: "errorid",
        },
      },
      description: {
        type: Sequelize.STRING(50),
      },
      IpAddress: {
        type: Sequelize.STRING(200),
      },
      dateAdded: {
        type: Sequelize.DATE,
      },
      deleted: {
        type: Sequelize.TINYINT(0),
      },
      minimum_cfm_set_pt: {
        type: Sequelize.INTEGER(32),
      },
      maximum_cfm_set_pt: {
        type: Sequelize.INTEGER(32),
      },
      hepa_run_time: {
        type: Sequelize.DATE,
      },
      unit_run_time: {
        type: Sequelize.DATE,
      },
      soft_power_off: {
        type: Sequelize.TINYINT(0),
      },
    },
    {
      tableName: "tblccsunit",
      createdAt: false,
      updatedAt: false,
    }
  );
  return User;
};
