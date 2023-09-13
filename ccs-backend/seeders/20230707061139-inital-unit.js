'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('tblccsunit',[{
      unitId: '8c7a2613-3207-4d4d-b598-db92783ecff3',
      serial: 'CCS-123456',
      model: '0',
      firmwareVersion: 0
    }]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('tblccsunit', { unitId: '8c7a2613-3207-4d4d-b598-db92783ecff3' }, {});
  }
};
