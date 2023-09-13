const db = require("../models");
const CCS_UnitData = db.ccsUnitData;

const CCS_System = db.ccsSystem;
const Op = db.Sequelize.Op;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sequelize = db.sequelize;
const dbFrontendLogs = require("../middleware/dbFrontendLogs.js");
const currDateTime = require("../services/utils.js");

// Get all Unit Data
//routes - data/

exports.findAllData = async (req, res) => {
  var token = req.headers.authorization;
  if (token) {
    token = token.slice(7, token.length);
    var decoded = jwt.verify(token, "the-super-strong-secrect");
  }
  const currentDateTime = currDateTime();

  const insertLogs = {
    userId: decoded.id,
    logDate: currentDateTime,
    action: "Get",
    apiEndpoint: decoded.instance_url + "api/data/",
    payload: null,
  };

  const arrData = [];
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  CCS_System.findAll({ logging: logFunc })
    .then((data) => {
      const query = arrData[0];
      insertLogs.status = "Ok";
      insertLogs.stackTrace = null;
      insertLogs.query = query;
      dbFrontendLogs(insertLogs);
      res.json(data);
    })
    .catch((err) => {
      insertLogs.status = err.message;
      insertLogs.stackTrace = err.stack;
      dbFrontendLogs(insertLogs);
      res.status(500).send({
        message: err.message || "Some eror occured while fteching unit system",
      });
    });
};

//Get Unit data by Unit ID from tblccsunitdata
//routes - data/:unitId
exports.findOneUnitId = async (req, res) => {
  var token = req.headers.authorization;
  if (token) {
    token = token.slice(7, token.length);
    var decoded = jwt.verify(token, "the-super-strong-secrect");
  }

  const currentDateTime = currDateTime();

  const insertLogs = {
    userId: decoded.id,
    logDate: currentDateTime,
    action: "Get",
    apiEndpoint: decoded.instance_url + `api/data/${req.params.unitId}`,
    payload: `{unitIdRef:${req.params.unitId}}`,
  };

  const arrData = [];
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  CCS_UnitData.findAll({
    where: { unitIdRef: req.params.unitId },
    logging: logFunc,
  })
    .then((data) => {
      const query = arrData[0];
      insertLogs.status = "Ok";
      insertLogs.stackTrace = null;
      insertLogs.query = query;
      dbFrontendLogs(insertLogs);
      res.json(data);
    })
    .catch((err) => {
      insertLogs.status = err.message;
      insertLogs.stackTrace = err.stack;
      dbFrontendLogs(insertLogs);
      res.status(500).send({
        message: err.message || "Some eror occured while fteching unit data",
      });
    });
};

//Get Unit data by unit ID and time range from tblccsunitdata
//routes - data/:unitId && timerange
exports.findUnitIdRange = async (req, res) => {
  var token = req.headers.authorization;
  if (token) {
    token = token.slice(7, token.length);
    var decoded = jwt.verify(token, "the-super-strong-secrect");
  }

  const currentDateTime = currDateTime();

  const insertLogs = {
    userId: decoded.id,
    logDate: currentDateTime,
    action: "Get",
    apiEndpoint:
      decoded.instance_url +
      `api/data/${req.params.unitId}/${req.params.timeRangeFrom}/${req.params.timeRangeTo}`,
    payload: `{unitIdRef:${req.params.unitId},  
    fromDate:${req.params.timeRangeFrom},
    toDate:${req.params.timeRangeTo}}`,
  };

  const arrData = [];
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  CCS_UnitData.findAll({
    where: {
      unitIdRef: req.params.unitId,
    },
    logging: logFunc,
  })
    .then((data) => {
      const query = arrData[0];
      insertLogs.status = "Ok";
      insertLogs.stackTrace = null;
      insertLogs.query = query;
      dbFrontendLogs(insertLogs);

      const fromDate = req.params.timeRangeFrom.toString();
      const toDate = req.params.timeRangeTo.toString();

      var arrIndex = [];
      var result = [];
      for (let timeRange = 0; timeRange < data.length; timeRange++) {
        const typeCast = data[timeRange].updateReceived.toISOString();
        if (
          fromDate == typeCast.slice(11, 19) ||
          toDate == typeCast.slice(11, 19)
        ) {
          arrIndex.push(timeRange);
        }
      }

      for (
        let timeRangeRes = arrIndex[0];
        timeRangeRes <= arrIndex[1];
        timeRangeRes++
      ) {
        result.push(data[timeRangeRes].dataValues);
      }
      res.json(result);
    })
    .catch((err) => {
      insertLogs.status = err.message;
      insertLogs.stackTrace = err.stack;
      dbFrontendLogs(insertLogs);

      res.status(500).send({
        message: err.message || "Some eror occured while fteching unit data",
      });
    });
};

// Get Unit data by data range
//routes -  /data/:timeRangeFrom/:timeRangeTo
exports.findUnitDataRange = async (req, res) => {
  var token = req.headers.authorization;
  if (token) {
    token = token.slice(7, token.length);
    var decoded = jwt.verify(token, "the-super-strong-secrect");
  }

  const currentDateTime = currDateTime();

  const insertLogs = {
    userId: decoded.id,
    logDate: currentDateTime,
    action: "Get",
    apiEndpoint:
      decoded.instance_url +
      `api/data/${req.params.timeRangeFrom}/${req.params.timeRangeTo}`,
    payload: `{fromDate:${req.params.timeRangeFrom},  
    toDate:${req.params.timeRangeTo}}`,
  };

  const arrData = [];
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  CCS_UnitData.findAll({ logging: logFunc })
    .then((data) => {
      const query = arrData[0];
      insertLogs.status = "Ok";
      insertLogs.stackTrace = null;
      insertLogs.query = query;
      dbFrontendLogs(insertLogs);

      const fromDate = req.params.timeRangeFrom.toString();
      const toDate = req.params.timeRangeTo.toString();

      var arrIndex = [];
      var result = [];
      for (let timeRange = 0; timeRange < data.length; timeRange++) {
        const typeCast = data[timeRange].updateReceived.toISOString();
        if (
          fromDate == typeCast.slice(11, 19) ||
          toDate == typeCast.slice(11, 19)
        ) {
          arrIndex.push(timeRange);
        }
      }

      for (
        let timeRangeRes = arrIndex[0];
        timeRangeRes <= arrIndex[1];
        timeRangeRes++
      ) {
        result.push(data[timeRangeRes].dataValues);
      }
      res.json(result);
    })
    .catch((err) => {
      insertLogs.status = err.message;
      insertLogs.stackTrace = err.stack;
      dbFrontendLogs(insertLogs);

      res.status(500).send({
        message: err.message || "Some eror occured while fteching unit data",
      });
    });
};

// Insert Unit_Data
// routes - /data/:unitId
exports.createUnitData = async (req, res) => {
  var token = req.headers.authorization;
  if (token) {
    token = token.slice(7, token.length);
    var decoded = jwt.verify(token, "the-super-strong-secrect");
  }

  const currentDateTime = currDateTime();
  console.log(req.body);
  const r = req.body;
  var datetime = new Date();
  const dateTimeUpdated =
    datetime.toISOString().slice(0, 10) +
    " " +
    datetime.toISOString().slice(12, 19);

  const addUnitData = {
    unitIdRef: req.params.unitId,
    status: r.status,
    temperature: r.temperature,
    cfm: r.cfm,
    filterLife: r.filterLife / 100,
    pwm: r.pwm,
    ps1: r.ps1,
    ps2: r.ps2,
    updateReceived: dateTimeUpdated,
    power_vdc: r.power_vdc
  };

  const insertLogs = {
    userId: decoded.id,
    logDate: currentDateTime,
    action: "Post",
    apiEndpoint: decoded.instance_url + `api/data/${req.params.unitId}`,
    payload: `{unitIdRef:${req.params.unitId}
    {status:${r.status}
    {temperature:${r.temperature}
    {cfm:${r.cfm}
    {filterLife:${r.filterLife}
    {pwm:${r.pwm}
    {ps1:${r.ps1},
    {ps2:${r.ps2},
    {updateReceived:${dateTimeUpdated}}
    `,
  };

  const arrData = [];
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  CCS_UnitData.create(addUnitData, { logging: logFunc })
    .then((data) => {
      const query = arrData[0];
      insertLogs.status = "Ok";
      insertLogs.stackTrace = null;
      const {
        unitIdRef,
        status,
        cfm,
        filterLife,
        pwm,
        ps1,
        ps2,
        updateReceived,
        power_vdc
      } = addUnitData;

      const refineQuery = query.split("VALUES")[0];
      const queryRes =
        refineQuery +
        `VALUES (${unitIdRef},${status},${cfm},${filterLife},${pwm},${ps1},${ps2},${updateReceived},${power_vdc})`;
      insertLogs.query = queryRes;

      dbFrontendLogs(insertLogs);
      res.send({
        message: "Data Inserted",
      });
    })
    .catch((err) => {
      insertLogs.status = err.message;
      insertLogs.stackTrace = err.stack;
      dbFrontendLogs(insertLogs);
      res.status(500).send({
        message: err.message || "Some error occured while creating data",
      });
    });
};
