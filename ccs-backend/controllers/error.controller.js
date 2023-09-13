const db = require("../models");
const bcrypt = require("bcryptjs");
const UnitErrorInfo = db.unitError;
const errorAssociation = db.errorAssociation;
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const objError = require("../helper/objErrorNames.js");
const currDateTime = require("../services/utils.js");
const dbFrontendLogs = require("../middleware/dbFrontendLogs.js");

// Create unit error for hardware

exports.createUnitError = async (req, res) => {
  var token = req.headers.authorization;
  if (token) {
    token = token.slice(7, token.length);
    var decoded = jwt.verify(token, "the-super-strong-secrect");
  }

  if (
    !req.body.errCode ||
    !req.body.errValue ||
    !req.body.errDescription ||
    !req.body.unitid
  ) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  const currentDateTime = currDateTime();

  const insertUnitError = {
    errDateTime: currentDateTime,
    errCode: req.body.errCode,
    errValue: req.body.errValue,
    errDescription: req.body.errDescription,
    unitid: req.body.unitid,
  };

  const insertLogs = {
    userId: decoded.id,
    logDate: currentDateTime,
    action: "Post",
    apiEndpoint: decoded.instance_url + "error/uniterror",
    payload: `{errDateTime:${currentDateTime},  
      errCode:${req.body.errCode},
      errValue:${req.body.errValue},
      errDescription:${req.body.errDescription},
      unitid:${req.body.unitid}}`,
  };

  const arrData = [];
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  UnitErrorInfo.create(insertUnitError, { logging: logFunc })
    .then((data) => {
      const query = arrData[0];
      insertLogs.status = "Ok";
      insertLogs.stackTrace = null;

      const {
        errorid,
        errDateTime,
        errCode,
        errValue,
        errDescription,
        unitid,
      } = data;
      const refineQuery = query.split("VALUES")[0];
      const queryRes =
        refineQuery +
        `VALUES (${errorid},${errDateTime},${errCode},${errValue},${errDescription},${unitid})`;
      insertLogs.query = queryRes;

      dbFrontendLogs(insertLogs);
      res.send(data);
    })
    .catch((err) => {
      insertLogs.status = err.message;
      insertLogs.stackTrace = err.stack;
      dbFrontendLogs(insertLogs);
      res.status(500).send({
        message: err.message || "Unit error is not properly inserted",
      });
    });
  res.json(data);
};

// Insert into table unit association

exports.createErrorAssociation = (req, res) => {
  var token = req.headers.authorization;
  if (token) {
    token = token.slice(7, token.length);
    var decoded = jwt.verify(token, "the-super-strong-secrect");
  }

  const errNameComp = req.body.errCode;

  const fetchObjErrorName = objError.objErrorNames;

  var errNamerefine;
  if (fetchObjErrorName.hasOwnProperty(errNameComp)) {
    errNamerefine = fetchObjErrorName[errNameComp];
  }

  const insertErrorAssociation = {
    errCode: req.body.errCode,
    errName: errNamerefine,
  };

  const currentDateTime = currDateTime();

  const insertLogs = {
    userId: decoded.id,
    logDate: currentDateTime,
    action: "Post",
    apiEndpoint: decoded.instance_url + "error/errorassociation",
    payload: `{errCode:${errNameComp}}`,
  };

  const arrData = [];
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  errorAssociation
    .create(insertErrorAssociation, { logging: logFunc })
    .then((data) => {
      const query = arrData[0];
      const { id, errCode, errName } = data;

      const refineQuery = query.split("VALUES")[0];
      const queryRes = refineQuery + `VALUES (${id},${errCode},${errName})`;
      insertLogs.query = queryRes;
      insertLogs.status = "Ok";
      insertLogs.stackTrace = "null";
      dbFrontendLogs(insertLogs);
      res.send(data);
    })
    .catch((err) => {
      insertLogs.status = err.message;
      insertLogs.stackTrace = err.stack;
      dbFrontendLogs(insertLogs);
      res.status(500).send({
        message:
          err.message || "Table association error is not properly inserted",
      });
    });
};
