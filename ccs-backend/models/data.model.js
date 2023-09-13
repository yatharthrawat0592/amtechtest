module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "tblccsunitdata",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      unitIdRef: {
        type: Sequelize.STRING(50),
        references: {
          model: "tblccsunit",
          key: "unitId",
        },
      },
      status: {
        type: Sequelize.INTEGER,
      },
      temperature: {
        type: Sequelize.DOUBLE,
      },
      cfm: {
        type: Sequelize.DOUBLE,
      },
      filterLife: {
        type: Sequelize.DOUBLE,
      },
      pwm: {
        type: Sequelize.INTEGER,
      },
      ps1: {
        type: Sequelize.DOUBLE,
      },
      ps2: {
        type: Sequelize.DOUBLE,
      },
      updateReceived: {
        type: Sequelize.DATE,
      },
      power_vdc: {
        type: Sequelize.FLOAT
      }
    },
    {
      tableName: "tblccsunitdata",
      createdAt: false,
      updatedAt: false,
    }
  );
  return User;
};
