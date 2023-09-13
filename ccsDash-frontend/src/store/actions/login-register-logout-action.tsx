import { systemActions } from "../slices/system-slice";
import { PrepareApiProcedure } from "../../components/common/utils/prepare-api-procedure";
import { fetchDataFromAPI } from "../../services/api-requests";
import { LoginRegister } from "../../models/login-register-model";
import { notificationService } from "../../services/notification-service";

// Login User

export const loginUser = async (userLogin: LoginRegister) => {
  try {

    const apiQuery = PrepareApiProcedure("login", "POST", "login", userLogin);

    const response = await fetch(
      process.env.REACT_APP_API_BASE_URL + apiQuery.api,
      {
        method: apiQuery.request.action,
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/json",
        },
        body:
          apiQuery.request.data === ""
            ? null
            : JSON.stringify(apiQuery.request.data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.statusNum === "3003") {
        /* do something */
      } else {
        errorData.msg === "Password is incorrect!" ?
          notificationService.sendNotification("error", `Password is incorrect`) :
          errorData.msg === "Email id is incorrect!" ? notificationService.sendNotification("error", `Email id is incorrect!`)
            : notificationService.sendNotification("error", `Invalid Credentials`)
      }
      return null;
    }

    const data = await response.json();

    data.message === "Maximum number of devices used!" ?
    notificationService.sendNotification("error", `Maximum number of devices used!`) : data
      ? notificationService.sendNotification("success", `Login Successfully`)
      : notificationService.sendNotification("error", `Invalid Credentials`);

        const IpAddress = data.IpAddress;
        const access_token = data.access_token;
        const email = userLogin.email;
        const role = data.role;
        const userName = data.userName;
      
        localStorage.setItem("token", access_token);
      
        localStorage.setItem("IpAddress", IpAddress);

        localStorage.setItem("email", email);
        
        localStorage.setItem("role", role);

        localStorage.setItem("userName", userName);
      
      return [data];
  } catch (e) {
    console.log(e);
  }
};

// Logout User

export const logoutUser = async (userLogout: LoginRegister) => {
  try {

    const apiQuery = PrepareApiProcedure("logout", "POST", "logout", userLogout);

    const response = await fetch(
      process.env.REACT_APP_API_BASE_URL + apiQuery.api,
      {
        method: apiQuery.request.action,
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/json",
        },
        body:
          apiQuery.request.data === ""
            ? null
            : JSON.stringify(apiQuery.request.data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.statusNum === "3003") {
        /* do something */
      } else {
        notificationService.sendNotification("error", `Error occur during login`);
      }
      return null;
    }

    const data = await response.json();
    (data && (data.message === "Logout Successfully!" || data.message === "Already Logout!"))
      ? notificationService.sendNotification("success", `Logout Successfully`)
      : notificationService.sendNotification("error", `Some error occur during login`);
      
      return data;
  } catch (e) {
    console.log(e);
  }
};

// Get IpAddress

export const getIpAddressFunc = async () => {
  try {
    const response = await fetch(
      `https://ipapi.co/json`,
      {
        method: "GET",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.statusNum === "3003") {
        /* do something */
      } else {
        notificationService.sendNotification("error", `IpAddress is not getting`);
      }
      return null;
    }

    const data = await response.json();

    const IpSend = data.ip
    return IpSend;
  } catch (e) {
    console.log(e);
  }
};

// Register User

export const registerUser = async (userRegister: LoginRegister) => {
  try {

    const apiQuery = PrepareApiProcedure("register", "POST", "register", userRegister);

    const response = await fetch(
      process.env.REACT_APP_API_BASE_URL + apiQuery.api,
      {
        method: apiQuery.request.action,
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/json",
        },
        body:
          apiQuery.request.data === ""
            ? null
            : JSON.stringify(apiQuery.request.data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.statusNum === "3003") {
        /* do something */
      } else {
        errorData.message === "Email id already exists" ?
          notificationService.sendNotification("error", `Email id already exists`) :
          notificationService.sendNotification("error", `Please enter all details for adding user`);
      }
      return null;
    }

    const data = await response.json();

    data.message === "Email id already exists" ? 
      notificationService.sendNotification("error", `Email id already exists`) : data ?
        notificationService.sendNotification("success", `User Added Successfully`) :
        notificationService.sendNotification("error", `Please enter all details for adding user`)
      
      return data;
  } catch (e) {
    console.log(e);
  }
};
