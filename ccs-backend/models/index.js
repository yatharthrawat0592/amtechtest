const Sequelize = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const MAX = parseInt(process.env.MAX);
const MIN = parseInt(process.env.MIN);

const sequelize = new Sequelize(
  process.env.CCS_DB,
  process.env.CCS_USER,
  process.env.CCS_PASS,
  {
    host: process.env.CCS_URI,
    dialect: process.env.DIALECT,
    operatorsAliases: false,
    port: process.env.CCS_PORT,
    pool: {
      max: MAX,
      min: MIN,
      acquire: process.env.ACQUIRE,
      idle: process.env.IDLE,
    },
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.userRegister = require("./register.model.js")(sequelize, Sequelize);

db.ccsUnitData = require("./data.model.js")(sequelize, Sequelize);

db.ccsSystem = require("./system.model.js")(sequelize, Sequelize);

db.ccsUnit = require("./units.model.js")(sequelize, Sequelize);

db.unitError = require("./uniterror.model.js")(sequelize, Sequelize);

db.errorAssociation = require("./errorassociation.model.js")(
  sequelize,
  Sequelize
);

db.systemUnitAssociation = require("./systemunitassociation.model")(
  sequelize,
  Sequelize
);

db.dbFrontendLog = require("./dbfrontendlog.js")(sequelize, Sequelize);

db.ccsInfoStage = require("./tblCcsInfoStage.model.js")(sequelize, Sequelize);

db.ccsFirmWare = require("./tblCcsFirmware.model.js")(sequelize, Sequelize);

db.users = require("./users.model.js")(sequelize, Sequelize);

module.exports = db;
