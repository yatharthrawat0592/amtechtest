const { verifyJwtToken } = require("../middleware/auth.js");

const errorRoutes = (app) => {
  const auth = verifyJwtToken;

  const error = require("../controllers/error.controller.js");
  var router = require("express").Router();

  // Create unit error for hardware
  router.post("/uniterror", error.createUnitError);

  // Insert into table unit association
  router.post("/errorassociation", error.createErrorAssociation);

  app.use("/api/error", auth, router);
};
module.exports = errorRoutes;
