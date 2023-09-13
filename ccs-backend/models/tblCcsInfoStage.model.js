module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "tblCcsInfoStage",
    {
      unitId: {
        type: Sequelize.STRING(50),
        primaryKey: true,
        references: {
          model: "tblccsunit",
          key: "unitId",
        },
      },
      ccs_serial: {
        type: Sequelize.STRING(50),
      },
      cfmSetPoint: {
        type: Sequelize.INTEGER(11),
      },
      elevationSetPoint: {
        type: Sequelize.INTEGER(11),
      },
      model_type: {
        type: Sequelize.STRING(50),
      },
      firmware_version: {
        type: Sequelize.DOUBLE,
      },
      data_available: {
        type: Sequelize.TINYINT(0),
      },
      minimum_cfm_set_pt: {
        type: Sequelize.INTEGER(32),
      },
      maximum_cfm_set_pt: {
        type: Sequelize.INTEGER(32),
      },
      soft_power_off: {
        type: Sequelize.TINYINT(0),
      },
    },
    {
      tableName: "tblCcsInfoStage",
      createdAt: false,
      updatedAt: false,
    }
  );

  return User;
};
