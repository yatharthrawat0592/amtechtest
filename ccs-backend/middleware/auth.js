const jwt = require("jsonwebtoken");
const validateUser = require("../helper/validateUser.js");

// Verify token

exports.verifyJwtToken = async (req, res, next) => {
  console.log("Check_Auth");
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

        const response = await validateUser(req.headers, req, res);
        console.log("Response : ", response);
        if (response === true) {
          next();
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
