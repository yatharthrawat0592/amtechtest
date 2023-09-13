const db = require("../models");
const CCSUnit = db.ccsUnit;
const ccsInfoStage = db.ccsInfoStage;
const bcrypt = require("bcryptjs");
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const getSqlDateTime = require("../services/utils.js");
const dbFrontendLogs = require("../middleware/dbFrontendLogs.js");
const currDateTime = require("../services/utils.js");

// Get all CcsInfo Data
// routes : api/getInfoStage

exports.getAllCcsInfoStage = async (req, res) => {
  var token = req.headers.authorization;
  const { flag = null } = req.query;
  if (token) {
    token = token.slice(7, token.length);
    var decoded = jwt.verify(token, "the-super-strong-secrect");
  }

  const currentDateTime = currDateTime();

  const insertLogs = {
    userId: decoded.id,
    logDate: currentDateTime,
    action: "Get",
    apiEndpoint: decoded.instance_url + "api/getInfoStage",
    payload: null,
  };

  const arrData = [];
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  ccsInfoStage
    .findAll({ logging: logFunc })
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
        message: err.message || "Some eror occured while fteching Ccs system11",
      });
    });
};

// Insert into table ccsInfoStage
// routes : api/createInfoStage

exports.createInfoStage = async (req, res) => {
  var token = req.headers.authorization;
  if (token) {
    token = token.slice(7, token.length);
    var decoded = jwt.verify(token, "the-super-strong-secrect");
  }

  const currentDateTime = currDateTime();

  const insertLogs = {
    userId: decoded.id,
    logDate: currentDateTime,
    action: "Post",
    apiEndpoint: decoded.instance_url + "api/createInfoStage",
    payload: `{unitId: ${req.body.unitId},
      ccs_serial: ${req.body.ccs_serial},
      cfmSetPoint: ${req.body.cfmSetPoint},
      elevationSetPoint: ${req.body.elevationSetPoint},
      model_type: ${req.body.model_type},
      firmware_version: ${req.body.firmware_version},
      data_available: ${req.body.data_available}}`,
  };

  const arrData = [];
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  // log into dbfrontendlogs data
  CCSUnit.findAll({ where: { unitId: req.body.unitId } })
    .then(async (data) => {
      if (data.length > 0) {
        infoStageObj = {
          unitId: req.body.unitId,
          ccs_serial: req.body.ccs_serial,
          cfmSetPoint: req.body.cfmSetPoint,
          elevationSetPoint: req.body.elevationSetPoint,
          model_type: req.body.model_type,
          firmware_version: req.body.firmware_version,
          data_available: req.body.data_available,
        };

        const infoStageForUnit = await ccsInfoStage.findOne({
          where: { unitId: req.body.unitId },
        });

        if (infoStageForUnit) {
          const updateInfo = await infoStageForUnit.update(req.body, {
            logging: logFunc,
          });
          insertLogs.query = arrData[0];
          insertLogs.status = "Ok";
          insertLogs.stackTrace = null;
          dbFrontendLogs(insertLogs);

          if (req.body.data_available) {
            const {
              ccs_serial,
              cfmSetPoint,
              elevationSetPoint,
              model_type,
              firmware_version,
            } = infoStageForUnit.dataValues;
            await CCSUnit.update(
              {
                serial: ccs_serial,
                cfmSetPoint,
                elevation: elevationSetPoint,
                model: model_type,
                firmwareVersion: firmware_version,
              },
              {
                where: { unitId: req.body.unitId },
              }
            );
          }

          await deleteInfoStage(req.body.unitId, insertLogs);

          res.json(updateInfo);
        } else {
          ccsInfoStage
            .create(req.body, { logging: logFunc })
            .then((data) => {
              const query = arrData[0];

              const {
                unitId,
                ccs_serial,
                cfmSetPoint,
                elevationSetPoint,
                model_type,
                firmware_version,
                data_available,
              } = data;
              const refineQuery = query.split("VALUES")[0];

              const ccs_serial_Update =
                ccs_serial == undefined ? "" : ccs_serial;
              const cfmSetPoint_Update =
                cfmSetPoint == undefined ? "" : cfmSetPoint;
              const elevationSetPoint_Update =
                elevationSetPoint == undefined ? "" : elevationSetPoint;
              const model_type_Update =
                model_type == undefined ? "" : model_type;
              const firmware_version_Update =
                firmware_version == undefined ? "" : firmware_version;
              const data_available_update =
                data_available == undefined ? "" : data_available;

              const queryRes =
                refineQuery +
                `VALUES (${unitId},${ccs_serial_Update},${cfmSetPoint_Update},${elevationSetPoint_Update},
                ${model_type_Update},${firmware_version_Update},${data_available_update})`;

              insertLogs.query = queryRes;
              insertLogs.status = "Ok";
              insertLogs.stackTrace = null;
              dbFrontendLogs(insertLogs);

              // Update the filed in tblccsunuit
              if (data.data_available === true) {
                CCSUnit.update(
                  {
                    serial: req.body.ccs_serial,
                    cfmSetPoint: req.body.cfmSetPoint,
                    elevation: req.body.elevationSetPoint,
                    model: req.body.model_type,
                    firmwareVersion: req.body.firmware_version,
                  },
                  {
                    where: {
                      unitId: req.body.unitId,
                    },
                  }
                )
                  .then((data) => {
                    const response =
                      data[0] === 1
                        ? "Record has been inserted!"
                        : "No updation same record!";
                    res.send({
                      message: response,
                    });
                  })
                  .catch((err) => {
                    res.status(500).send({
                      message:
                        err.message ||
                        "Some eror occured while updating ccs unit",
                    });
                  });
              } else {
                res.send({
                  message: "No updation record can not updated!",
                });
              }
            })
            .catch((err) => {
              insertLogs.status = err.message;
              insertLogs.stackTrace = err.stack;
              dbFrontendLogs(insertLogs);
              res.json(err.original.sqlMessage);
            });
        }
      } else {
        res.status(500).send({
          message: "Please enter valid unitId",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some eror occured while",
      });
    });
};

// Delete the entry from ccsInfoStage

exports.deleteInfoStage = async (req, res) => {
  var token = req.headers.authorization;
  const { unitId } = req.body;
  if (token) {
    token = token.slice(7, token.length);
    var decoded = jwt.verify(token, "the-super-strong-secrect");
  }

  const currentDateTime = currDateTime();

  const insertLogs = {
    userId: decoded.id,
    logDate: currentDateTime,
    action: "Delete",
    apiEndpoint: decoded.instance_url + "api/deleteInfoStage",
    payload: `{unitId:${unitId}}`,
  };

  const { status, message } = await deleteInfoStage(unitId, insertLogs);

  res.status(status).json({
    message,
  });
};

// Methods
async function deleteInfoStage(unitId, insertLogs) {
  const arrData = [];
  let message = "";
  let status = 200;
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  try {
    const deleteInfo = await ccsInfoStage.destroy({
      where: { unitId },
      logging: logFunc,
    });

    const query = arrData[0];
    insertLogs.stackTrace = null;
    insertLogs.query = query;

    if (deleteInfo === 1) {
      insertLogs.status = "Ok";
      dbFrontendLogs(insertLogs);
      message = "Deleted successfully";
    } else {
      insertLogs.status = "Invalid unitId";
      dbFrontendLogs(insertLogs);
      message = "UnitId is not valid";
    }
  } catch (err) {
    insertLogs.status = err.message;
    insertLogs.stackTrace = err.stack;
    dbFrontendLogs(insertLogs);
    status = 500;
    message = err.message || "Some eror occured while fteching ccs unit";
  }

  return { status, message };
}

// Update the infoStage data

exports.updateInfoStage = async (req, res) => {
  var token = req.headers.authorization;
  if (token) {
    token = token.slice(7, token.length);
    var decoded = jwt.verify(token, "the-super-strong-secrect");
  }
  const dateTime = currDateTime();

  const r = req.body;

  const insertLogs = {
    userId: decoded.id,
    logDate: dateTime,
    action: "Put",
    apiEndpoint: decoded.instance_url + "api/updateInfoStage",
    payload: null,
  };

  const arrData = [];
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  ccsInfoStage
    .update(r, {
      where: {
        unitId: r.unitId,
      },
      logging: logFunc,
    })
    .then((data) => {
      const query = arrData[0];
      insertLogs.status = "Ok";
      insertLogs.stackTrace = null;
      //insertLogs.query = query;
      dbFrontendLogs(insertLogs);
      res.send({
        message: "CcsInfoStage Updated",
      });
    })
    .catch((err) => {
      insertLogs.status = err.message;
      insertLogs.stackTrace = err.stack;
      dbFrontendLogs(insertLogs);
      res.status(500).send({
        message: err.message,
      });
    });
};
