const userRoutes = (app) => {
  const user = require("../controllers/user.controller.js");

  var router = require("express").Router();

  // register user
  router.post("/register", user.create);

  // login user for APIs
  router.post("/login", user.LoginApi);

  // login user for WebSockets
  router.post("/login/websockets", user.LoginWebSocket);

  // logout APIs
  router.post("/logout", user.Logout);

  app.use("/api", router);
};

module.exports = userRoutes;
