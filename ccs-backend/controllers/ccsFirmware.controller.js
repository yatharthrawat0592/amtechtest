const db = require("../models");

const CCS_Firmware = db.ccsFirmWare;
const CCS_Unit = db.ccsUnit;
const Op = db.Sequelize.Op;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sequelize = db.sequelize;
const dbFrontendLogs = require("../middleware/dbFrontendLogs.js");
const currDateTime = require("../services/utils.js");
const { compressBinFirmware } = require("../helper/compressBinFirmware.js");
const multer = require("multer");
const upload = multer();

// Get Ccs_Firmware
//routes - api/getCcsFirmware

exports.getCcsFirmware = async (req, res) => {
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
    apiEndpoint: decoded.instance_url + "api/getCcsFirmware",
    payload: `{ firmwareVersion: ${req.params.firmwareVersion} }`,
  };

  const arrData = [];
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  CCS_Unit.findAll({
    where: { firmwareVersion: req.params.firmwareVersion },
  }).then((data) => {
    if (data.length > 0) {
      CCS_Firmware.findAll({
        where: { firmwareVersion: req.params.firmwareVersion },
        logging: logFunc,
      })
        .then((data) => {
          const query = arrData[0];
          insertLogs.status = "Ok";
          insertLogs.stackTrace = null;
          insertLogs.query = query;
          dbFrontendLogs(insertLogs);
          res.json(data[0]);
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
    } else {
      res.send("Invalid Firmware Version");
    }
  });
};

// Insert Ccs_Firmware
// routes - /api/createCcsFirmware

exports.createCcsFirmware = async (req, res) => {
  var token = req.headers.authorization;
  if (token) {
    token = token.slice(7, token.length);
    var decoded = jwt.verify(token, "the-super-strong-secrect");
  }

  const currentDateTime = currDateTime();

  const r = req.body;

  const genRanHex = (size) =>
    [...Array(size)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("");

  const firmwareId = genRanHex(12);
  // Compress binary file firmware

  const file = req.file;
  const compbincontent = await compressBinFirmware(file);

  const addedFirware = {
    firmwareId: firmwareId,
    firmwareBinary: compbincontent,
    firmwareVersion: r.firmwareVersion,
    firmwareActive: r.firmwareActive,
    firmwareName: r.fileName,
    firmwareUpdatedAt: currentDateTime,
  };

  const insertLogs = {
    userId: decoded.id,
    logDate: currentDateTime,
    action: "Post",
    apiEndpoint: decoded.instance_url + `api/createCcsFirmware`,
    payload: `{firmwareId:${firmwareId},
      firmwareBinary:${compbincontent},
      firmwareVersion:${r.firmwareVersion},
      firmwareActive:${r.firmwareActive},
      firmwareName:${r.fileName},
      firmwareUpdatedAt:${currentDateTime}
     }`,
  };

  const arrData = [];
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  CCS_Firmware.create(addedFirware, { logging: logFunc })
    .then((data) => {
      const query = arrData[0];
      insertLogs.status = "Ok";
      insertLogs.stackTrace = null;
      const {
        firmwareId,
        firmwareBinary,
        firmwareVersion,
        firmwareActive,
        firmwareName,
        firmwareUpdatedAt,
      } = addedFirware;

      const refineQuery = query.split("VALUES")[0];
      const queryRes =
        refineQuery +
        `VALUES (${firmwareId},${firmwareBinary},${firmwareVersion},${firmwareActive},${firmwareUpdatedAt},${firmwareName})`;
      insertLogs.query = queryRes;

      dbFrontendLogs(insertLogs);

      if (data.firmwareActive == true) {
        CCS_Firmware.update(
          {
            firmwareActive: false,
          },
          {
            where: {
              firmwareId: {
                [Op.not]: data.firmwareId,
              },
            },
          }
        )
          .then((data) => {
            console.log("Data:", data);
          })
          .catch((err) => {
            console.log("Error:", err);
          });
      }
      res.send(data);
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

// Get Latest Firmware Version
// routes - /api/getLatestFirmwareActive

exports.getLatestFirmwareActive = async (req, res) => {
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
    apiEndpoint: decoded.instance_url + "api/getLatestFirmwareActive",
    payload: null,
  };

  const arrData = [];
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  CCS_Firmware.findAll({
    where: { firmwareActive: true },
    logging: logFunc,
  })
    .then((data) => {
      const query = arrData[0];
      insertLogs.status = "Ok";
      insertLogs.stackTrace = null;
      insertLogs.query = query;
      dbFrontendLogs(insertLogs);
      res.json(data[0]);
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

// Delete Firmware
// routes - /api/deleteFirmware

exports.deleteFirmware = async (req, res) => {
  var token = req.headers.authorization;
  const { firmwareId } = req.body;
  if (token) {
    token = token.slice(7, token.length);
    var decoded = jwt.verify(token, "the-super-strong-secrect");
  }

  const currentDateTime = currDateTime();

  const arrData = [];
  let status = 200;
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  const insertLogs = {
    userId: decoded.id,
    logDate: currentDateTime,
    action: "Delete",
    apiEndpoint: decoded.instance_url + "api/deleteFirmware",
    payload: `{firmwareId:${firmwareId}}`,
  };

  CCS_Firmware.findAll({
    where: { firmwareId: firmwareId },
  })
    .then((data) => {
      if (data.length > 0) {
        CCS_Firmware.destroy({
          where: { firmwareId: firmwareId },
          logging: logFunc,
        });

        const query = arrData[0];

        insertLogs.stackTrace = null;
        insertLogs.query = query;

        insertLogs.status = "Ok";
        dbFrontendLogs(insertLogs);

        res.send({
          message: "Deleted successfully",
        });
      } else {
        insertLogs.status = "Firmware Id is not valid";
        dbFrontendLogs(insertLogs);
        res.send({
          message: "Firmware Id is not valid",
        });
      }
    })
    .catch((err) => {
      insertLogs.status = err.message;
      insertLogs.stackTrace = err.stack;
      dbFrontendLogs(insertLogs);
      status = 500;
      res.send({
        message: err.message || "Some error occur during deletion",
      });
    });
};

// Get all the ccsFirmware
// routes - /api/getallccsFirmware

exports.getallccsFirmware = async (req, res) => {
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
    apiEndpoint: decoded.instance_url + "api/getallccsFirmware",
    payload: null,
  };

  const arrData = [];
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  CCS_Firmware.findAll({
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

// Get populated firmware by firmwareId
// routes - api/getPopulatedFirmware

exports.getPopulatedFirmware = async (req, res) => {
  var token = req.headers.authorization;
  if (token) {
    token = token.slice(7, token.length);
    var decoded = jwt.verify(token, "the-super-strong-secrect");
  }
  const currentDateTime = currDateTime();

  const { firmwareName } = req.query;

  const insertLogs = {
    userId: decoded.id,
    logDate: currentDateTime,
    action: "Get",
    apiEndpoint: decoded.instance_url + "api/getPopulatedFirmware",
    payload: `{ firmwareName: ${firmwareName} }`,
  };

  const arrData = [];
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  CCS_Firmware.findAll({
    where: { firmwareName: firmwareName },
    logging: logFunc,
  })
    .then((data) => {
      if (data.length > 0) {
        const query = arrData[0];
        insertLogs.status = "Ok";
        insertLogs.stackTrace = null;
        insertLogs.query = query;
        dbFrontendLogs(insertLogs);
        res.json(data[0]);
      } else {
        insertLogs.status = err.message;
        insertLogs.stackTrace = err.stack;
        dbFrontendLogs(insertLogs);
        res.send({
          message: "Invalid firmwareName",
        });
      }
    })
    .catch((err) => {
      insertLogs.status = err.message;
      insertLogs.stackTrace = err.stack;
      dbFrontendLogs(insertLogs);
      res.status(500).send({
        message: "Invalid firmwareName",
      });
    });
};

// Update Firmware by FirmwareId
// routes - api/updateFirmware

exports.updateFirmware = async (req, res) => {
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
    apiEndpoint: decoded.instance_url + "api/updateFirmware",
    payload: null,
  };

  const arrData = [];
  const logFunc = (logs) => {
    var refineQuery = logs.split(":")[1];
    arrData.push(refineQuery);
  };

  CCS_Firmware.findAll({
    where: {
      firmwareId: r.firmwareId,
    },
  })
    .then((firmData) => {
      if (firmData.length > 0) {
        if (r.firmwareActive == 1) {
          CCS_Firmware.update(
            {
              firmwareActive: false,
            },
            {
              where: {
                firmwareId: {
                  [Op.not]: r.firmwareId,
                },
              },
            }
          );
        }

        CCS_Firmware.update(r, {
          where: {
            firmwareId: r.firmwareId,
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
              message: "Firmware Updated",
            });
          })
          .catch((err) => {
            insertLogs.status = err.message;
            insertLogs.stackTrace = err.stack;
            dbFrontendLogs(insertLogs);
            res.status(500).send({
              message: "Duplicate FirmwareName",
            });
          });
      } else {
        res.send({
          message: "Invalid FirmwareId",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occured while fetching firmware data",
      });
    });
};
