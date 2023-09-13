module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "tblsystemunitassociation",
    {
      associationId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      systemAssociationId: {
        type: Sequelize.STRING(50),
      },
      unitAssociationId: {
        type: Sequelize.STRING(50),
      },
    },
    {
      tableName: "tblsystemunitassociation",
      createdAt: false,
      updatedAt: false,
    }
  );
  return User;
};
