"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        "tblCcsInfoStage",
        "minimum_cfm_set_pt",
        {
          type: Sequelize.DataTypes.INTEGER(32),
          defaultValue: null,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "tblCcsInfoStage",
        "maximum_cfm_set_pt",
        {
          type: Sequelize.DataTypes.INTEGER(32),
          defaultValue: null,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "tblCcsInfoStage",
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
      await queryInterface.removeColumn(
        "tblCcsInfoStage",
        "minimum_cfm_set_pt",
        {
          transaction,
        }
      );
      await queryInterface.removeColumn(
        "tblCcsInfoStage",
        "maximum_cfm_set_pt",
        {
          transaction,
        }
      );
      await queryInterface.removeColumn("tblCcsInfoStage", "soft_power_off", {
        transaction,
      });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
