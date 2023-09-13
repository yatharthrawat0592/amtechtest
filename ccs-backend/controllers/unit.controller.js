const db = require("../models");
const CCSUnit = db.ccsUnit;
const CCS_UnitData = db.ccsUnitData;
const ccsInfoStage = db.ccsInfoStage;
const bcrypt = require("bcryptjs");
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const currDateTime = require("../services/utils.js");
const dbFrontendLogs = require("../middleware/dbFrontendLogs.js");
const uuid = require("uuid");
const ccsSystemAssociation = db.systemUnitAssociation;

// Get all CCS Unit Data

exports.getCCSUnit = async (req, res) => {
  var token = req.headers.authorization;
  if (token) {
    token = token.slice(7, token.length);
    var decoded = jwt.verify(token, "the-super-strong-secrect");
  }
  const dateTime = currDateTime();

  const insertLogs = {
    userId: decoded.id,
    logDate: dateTime,
    action: "Get",
    apiEndpoint: decoded.instance_url + "api/units",
    payload: null,
  };

  const arrData = [];
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  CCSUnit.findAll({ logging: logFunc })
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

// Get Unit data by unit id

exports.latestDataByUnitId = async (req, res) => {
  var token = req.headers.authorization;
  if (token) {
    token = token.slice(7, token.length);
    var decoded = jwt.verify(token, "the-super-strong-secrect");
  }

  const dateTime = currDateTime();

  const insertLogs = {
    userId: decoded.id,
    logDate: dateTime,
    action: "Get",
    apiEndpoint:
      decoded.instance_url + `api/units/latestData/${req.params.unitId}`,
    payload: null,
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
    order: [["updateReceived", "DESC"]],
    limit: 1,
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
        message: err.message || "Some eror occured while fteching unit system",
      });
    });
};

// Insert data into unit id

exports.createUnit = async (req, res) => {
  var token = req.headers.authorization;
  if (token) {
    token = token.slice(7, token.length);
    var decoded = jwt.verify(token, "the-super-strong-secrect");
  }
  const dateTime = currDateTime();

  const insertLogs = {
    userId: decoded.id,
    logDate: dateTime,
    action: "Post",
    apiEndpoint: decoded.instance_url + "api/units/create",
    payload: null,
  };

  const r = req.body;

  const arrData = [];
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  if (r.serial) {
    CCSUnit.findOne({
      where: {
        serial: r.serial,
      },
    })
      .then((unitData) => {
        if (unitData && unitData.deleted === 1) {
          CCSUnit.update(r, {
            where: {
              serial: req.body.serial,
            },
          })
            .then((unitUpdate) => {
              ccsInfoStage
                .findOne({
                  where: {
                    unitId: unitData.unitId,
                  },
                })
                .then((infoUpdate) => {
                  if (infoUpdate) {
                    const insertInfoStage = {
                      unitId: r.unitId,
                      ccs_serial: r.serial,
                      cfmSetPoint: r.cfmSetPoint,
                      elevationSetPoint: r.elevation,
                      model_type: r.model,
                      firmware_version: r.firmwareVersion,
                      data_available: true,
                      minimum_cfm_set_pt: r.minimum_cfm_set_pt,
                      maximum_cfm_set_pt: r.maximum_cfm_set_pt,
                    };

                    ccsInfoStage.update(insertInfoStage, {
                      where: {
                        unitId: unitData.unitId,
                      },
                    });
                  } else {
                    const insertInfoStage = {
                      unitId: unitData.unitId,
                      ccs_serial: r.serial,
                      cfmSetPoint: r.cfmSetPoint,
                      elevationSetPoint: r.elevation,
                      model_type: r.model,
                      firmware_version: r.firmwareVersion,
                      data_available: true,
                      minimum_cfm_set_pt: r.minimum_cfm_set_pt,
                      maximum_cfm_set_pt: r.maximum_cfm_set_pt,
                    };
                    ccsInfoStage.create(insertInfoStage);
                  }
                })
                .catch((err) => {
                  res.status(500).send({
                    message:
                      err.errors[0].message ||
                      "Some error occured while creating data",
                  });
                });

              res.send({
                message: "Unit Updated",
              });
            })
            .catch((err) => {
              res.status(500).send({
                message:
                  err.errors[0].message ||
                  "Some error occured while creating data",
              });
            });
        } else {
          CCSUnit.create(r, { logging: logFunc })
            .then((data) => {
              const query = arrData[0];
              insertLogs.status = "Ok";
              insertLogs.stackTrace = null;
              const {
                unitId,
                serial,
                firmwareVersion,
                hardwareVersion,
                wifiVersion,
                cfmSetPoint,
                elevation,
                description,
                model,
                minimum_cfm_set_pt,
                maximum_cfm_set_pt,
              } = data;

              const refineQuery = query.split("VALUES")[0];
              const queryRes =
                refineQuery +
                `VALUES (${unitId},${serial},${model},${firmwareVersion},${hardwareVersion},${wifiVersion},${cfmSetPoint},${elevation},${description},
                  ${minimum_cfm_set_pt},${maximum_cfm_set_pt})`;
              insertLogs.query = queryRes;

              dbFrontendLogs(insertLogs);

              CCSUnit.findOne({
                where: {
                  serial: data.serial,
                },
              })
                .then((getInfo) => {
                  const insertInfoStage = {
                    unitId: getInfo.unitId,
                    ccs_serial: getInfo.serial,
                    cfmSetPoint: getInfo.cfmSetPoint,
                    elevationSetPoint: getInfo.elevation,
                    model_type: getInfo.model,
                    firmware_version: getInfo.firmwareVersion,
                    minimum_cfm_set_pt: getInfo.minimum_cfm_set_pt,
                    maximum_cfm_set_pt: getInfo.maximum_cfm_set_pt,
                    data_available: true,
                  };

                  ccsInfoStage
                    .create(insertInfoStage)
                    .then((infoInsert) => {
                      res.send({
                        message: "Data Inserted",
                      });
                    })
                    .catch((err) => {
                      res.status(500).send({
                        message:
                          err.errors[0].message ||
                          "Some error occured while creating data",
                      });
                    });
                })
                .catch((err) => {
                  res.send(err);
                });
            })
            .catch((err) => {
              insertLogs.status = err.errors[0].message;
              insertLogs.stackTrace = err.stack;
              dbFrontendLogs(insertLogs);
              res.status(500).send({
                message:
                  err.errors[0].message ||
                  "Some error occured while creating data",
              });
            });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.errors[0].message || "Some error occured while creating data",
        });
      });
  } else {
    res.send({
      message: "Serial should not be empty",
    });
  }
};

// Get Api to check the given unit is valid or not

exports.isValidUnit = async (req, res) => {
  var token = req.headers.authorization;
  const { ccsSerial } = req.query;
  if (token) {
    token = token.slice(7, token.length);
    var decoded = jwt.verify(token, "the-super-strong-secrect");
  }

  const dateTime = currDateTime();

  const insertLogs = {
    userId: decoded.id,
    logDate: dateTime,
    action: "Get",
    apiEndpoint:
      decoded.instance_url + `api/isValidUnit?ccsSerial=${ccsSerial}`,
    payload: `{
      ccsSerial:${ccsSerial}
    }`,
  };

  const arrData = [];
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  CCSUnit.findAll({
    where: {
      serial: ccsSerial,
    },
    logging: logFunc,
  })
    .then((data) => {
      const query = arrData[0];
      insertLogs.status = "Ok";
      insertLogs.stackTrace = null;
      insertLogs.query = query;
      dbFrontendLogs(insertLogs);
      if (data.length > 0) {
        res.json({
          registered: ccsSerial !== "CCS-123456",
          unitExists: true,
        });
      } else {
        res.json({
          registered: false,
          unitExists: false,
        });
      }
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

// APIs to update unit data

exports.updateUnit = async (req, res) => {
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
    apiEndpoint: decoded.instance_url + "api/units/update",
    payload: null,
  };

  const arrData = [];
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  CCSUnit.findAll({
    where: {
      unitId: req.body.unitId,
    },
  })
    .then((unitData) => {
      if (unitData.length > 0) {
        CCSUnit.update(r, {
          where: {
            unitId: req.body.unitId,
          },
          logging: logFunc,
        })
          .then((data) => {
            CCSUnit.findAll({
              where: {
                unitId: req.body.unitId,
              },
            })
              .then((updateUnit) => {
                var insertInfoStage = {
                  unitId: updateUnit[0].unitId,
                  ccs_serial: updateUnit[0].serial,
                  cfmSetPoint: r.cfmSetPoint,
                  elevationSetPoint: r.elevationSetPoint,
                  model_type: r.model,
                  firmware_version: updateUnit[0].firmwareVersion,
                  data_available: r.data_available,
                  minimum_cfm_set_pt: r.minimum_cfm_set_pt,
                  maximum_cfm_set_pt: r.maximum_cfm_set_pt,
                  soft_power_off: r.soft_power_off,
                };
                const query = arrData[0];
                insertLogs.status = "Ok";
                insertLogs.stackTrace = null;
                //insertLogs.query = query;
                dbFrontendLogs(insertLogs);

                ccsInfoStage
                  .findOne({
                    where: {
                      unitId: r.unitId,
                    },
                  })
                  .then((isInfoData) => {
                    if (isInfoData) {
                      ccsInfoStage
                        .update(insertInfoStage, {
                          where: {
                            unitId: r.unitId,
                          },
                        })
                        .then((data) => {
                          res.send({
                            message: "Unit Updated",
                          });
                        })
                        .catch((err) => {
                          res.status(500).send({
                            message: "Some error occured while creating data",
                          });
                        });
                    } else {
                      ccsInfoStage
                        .create(insertInfoStage)
                        .then((infoInsert) => {
                          res.send({
                            message: "Info Sent to Unit",
                          });
                        })
                        .catch((err) => {
                          res.status(500).send({
                            message:
                              err.errors[0].message ||
                              "Some error occured while creating data",
                          });
                        });
                    }
                  })
                  .catch((err) => {
                    res.send(err);
                  });
              })
              .catch((err) => {
                res.send(err);
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
      } else {
        res.send({
          message: "UnitId is not valid",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while creating data",
      });
    });
};

// APIs to update unit data from ws server

exports.updateWSUnit = async (req, res) => {
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
    apiEndpoint: decoded.instance_url + "api/units/ws/update",
    payload: null,
  };

  const arrData = [];
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  CCSUnit.findAll({
    where: {
      unitId: req.body.unitId,
    },
  })
    .then((unitData) => {
      if (unitData.length > 0) {
        CCSUnit.update(r, {
          where: {
            unitId: req.body.unitId,
          },
          logging: logFunc,
        })
          .then((data) => {
            CCSUnit.findAll({
              where: {
                unitId: req.body.unitId,
              },
            })
              .then(() => {
                const query = arrData[0];
                insertLogs.status = "Ok";
                insertLogs.stackTrace = null;
                //insertLogs.query = query;
                dbFrontendLogs(insertLogs);
                res.json({ status: !0 });
              })
              .catch((err) => {
                res.send(err);
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
      } else {
        res.send({
          message: "UnitId is not valid",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while creating data",
      });
    });
};

// APIs to soft delete the units

exports.deleteUnit = async (req, res) => {
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
    apiEndpoint: decoded.instance_url + "api/units/delete",
    payload: null,
  };

  const arrData = [];
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  CCSUnit.findAll({
    where: {
      unitId: req.body.unitId,
    },
  })
    .then((unitData) => {
      if (unitData.length > 0) {
        CCSUnit.update(r, {
          where: {
            unitId: req.body.unitId,
          },
          logging: logFunc,
        })
          .then((data) => {
            ccsSystemAssociation.destroy({
              where: {
                unitAssociationId: req.body.unitId,
              },
            });
            res.send({
              message: "Deleted Successfully",
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
      } else {
        res.send({
          message: "UnitId is not valid",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while creating data",
      });
    });
};
