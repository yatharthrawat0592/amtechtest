const { verifyJwtToken } = require("../middleware/auth.js");

const userRoutes = (app) => {
  const user = require("../controllers/data.controller.js");
  const auth = verifyJwtToken;

  var router = require("express").Router();

  // Get all Unit data
  router.get("/", user.findAllData);

  // Get Unit data by Uid
  router.get("/:unitId", user.findOneUnitId);

  // Get Unit data by Uid and time range
  router.get("/:unitId/:timeRangeFrom/:timeRangeTo", user.findUnitIdRange);

  // Get Unit data by time range
  router.get("/:timeRangeFrom/:timeRangeTo", user.findUnitDataRange);

  // Insert Unit_data
  router.post("/:unitId", user.createUnitData);

  app.use("/api/data", auth, router);
};
module.exports = userRoutes;
