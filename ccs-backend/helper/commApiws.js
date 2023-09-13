const db = require("../models");
const jwt = require("jsonwebtoken");
const { generateJwtToken } = require("./generateJwtToken.js");
const sequelize = db.sequelize;
const Op = db.Sequelize.Op;
const Users = db.users;

const commApiws = async (
  bResult,
  UserInfo,
  req,
  res,
  scope,
  emailId,
  id,
  role,
  userName,
  checkedWebSocket
) => {
  var scopeInfo = scope;
  var req = req;

  var user_id = id;
  var user_role = role;

  var user_Name = userName;

  if (bResult) {
    UserInfo.findAll({ where: { email: emailId } })
      .then((data) => {
        const r = data[0];
        // If token and Ip then create session
        if (data[0].token) {
          UserInfo.findAll({ where: { IpAddress: req.body.IpAddress } })
            .then((data) => {
              if (data.length == 0) {
                UserInfo.findAll({
                  attributes: [
                    [sequelize.fn("COUNT", sequelize.col("count")), "count"],
                  ],
                  raw: true,
                  where: { email: emailId },
                })
                  .then((data) => {
                    const countRefine = data[0].count + 1;

                    if (checkedWebSocket === true) {
                      const diffDevice = {
                        UserId: user_id,
                        first_name: r.first_name,
                        last_name: r.last_name,
                        email: r.email,
                        password: r.password,
                        IpAddress: req.body.IpAddress,
                        token: r.token,
                      };
                      UserInfo.create(diffDevice)
                        .then((data) => {
                          // Incapsulate in token when it generate

                          Users.findAll({
                            where: { id: data.UserId },
                          })
                            .then((userinfoData) => {
                              const role = userinfoData[0].role;
                              var token = generateJwtToken(
                                data.id,
                                scopeInfo,
                                req,
                                role
                              );
                              const decoded = jwt.verify(
                                token,
                                "the-super-strong-secrect"
                              );

                              var token = token;

                              UserInfo.update(
                                {
                                  token: token,
                                  is_active: true,
                                },
                                {
                                  where: {
                                    id: data.id,
                                  },
                                }
                              )
                                .then((data) => {
                                  console.log("Data:", data);
                                })
                                .catch((err) => {
                                  console.log("Error:", err);
                                });

                              const {
                                id,
                                signature,
                                scope,
                                instance_url,
                                token_type,
                                issued_at,
                                expires_at,
                              } = decoded;

                              return res.status(200).send({
                                msg: "Record Inserted!",
                                access_token: token,
                                id: id,
                                signature: signature,
                                scope: scope,
                                instance_url: instance_url,
                                token_type: token_type,
                                issued_at: issued_at,
                                expires_at: expires_at,
                                IpAddress: req.body.IpAddress,
                                role: user_role,
                                userName: user_Name,
                              });
                            })
                            .catch((err) => {
                              res.send(err);
                            });
                        })
                        .catch((err) => {
                          res.send(err);
                        });
                    } else {
                      if (countRefine < 4) {
                        const diffDevice = {
                          UserId: user_id,
                          first_name: r.first_name,
                          last_name: r.last_name,
                          email: r.email,
                          password: r.password,
                          IpAddress: req.body.IpAddress,
                          token: r.token,
                        };
                        UserInfo.create(diffDevice)
                          .then((data) => {
                            // Incapsulate in token when it generate

                            Users.findAll({
                              where: { id: data.UserId },
                            })
                              .then((userinfoData) => {
                                const role = userinfoData[0].role;
                                var token = generateJwtToken(
                                  data.id,
                                  scopeInfo,
                                  req,
                                  role
                                );
                                const decoded = jwt.verify(
                                  token,
                                  "the-super-strong-secrect"
                                );

                                var token = token;

                                UserInfo.update(
                                  {
                                    token: token,
                                    is_active: true,
                                  },
                                  {
                                    where: {
                                      id: data.id,
                                    },
                                  }
                                )
                                  .then((data) => {
                                    console.log("Data:", data);
                                  })
                                  .catch((err) => {
                                    console.log("Error:", err);
                                  });

                                const {
                                  id,
                                  signature,
                                  scope,
                                  instance_url,
                                  token_type,
                                  issued_at,
                                  expires_at,
                                } = decoded;

                                return res.status(200).send({
                                  msg: "Record Inserted!",
                                  access_token: token,
                                  id: id,
                                  signature: signature,
                                  scope: scope,
                                  instance_url: instance_url,
                                  token_type: token_type,
                                  issued_at: issued_at,
                                  expires_at: expires_at,
                                  IpAddress: req.body.IpAddress,
                                  role: user_role,
                                  userName: user_Name,
                                });
                              })
                              .catch((err) => {
                                res.send(err);
                              });
                          })
                          .catch((err) => {
                            res.send(err);
                          });
                      } else {
                        res.send({
                          message: "Maximum number of devices used!",
                        });
                      }
                    }
                  })
                  .catch((err) => {
                    res.send(err);
                  });
              } else {
                UserInfo.findAll({
                  where: {
                    [Op.and]: [
                      { IpAddress: req.body.IpAddress },
                      { email: req.body.email },
                    ],
                  },
                })
                  .then((data) => {
                    if (data.length > 0) {
                      var token = data[0].token;
                      const decoded = jwt.verify(
                        token,
                        "the-super-strong-secrect"
                      );
                      const {
                        id,
                        signature,
                        scope,
                        instance_url,
                        token_type,
                        issued_at,
                        expires_at,
                      } = decoded;

                      return res.status(200).send({
                        msg: "Logged in!",
                        access_token: token,
                        id: id,
                        signature: signature,
                        scope: scope,
                        instance_url: instance_url,
                        token_type: token_type,
                        issued_at: issued_at,
                        expires_at: expires_at,
                        IpAddress: req.body.IpAddress,
                        role: user_role,
                        userName: user_Name,
                      });
                    } else {
                      return res.status(401).send({
                        msg: "Email id and Ip Address does not match!",
                      });
                    }
                  })
                  .catch((err) => {
                    return res.status(401).send({
                      msg: err.message,
                    });
                  });
              }
            })
            .catch((err) => {
              res.send(err);
            });
        } else {
          // If token does not exists then it will generate the new token
          Users.findAll({
            where: { id: data[0].UserId },
          })
            .then((userinfoData) => {
              const role = userinfoData[0].role;

              var token = generateJwtToken(data[0].id, scopeInfo, req, role);
              const decoded = jwt.verify(token, "the-super-strong-secrect");

              UserInfo.findAll({ where: { IpAddress: req.body.IpAddress } })
                .then((data) => {
                  if (data.length == 0) {
                    const {
                      id,
                      signature,
                      scope,
                      instance_url,
                      token_type,
                      issued_at,
                      expires_at,
                    } = decoded;

                    // Update token in ccs_tblCcsusersession

                    UserInfo.update(
                      {
                        token: token,
                        IpAddress: req.body.IpAddress,
                        is_active: true,
                      },
                      {
                        where: {
                          email: emailId,
                        },
                      }
                    )
                      .then((data) => {
                        console.log("Data:", data);
                      })
                      .catch((err) => {
                        console.log("Error:", err);
                      });

                    return res.status(200).send({
                      msg: "Logged in!",
                      access_token: token,
                      id: id,
                      signature: signature,
                      scope: scope,
                      instance_url: instance_url,
                      token_type: token_type,
                      issued_at: issued_at,
                      expires_at: expires_at,
                      IpAddress: req.body.IpAddress,
                      role: user_role,
                      userName: user_Name,
                    });
                  } else {
                    return res.status(401).send({
                      msg: "Ip Address already exists!",
                    });
                  }
                })
                .catch((err) => {
                  return res.status(401).send({
                    msg: err.message,
                  });
                });
            })
            .catch((err) => {
              res.send(err);
            });
        }
      })
      .catch((err) => {
        return res.status(401).send({
          msg: "Username or password is incorrect!",
        });
      });
  }
};

module.exports = commApiws;
