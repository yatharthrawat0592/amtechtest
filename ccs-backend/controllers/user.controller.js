const db = require("../models");
const bcrypt = require("bcryptjs");
const UserInfo = db.userRegister;
const sequelize = db.sequelize;
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const Users = db.users;
const commLoginApiWs = require("../helper/commApiws.js");
const Crypto = require("crypto");

const secret_key = "fd85b494-aaaa";
const secret_iv = "smslt";
const encryptionMethod = "AES-256-CBC";
const key = Crypto.createHash("sha512")
  .update(secret_key, "utf-8")
  .digest("hex")
  .substr(0, 32);
const iv = Crypto.createHash("sha512")
  .update(secret_iv, "utf-8")
  .digest("hex")
  .substr(0, 16);

// Create save API for user

exports.create = async (req, res) => {
  if (
    !req.body.first_name ||
    !req.body.last_name ||
    !req.body.email ||
    !req.body.password ||
    !req.body.role
  ) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Encrypt function
  function encrypt_string(plain_text, encryptionMethod, secret, iv) {
    var encryptor = Crypto.createCipheriv(encryptionMethod, secret, iv);
    var aes_encrypted =
      encryptor.update(plain_text, "utf8", "base64") +
      encryptor.final("base64");
    return Buffer.from(aes_encrypted).toString("base64");
  }

  var encryptedMessage = encrypt_string(
    req.body.password,
    encryptionMethod,
    key,
    iv
  );

  const register = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: encryptedMessage,
    role: req.body.role,
  };

  Users.findAll({ where: { email: req.body.email } })
    .then((data) => {
      if (data.length == 0) {
        Users.create(register)
          .then((dataUser) => {
            register["UserId"] = dataUser.id;
            register["count"] = 1;
            UserInfo.create(register)
              .then((data) => {
                res.send(dataUser);
              })
              .catch((err) => {
                res.status(500).send({
                  message: err.message || "Some error occured while register",
                });
              });
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || "Some error occured while register",
            });
          });
      } else {
        res.status(500).send({
          message: "Email id already exists",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some eror occured while fteching User Info",
      });
    });
};

// Login API for User

exports.LoginApi = (req, res) => {
  Users.findAll({ where: { email: req.body.email } })
    .then((data) => {
      if (data.length > 0) {
        const encryptedMessage = data[0]["password"];
        // Decrypt function
        function decrypt_string(
          encryptedMessage,
          encryptionMethod,
          secret,
          iv
        ) {
          const buff = Buffer.from(encryptedMessage, "base64");
          encryptedMessage = buff.toString("utf-8");
          var decryptor = Crypto.createDecipheriv(encryptionMethod, secret, iv);
          return (
            decryptor.update(encryptedMessage, "base64", "utf8") +
            decryptor.final("utf8")
          );
        }

        var decrptMessage = decrypt_string(
          encryptedMessage,
          encryptionMethod,
          key,
          iv
        );

        if (req.body.IpAddress) {
          if (decrptMessage == req.body.password) {
            const Scope = "api";
            const email = req.body.email;

            const bResult = true;
            const id = data[0].id;
            const role = data[0].role;
            const userName = data[0].first_name;

            commLoginApiWs(
              bResult,
              UserInfo,
              req,
              res,
              Scope,
              email,
              id,
              role,
              userName
            );
          } else {
            return res.status(401).send({
              msg: "Password is incorrect!",
            });
          }
        } else {
          res.status(401).send({
            msg: "IpAddress is incorrect!",
          });
        }
      } else {
        res.status(401).send({
          msg: "Email id is incorrect!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some eror occured while fteching User Info",
      });
    });
};

// Login Web_Socket Api for User

exports.LoginWebSocket = (req, res) => {
  Users.findAll({ where: { email: req.body.email } })
    .then((data) => {
      if (data.length > 0) {
        const encryptedMessage = data[0]["password"];
        // Decrypt function
        function decrypt_string(
          encryptedMessage,
          encryptionMethod,
          secret,
          iv
        ) {
          const buff = Buffer.from(encryptedMessage, "base64");
          encryptedMessage = buff.toString("utf-8");
          var decryptor = Crypto.createDecipheriv(encryptionMethod, secret, iv);
          return (
            decryptor.update(encryptedMessage, "base64", "utf8") +
            decryptor.final("utf8")
          );
        }

        var decrptMessage = decrypt_string(
          encryptedMessage,
          encryptionMethod,
          key,
          iv
        );

        if (req.body.IpAddress) {
          if (decrptMessage == req.body.password) {
            const Scope = "api";
            const email = req.body.email;

            const bResult = true;
            const id = data[0].id;
            const role = data[0].role;
            const userName = data[0].first_name;
            const checkedWebSocket = true;

            commLoginApiWs(
              bResult,
              UserInfo,
              req,
              res,
              Scope,
              email,
              id,
              role,
              userName,
              checkedWebSocket
            );
          } else {
            return res.status(401).send({
              msg: "Password is incorrect!",
            });
          }
        } else {
          res.status(401).send({
            msg: "IpAddress is incorrect!",
          });
        }
      } else {
        res.status(401).send({
          msg: "Email id is incorrect!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some eror occured while fteching User Info",
      });
    });
};

// User Logout
exports.Logout = (req, res) => {
  UserInfo.findAll({
    where: {
      [Op.and]: [{ email: req.body.email }, { IpAddress: req.body.IpAddress }],
    },
  })
    .then((userData) => {
      UserInfo.findAll({
        attributes: [[sequelize.fn("COUNT", sequelize.col("email")), "email"]],
        raw: true,
        where: { email: req.body.email },
      })
        .then((data) => {
          if (data[0].email == 1) {
            UserInfo.update(
              {
                IpAddress: null,
                token: null,
                is_active: false,
                count: 1,
              },
              {
                where: {
                  [Op.and]: [
                    { email: req.body.email },
                    { IpAddress: req.body.IpAddress },
                  ],
                },
              }
            )
              .then((data) => {
                if (data[0] > 0) {
                  res.send({
                    message: "Logout Successfully!",
                  });
                } else {
                  res.send({
                    message: "Already Logout!",
                  });
                }
              })
              .catch((err) => {
                res.status(500).send({
                  message:
                    err.message || "Some eror occured while fteching User Info",
                });
              });
          } else {
            UserInfo.update(
              {
                IpAddress: null,
                token: null,
                email: null,
                count: null,
                is_active: false,
              },
              {
                where: {
                  [Op.and]: [
                    { email: req.body.email },
                    { IpAddress: req.body.IpAddress },
                  ],
                },
              }
            )
              .then((data) => {
                if (data[0] > 0) {
                  res.send({
                    message: "Logout Successfully!",
                  });
                } else {
                  res.send({
                    message: "Already Logout!",
                  });
                }
              })
              .catch((err) => {
                res.status(500).send({
                  message:
                    err.message || "Some eror occured while fteching User Info",
                });
              });
          }
        })
        .catch((err) => {
          res.send(err);
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some eror occured while fteching User Info",
      });
    });
};
