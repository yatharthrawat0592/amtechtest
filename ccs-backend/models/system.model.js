module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define(
      "tblccssystem",
      {
        systemId: {
            type: Sequelize.STRING(50),
            primaryKey: true,
        },
        dateCreated: {
            type: Sequelize.DATE,
        },
        createdBy: {
            type: Sequelize.STRING(50),
        },
        description: {
            type: Sequelize.STRING(100),
        },
      },
      {
          tableName: "tblccssystem",
          createdAt: false,
          updatedAt: false,
      }
    );
    return User;
};