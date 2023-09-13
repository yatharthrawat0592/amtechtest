const { verifyJwtToken } = require("../middleware/auth.js");

const systemRoutes = (app) => {
  const units = require("../controllers/system.controller.js");
  const auth = verifyJwtToken;

  var router = require("express").Router();

  // Get all System data
  router.get("/", units.getAllCcsSystem);

  //Get all units associated with this system ID
  router.get("/associatedUnits/:systemId", units.getAssociatedUnitsById);

  // Get all data of associatedUnits
  router.get("/associatedUnits", units.getAllSystemUnitAssociation);

  // Insert associate record by system id
  router.post("/associatedUnits/:systemId", units.createUnitSystemAssociation);

  // Insert data into ccssystem
  router.post("/new", units.insertRecordsCcsSystem);

  // Update the tblccssystem
  router.put("/update", units.updateSystem);

  // Delete record from tblccssystem and tblccssystemunitassociation
  router.delete("/delete", units.deleteSystem);

  // Get tblccssystem record on the basis of description
  router.get("/pupulate/:description", units.getccsSystemRecords);

  app.use("/api/systems", auth, router);
};
module.exports = systemRoutes;
