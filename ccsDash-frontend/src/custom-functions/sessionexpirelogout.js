import { logoutUser } from "../store/actions/login-register-logout-action";

const sessionexpirelogout = async () => {
  const IpAddress = localStorage.getItem("IpAddress");
  const email = localStorage.getItem("email");

  const loginObj = {
    email: email,
    IpAddress: IpAddress,
  };
  const resp = await logoutUser(loginObj);
  return resp;
};

export default sessionexpirelogout;
