const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const unitRoutes = require("./routes/unitRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const dataRoutes = require("./routes/dataRoutes");
const systemRoutes = require("./routes/systemRoutes.js");
const errRoutes = require("./routes/errorRoutes.js");
const infoStageRoutes = require("./routes/infoStageRoutes.js");
const ccsfirmwareRoutes = require("./routes/ccsfirmwareRoutes.js");
const bodyParser = require("body-parser");
const db = require("./models");

/*** middleware imports ***/
//import { requestLogger, unknownEndpoint, errorHandler } from './services/middleware.js';

//dotenv.config(corsOptions);

const app = express();

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

/* app.use(forms.array()); */

app.use(express.static("public"));

/* Use cors middleware to allow server to run on a different port than website */

app.use(cors());

/* Activate the json parser 
   allows use of JSON by the client*/
app.use(express.json());

/* enable custom middleware */
//app.use(requestLogger);
//app.use(errorHandler);
//app.use(unknownEndpoint);

app.get("/", async (req, res) => {
  res.json("hello world");
});

app.options("/api/isalive", (req, res) => {
  res.send(200);
});

db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// User routes
userRoutes(app);
// Data routes
dataRoutes(app);
// Unit routes
unitRoutes(app);
// System routes
systemRoutes(app);
// Error routes
errRoutes(app);
// CcsInfoStage routes
infoStageRoutes(app);
// Ccsfirmware routes
ccsfirmwareRoutes(app);

const PORT = process.env.PORT || process.env.CCS_SERVER_PORT;

app.listen(PORT, () => {
  console.log(
    `Connected to Backend @ ${process.env.CCS_URI}:${process.env.CCS_SERVER_PORT}`
  );
});
