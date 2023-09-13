const db = require("../models");
const CCSUnit = db.ccsUnit;
const CCS_UnitData = db.ccsUnitData;
const CCS_System = db.ccsSystem;
const SystemUnitAssociation = db.systemUnitAssociation;
const bcrypt = require("bcryptjs");
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const getSqlDateTime = require("../services/utils.js");
const dbFrontendLogs = require("../middleware/dbFrontendLogs.js");
const currDateTime = require("../services/utils.js");

// Get all System data
// routes : /systems/

exports.getAllCcsSystem = async (req, res) => {
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
    apiEndpoint: decoded.instance_url + "api/systems",
    payload: null,
  };

  const arrData = [];
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  CCS_System.findAll({ logging: logFunc })
    .then((data) => {
      console.log("Shubham:", data);
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

// Get all units associated with this system ID

exports.getAssociatedUnitsById = async (req, res) => {
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
      `api/system/associatedUnits/${req.params.systemId}`,
    payload: `{systemAssociationId:${req.params.systemId}}`,
  };

  const arrData = [];
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  SystemUnitAssociation.findAll({
    attributes: ["unitAssociationId"],
    where: {
      systemAssociationId: [req.params.systemId],
    },
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

// Get all data of associatedUnits

exports.getAllSystemUnitAssociation = async (req, res) => {
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
    apiEndpoint: decoded.instance_url + `api/system/associatedUnits`,
    payload: null,
  };

  const arrData = [];
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  SystemUnitAssociation.findAll({ logging: logFunc })
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

// Insert associate record by system id

exports.createUnitSystemAssociation = async (req, res) => {
  var token = req.headers.authorization;
  if (token) {
    token = token.slice(7, token.length);
    var decoded = jwt.verify(token, "the-super-strong-secrect");
  }

  const currentDateTime = currDateTime();

  const r = req.body;
  const values = {
    systemAssociationId: req.params.systemId,
    unitAssociationId: r.unitId,
  };

  const insertLogs = {
    userId: decoded.id,
    logDate: currentDateTime,
    action: "Post",
    apiEndpoint:
      decoded.instance_url + `system/associatedUnits/${req.params.systemId}`,
    payload: `{systemAssociationId:${req.params.systemId},  
    unitAssociationId:${r.unitId}}`,
  };
  const arrData = [];
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  SystemUnitAssociation.create(values, { logging: logFunc })
    .then((data) => {
      const query = arrData[0];
      insertLogs.status = "Ok";
      insertLogs.stackTrace = null;

      const { associationId, systemAssociationId, unitAssociationId } = data;
      const refineQuery = query.split("VALUES")[0];
      const queryRes =
        refineQuery +
        `VALUES (${associationId},${systemAssociationId},${unitAssociationId})`;
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

// Insert data into ccssystem

exports.insertRecordsCcsSystem = async (req, res) => {
  var token = req.headers.authorization;
  if (token) {
    token = token.slice(7, token.length);
    var decoded = jwt.verify(token, "the-super-strong-secrect");
  }

  const currentDateTime = currDateTime();

  const r = req.body;
  const values = {
    dateCreated: getSqlDateTime().toString(),
    createdBy: r.createdBy,
    description: r.description,
  };

  const insertLogs = {
    userId: decoded.id,
    logDate: currentDateTime,
    action: "Post",
    apiEndpoint: decoded.instance_url + "api/systems/new",
    payload: `{createdBy:${r.createdBy},
    description:${r.description}`,
  };

  const arrData = [];
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  CCS_System.create(values, { logging: logFunc })
    .then((data) => {
      if (data) {
        var { dateCreated, createdBy, description } = data;
        CCS_System.findAll({
          attributes: ["systemId"],
          order: [["dateCreated", "DESC"]],
          limit: 1,
        })
          .then((data) => {
            const query = arrData[0];
            const refineQuery = query.split("VALUES")[0];
            const queryRes =
              refineQuery +
              `VALUES (${data[0].systemId},${dateCreated},${createdBy},${description})`;

            insertLogs.payload =
              insertLogs.payload + `,systemId:${data[0].systemId}}`;
            insertLogs.query = queryRes;
            insertLogs.status = "Ok";
            insertLogs.stackTrace = null;
            dbFrontendLogs(insertLogs);
            res.json(data);
          })
          .catch((err) => {
            insertLogs.status = err.message;
            insertLogs.stackTrace = err.stack;
            dbFrontendLogs(insertLogs);
            res.status(500).send({
              message:
                err.message || "Some eror occured while fteching unit system",
            });
          });
      }
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

// Delete record from tlbccssystem and tblccsunitassociation

exports.deleteSystem = async (req, res) => {
  var token = req.headers.authorization;
  const { systemId } = req.body;
  if (token) {
    token = token.slice(7, token.length);
    var decoded = jwt.verify(token, "the-super-strong-secrect");
  }

  const currentDateTime = currDateTime();

  const arrData = [];
  let message = "";
  let status = 200;
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  try {
    // if id is present in asscoated table else normal delete from system table
    await SystemUnitAssociation.destroy({
      where: { systemAssociationId: systemId },
      logging: logFunc,
    });

    const query = arrData[0];

    const insertLogs = {
      userId: decoded.id,
      logDate: currentDateTime,
      action: "Delete",
      apiEndpoint: decoded.instance_url + "api/systems/delete",
      payload: `{systemId:${systemId}}`,
    };

    insertLogs.stackTrace = null;
    insertLogs.query = query;

    // if (deleteInfo > 0) {
    await CCS_System.destroy({
      where: { systemId: systemId },
    });

    insertLogs.status = "Ok";
    dbFrontendLogs(insertLogs);
    message = "Deleted successfully";
    // } else {
    //   insertLogs.status = "Invalid systemId";
    //   dbFrontendLogs(insertLogs);
    //   message = "SystemId is not valid";
    // }
  } catch (err) {
    insertLogs.status = err.message;
    insertLogs.stackTrace = err.stack;
    dbFrontendLogs(insertLogs);
    status = 500;
    message = err.message || "Some eror occured while fteching ccs unit";
  }

  res.send({
    message: message,
  });
};

// Update record from tblsccssystem

exports.updateSystem = async (req, res) => {
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
    apiEndpoint: decoded.instance_url + "api/systems/update",
    payload: null,
  };

  const arrData = [];
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  CCS_System.findAll({
    where: {
      systemId: r.systemId,
    },
  })
    .then((recordSystem) => {
      if (recordSystem.length > 0) {
        CCS_System.update(r, {
          where: {
            systemId: r.systemId,
          },
          logging: logFunc,
        })
          .then((data) => {
            const query = arrData[0];
            insertLogs.status = "Ok";
            insertLogs.stackTrace = null;
            //dbFrontendLogs(insertLogs);

            const associatedUnit = [];

            SystemUnitAssociation.destroy({
              where: { systemAssociationId: r.systemId },
            })
              .then((updateData) => {
                console.log("Deleted");
              })
              .catch((err) => {
                console.log("Error:", err);
              });

            const units = r.unitWithIds;
            units.forEach((item, idx) => {
              const values = {
                systemAssociationId: r.systemId,
                unitAssociationId: item.unitId,
              };

              SystemUnitAssociation.create(values);
            });

            res.send({
              message: "System Updated",
            });
          })
          .catch((err) => {
            insertLogs.status = err.message;
            insertLogs.stackTrace = err.stack;
            //dbFrontendLogs(insertLogs);
            res.status(500).send({
              message: err.message || "Some error occured while creating data",
            });
          });
      } else {
        res.send({
          message: "System Id is not valid",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while creating data",
      });
    });
};

// Get populated record for tblccssystem

exports.getccsSystemRecords = async (req, res) => {
  var token = req.headers.authorization;
  if (token) {
    token = token.slice(7, token.length);
    var decoded = jwt.verify(token, "the-super-strong-secrect");
  }
  const dateTime = currDateTime();

  const r = req.params;

  const insertLogs = {
    userId: decoded.id,
    logDate: dateTime,
    action: "Get",
    apiEndpoint: decoded.instance_url + `api/systems/pupulate/${r.description}`,
    payload: `{
      description:${r.description}
    }`,
  };

  const arrData = [];
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  CCS_System.findAll({
    where: {
      description: r.description,
    },
    logging: logFunc,
  })
    .then((systemData) => {
      if (systemData.length > 0) {
        const query = arrData[0];
        insertLogs.status = "Ok";
        insertLogs.stackTrace = null;
        insertLogs.query = query;
        const response = systemData[0];
        const associatedRes = [];
        SystemUnitAssociation.findAll({
          where: {
            systemAssociationId: response.systemId,
          },
        })
          .then((associateData) => {
            associateData.forEach((item, idx) => {
              associatedRes.push(item.dataValues);
            });
            response.dataValues.associatedUnits = associatedRes;
            res.send(response);
          })
          .catch((err) => {
            console.log("Error:", err);
          });
        dbFrontendLogs(insertLogs);
      } else {
        insertLogs.status = err.message;
        insertLogs.stackTrace = err.stack;
        dbFrontendLogs(insertLogs);
        res.send({
          message: "Description is not valid",
        });
      }
    })
    .catch((err) => {
      insertLogs.status = err.message;
      insertLogs.stackTrace = err.stack;
      dbFrontendLogs(insertLogs);
      res.status(500).send({
        message: "Description is not valid",
      });
    });
};
