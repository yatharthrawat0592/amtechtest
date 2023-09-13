const jwt = require("jsonwebtoken");
const express = require("express");

// Token generation

exports.generateJwtToken = (Id, scope, req, role) => {
  let expireTime = new Date();
  let no_of_months = 1;

  const app = express();

  const expire_time = new Date(
    expireTime.setMonth(expireTime.getMonth() + no_of_months)
  );

  const expire_timeSec = expireTime.setMonth(
    expireTime.getMonth() + no_of_months
  );

  const serverInstance = req.headers.host;
  const payload = {
    id: Id,
    access_token: "bearer token",
    signature: null,
    scope: scope,
    role: role,
    instance_url: `https://${serverInstance}/`,
    token_type: "Bearer",
    issued_at: new Date(),
    expires_at: expire_time,
    msg: "Ok",
  };

  const token = jwt.sign(payload, "the-super-strong-secrect", {
    expiresIn: expire_timeSec,
  });

  return token;
};
