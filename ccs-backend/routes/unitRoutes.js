const { verifyJwtToken } = require("../middleware/auth.js");
const { validateRole } = require("../middleware/validateRole.js");

const unitRoutes = (app) => {
  const auth = verifyJwtToken;
  const validateRoleManager = validateRole;

  const units = require("../controllers/unit.controller.js");
  var router = require("express").Router();

  // Get all Unit data
  router.get("/units/", units.getCCSUnit);

  // Get Unit data by Uid
  router.get("/units/latestData/:unitId", units.latestDataByUnitId);

  // Create Unit data by Uid and time range
  router.post("/units/create", units.createUnit);

  // Update unit data APIs
  router.put("/units/update", units.updateUnit);

  // Update unit data APIs
  router.put("/units/ws/update", units.updateWSUnit);

  // Get Api to check the given unit is valid or not (restrict for Manager role)
  router.get("/isValidUnit", validateRoleManager, units.isValidUnit);

  // Soft delete the unit
  router.put("/units/delete", units.deleteUnit);

  app.use("/api", auth, router);
};
module.exports = unitRoutes;
