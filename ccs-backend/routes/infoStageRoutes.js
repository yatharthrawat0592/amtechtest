const { verifyJwtToken } = require("../middleware/auth.js");

const infoStageRoutes = (app) => {
  const auth = verifyJwtToken;

  const infoStage = require("../controllers/infoStage.controller.js");
  var router = require("express").Router();

  // Get ccsInfoStage
  router.get("/getInfoStage", infoStage.getAllCcsInfoStage);

  // Insert into table ccsInfoStage
  router.post("/createInfoStage", infoStage.createInfoStage);

  // Delete the entry from ccsInfoStage
  router.delete("/deleteInfoStage", infoStage.deleteInfoStage);

  // Update the table ccsInfoStage
  router.put("/updateInfoStage", infoStage.updateInfoStage);

  app.use("/api", auth, router);
};
module.exports = infoStageRoutes;
