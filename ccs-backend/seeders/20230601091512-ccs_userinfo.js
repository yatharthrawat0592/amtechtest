"use strict";

/** @type {import('sequelize-cli').Migration} */

const currDateTime = require("../services/utils.js");
module.exports = {
  async up(queryInterface, Sequelize) {
    const currentDateTime = currDateTime();
    await queryInterface.bulkInsert("ccs_userinfo", [
      {
        first_name: "Main",
        last_name: "admin",
        email: "admin@gmail.com",
        password: "12345",
        createdAt: currentDateTime,
        updatedAt: currentDateTime,
        role: "Admin",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ccs_userinfo", { id: "1" }, {});
  },
};
