const db = require("../models");
const dbFrontendError = db.dbFrontendLog;

const dbFrontendLogsFunc = (insertLogs) => {
  console.log("InsertLogs:", insertLogs);
  dbFrontendError
    .create(insertLogs)
    .then((data) => {
      console.log("dbFrontend logInserted");
    })
    .catch((err) => {
      console.log("Frontend db error here:", err);
    });
};

module.exports = dbFrontendLogsFunc;
