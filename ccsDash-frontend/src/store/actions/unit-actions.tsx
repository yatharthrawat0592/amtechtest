/* eslint-disable @typescript-eslint/no-unused-expressions */
import { unitActions } from '../slices/unit-slice';
import { PrepareApiProcedure } from '../../components/common/utils/prepare-api-procedure';
import { fetchDataFromAPI } from '../../services/api-requests';
import { CcsUnitInfo } from '../../models/unit-model';
import { notificationService } from '../../services/notification-service';

/* Get all unit info and store it */
export const getAllUnitInfo = () => {
    return async (dispatch: (arg0: {payload: any; type:string;}) => void) => {
        try {
            console.log("Get all unit info");
            const apiQuery = PrepareApiProcedure('units', 'GET', 'unitInfo', '');
            /* apiQuery is an object */
            const unitInfo = await fetchDataFromAPI(apiQuery);
            console.log('successfully fetched unit info for:', unitInfo);

            if (unitInfo === "jwt expired") {
                return unitInfo;
            }
            else {
                dispatch(unitActions.getAllUnits(
                    {
                        unitInfo: unitInfo
                    }
                ))
            }
        } catch(e) {
            console.log(e);
        }
    }
}

export const createNewUnit = async (unitInfo:CcsUnitInfo) => {
    /* Create a new unit on the server */
    try {        
        const unitInfoUpdate = {
            "description": unitInfo.description,
            "firmwareVersion": unitInfo.firmwareVersion,
            "hardwareVersion": unitInfo.hardwareVersion,
            "wifiVersion": unitInfo.wifiVersion,
            "cfmSetPoint": unitInfo.cfmSetPoint,
            "elevation": unitInfo.elevation,
            "model": unitInfo.model,
            "serial": unitInfo.serial,
            "deleted": 0,
            "minimum_cfm_set_pt": unitInfo.minimum_cfm_set_pt,
            "maximum_cfm_set_pt": unitInfo.maximum_cfm_set_pt
        }
    
        const apiQuery = PrepareApiProcedure('units/create', 'POST', 'unitInfo', unitInfoUpdate);
        const resp = await fetchDataFromAPI(apiQuery);
        resp == null && (notificationService.sendNotification('error', `Duplicate entry`))
        resp === "jwt expired" ? null :
        resp.message === "Data Inserted" || resp.message === "Unit Updated" ? 
            notificationService.sendNotification('success', `Successfully added the new unit`): 
                notificationService.sendNotification('error', `Some error occur during insertion`);
    } catch (e) {
        console.log(e);
    }
}

export const getLatestUnitData = async (unitId:string) => {
    /* get the latest unit data from the specified unit Id */
    try {
        const apiQuery = PrepareApiProcedure(`units/latestData/${unitId}`, 'GET', 'unitData', '');
        let unitData = await fetchDataFromAPI(apiQuery);
        console.log('successfully fetched unit data', unitData);
        return unitData[0];
    } catch (e) {
        console.log(e);
    }
}

export const updateUnits = async (unitUpdate:any) => {
    /* update the unit data */
    const dataUnit = {
        unitId: unitUpdate.unitId,
        cfmSetPoint:unitUpdate.cfmSetPoint,
        description: unitUpdate.description,
        model:unitUpdate.model,
        serial: unitUpdate.serial,
        elevationSetPoint: unitUpdate.elevationSetPoint,
        data_available: 1,
        minimum_cfm_set_pt: unitUpdate.minimum_cfm_set_pt,
        maximum_cfm_set_pt: unitUpdate.maximum_cfm_set_pt,
        soft_power_off: unitUpdate.soft_power_off
    }
    console.log("updating unit with: ");
    console.log(dataUnit);
    try {
        const apiQuery = PrepareApiProcedure(`units/update`, 'PUT', 'unitData', dataUnit);
        let unitData = await fetchDataFromAPI(apiQuery);
        console.log('Unit data updated successfully:', unitData);

        unitData === "jwt expired" ? null :
        unitData === undefined ? notificationService.sendNotification('error', `Unit already exists`) :
        unitData.message === "Unit Updated" ? notificationService.sendNotification('success', `Info Sent to Unit`) :
        unitData.message === "Info Sent to Unit" ? notificationService.sendNotification('success', `Info Sent to Unit`) :
        notificationService.sendNotification('error', `Some error has been occur`)
        return unitData;
    } catch (e) {
        console.log(e);
    }
}

// Delete the unit data

export const deleteUnit = async (unitDelete:any) => {
    /* delete the unit data */
    try {
        const apiQuery = PrepareApiProcedure(`units/delete`, 'PUT', 'unitData', unitDelete);
        let unitData = await fetchDataFromAPI(apiQuery);
        console.log('Unit data deleted successfully:', unitData);

        unitData === "jwt expired" ? null :
        unitData === undefined ? notificationService.sendNotification('error', `Unit already exists`) :
        unitData.message === "Deleted Successfully" ? notificationService.sendNotification('success', `Unit Deleted Successfully`) :
        notificationService.sendNotification('error', `Some error has been occur`)
        return unitData;
    } catch (e) {
        console.log(e);
    }
}