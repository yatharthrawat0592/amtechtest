const db = require("../models");
const sequelize = db.sequelize;
const Op = db.Sequelize.Op;
const UserInfo = db.userRegister;

const validateUser = async (headers) => {
  const email = headers["x-username"];
  const IpAddress = headers["x-ip-address"];

  const data = await UserInfo.findAll({
    where: {
      [Op.and]: [{ IpAddress: IpAddress }, { email: email }],
    },
  });
  return data.length > 0 && data[0].is_active === 1 ? !0 : !1;
};

module.exports = validateUser;
