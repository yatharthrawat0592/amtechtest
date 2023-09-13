"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        "tblccsunit",
        "minimum_cfm_set_pt",
        {
          type: Sequelize.DataTypes.INTEGER(32),
          defaultValue: null,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "tblccsunit",
        "maximum_cfm_set_pt",
        {
          type: Sequelize.DataTypes.INTEGER(32),
          defaultValue: null,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "tblccsunit",
        "hepa_run_time",
        {
          type: Sequelize.DataTypes.DATE,
          defaultValue: null,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "tblccsunit",
        "unit_run_time",
        {
          type: Sequelize.DataTypes.DATE,
          defaultValue: null,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "tblccsunit",
        "soft_power_off",
        {
          type: Sequelize.DataTypes.TINYINT(1),
          defaultValue: 0,
        },
        { transaction }
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn("tblccsunit", "minimum_cfm_set_pt", {
        transaction,
      });
      await queryInterface.removeColumn("tblccsunit", "maximum_cfm_set_pt", {
        transaction,
      });
      await queryInterface.removeColumn("tblccsunit", "hepa_run_time", {
        transaction,
      });
      await queryInterface.removeColumn("tblccsunit", "unit_run_time", {
        transaction,
      });
      await queryInterface.removeColumn("tblccsunit", "soft_power_off", {
        transaction,
      });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
