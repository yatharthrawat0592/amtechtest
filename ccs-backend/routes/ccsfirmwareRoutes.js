const { verifyJwtToken } = require("../middleware/auth.js");
const { validateRole } = require("../middleware/validateRole.js");
const multer = require("multer");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now() + ".bin");
    },
  }),
}).single("files");

const ccsfirmwareRoutes = (app) => {
  const auth = verifyJwtToken;
  const validateRoleManager = validateRole;

  const ccsFirmware = require("../controllers/ccsFirmware.controller.js");
  var router = require("express").Router();

  // Get ccsFirmware by firmwareVersion
  router.get("/getCcsFirmware/:firmwareVersion", ccsFirmware.getCcsFirmware);

  // Insert into table tblCcsFirmware (restrict for Manager role)
  router.post(
    "/createCcsFirmware",
    validateRoleManager,
    upload,
    ccsFirmware.createCcsFirmware
  );

  // Get the latest firmware version
  router.get("/getLatestFirmwareActive", ccsFirmware.getLatestFirmwareActive);

  // Delete firmware from by id
  router.delete("/deleteFirmware", ccsFirmware.deleteFirmware);

  // Get all the ccsFirmware
  router.get("/getallccsFirmware", ccsFirmware.getallccsFirmware);

  // Autopupulate firmware fields by firmwareId
  router.get("/getPopulatedFirmware", ccsFirmware.getPopulatedFirmware);

  // Update firmware by firmwareId
  router.put("/updateFirmware", ccsFirmware.updateFirmware);

  app.use("/api", auth, router);
};
module.exports = ccsfirmwareRoutes;
