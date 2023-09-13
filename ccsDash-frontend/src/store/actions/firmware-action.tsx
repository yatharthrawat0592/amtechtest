/* eslint-disable @typescript-eslint/no-unused-expressions */
import { PrepareApiProcedure } from "../../components/common/utils/prepare-api-procedure";
import { notificationService } from "../../services/notification-service";

import { fetchDataFromAPI } from "../../services/api-requests";
import { AddUpdateFirmware } from "../../models/add-update-firmware-model";

// Add New Firmware

export const addNewFirmware = async (formData: any) => {
  try {
    const apiQuery = PrepareApiProcedure(
      "createCcsFirmware",
      "POST",
      "firmware",
      formData
    );

    const jwtToken = localStorage.getItem("token");

    const IpAddress = localStorage.getItem("IpAddress");
    const email = localStorage.getItem("email");

    const response = await fetch(
      process.env.REACT_APP_API_BASE_URL + apiQuery.api,
      {
        method: apiQuery.request.action,
        headers: {
          Accept: "application/json, text/plain",
          "x-username": `${email}`,
          "x-ip-address": `${IpAddress}`,
          authorization: "Bearer " + jwtToken,
        },
        body: apiQuery.request.data,
      }
    );

    const resp = await response.json();

    resp.msg === "jwt expired" ? null :
    resp.message === "Invalid Firmware Version"
      ? notificationService.sendNotification(
          "error",
          `Invalid Firmware Version`
        )
      : resp.message === "Validation error"
      ? notificationService.sendNotification("error", `Duplicate Firmware File`)
      : resp
      ? notificationService.sendNotification(
          "success",
          `Firmware Added Successfully`
        )
      : notificationService.sendNotification(
          "error",
          `Some error occur during adding firmware`
        );

    if (resp.msg === "jwt expired") {
      return resp.msg;
    }
    else {
      return response;
    }
    
  } catch (e) {
    console.log(e);
  }
};

// Get All the firmware

export const getALLFirmware = async () => {
  try {
    const apiQuery = PrepareApiProcedure(
      `getallccsFirmware`,
      "GET",
      "firmware",
      ""
    );
    let firmwareResponse = await fetchDataFromAPI(apiQuery);

    return firmwareResponse;
  } catch (e) {
    console.log(e);
  }
};

// Get populated firmware data

export const getFirmwarePopulated = async (firmwareName: string) => {
  try {
    const apiQuery = PrepareApiProcedure(
      `getPopulatedFirmware?firmwareName=${firmwareName}`,
      "GET",
      "firmware",
      ""
    );
    let firmwareData = await fetchDataFromAPI(apiQuery);
    return firmwareData;
  } catch (e) {
    console.log(e);
  }
};

// Update Firmware

export const updateNewFirmware = async (updateFirmware: AddUpdateFirmware) => {
  try {
    const apiQuery = PrepareApiProcedure(
      "updateFirmware",
      "PUT",
      "firmware",
      updateFirmware
    );
    const response = await fetchDataFromAPI(apiQuery);

    response === "jwt expired"? null :
    response.message === "Firmware Updated"
      ? notificationService.sendNotification("success", `Updated successfully`)
      : response.message === "Invalid Firmware version"
      ? notificationService.sendNotification(
          "error",
          `Invalid Firmware version`
        )
      : response.message === "Invalid FirmwareId"
      ? notificationService.sendNotification("error", `Invalid Firmware Id`)
      : response === null
      ? notificationService.sendNotification("error", `Duplicate FirmwareName`)
      : notificationService.sendNotification(
          "error",
          `Some error occur during updation`
        );

    getALLFirmware();
    return response;
  } catch (e) {
    console.log(e);
  }
};

// Delete Firmware

export const deleteFirmware = async (firmwareId: object) => {
  try {
    const apiQuery = PrepareApiProcedure(
      `deleteFirmware`,
      "DELETE",
      "firmware",
      firmwareId
    );
    let systemData = await fetchDataFromAPI(apiQuery);
    console.log("Delete successfully", systemData);
    const deletedMsg = systemData.message;

    systemData === "jwt expired" ? null :
    deletedMsg === "Deleted successfully"
      ? notificationService.sendNotification("success", `Deleted successfully`)
      : deletedMsg === "Firmware Id is not valid"
      ? notificationService.sendNotification("error", `SystemId is not valid`)
      : notificationService.sendNotification(
          "error",
          `Some error occurs please check SystemmId`
          );
    if (systemData === "jwt expired") {
      return systemData;
    }
  } catch (e) {
    console.log(e);
  }
};
