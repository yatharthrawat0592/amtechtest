const jwt = require("jsonwebtoken");
const validateUser = require("../helper/validateUser.js");

// Verify token

exports.validateRole = async (req, res, next) => {
  //Get the token form header

  var token = req.headers["x-auth-token"] || req.headers["authorization"];

  if (!token) {
    return res
      .status(401)
      .json({ msg: "No bearer token, Authorization denied" });
  }

  if (token.startsWith("Bearer") || token.startsWith("bearer")) {
    token = token.slice(7, token.length);

    if (token) {
      try {
        const decoded = jwt.verify(token, "the-super-strong-secrect");
        req.msg = decoded.msg;

        const role = decoded.role;
        const response = await validateUser(req.headers);

        if (response === true && role === "Admin") {
          next();
        } else if (role === "Manager") {
          res.status(401).json({ msg: "Manager does not have access!" });
        } else {
          res.status(401).json({ msg: "User is not active yet!" });
        }
      } catch (err) {
        res.status(401).json({ msg: err.message });
      }
    }
  } else {
    res.status(401).json({ msg: "Please provide bearer token" });
  }
};
