'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.bulkInsert('tblCcsFirmware',[{
        firmwareBinary: 'gifjoiqj34534fevegrepkqe-d3',
        firmwareId: '2233',
        firmwareVersion: '12',
        firmwareActive: 0
      }]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tblCcsFirmware', { firmwareId: '2233' }, {});
  }
};
