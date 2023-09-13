/* eslint-disable @typescript-eslint/no-unused-expressions */
import { systemActions } from '../slices/system-slice';
import { PrepareApiProcedure } from '../../components/common/utils/prepare-api-procedure';
import { fetchDataFromAPI } from '../../services/api-requests';
import { CcsSystem } from '../../models/system-model';
import { notificationService } from '../../services/notification-service';

// const getUnitAssociations = async (systems:CcsSystem[])  => {
//     /* get the unit associations */
//     let apiQuery = '';
//     let unitIds = [];
//     systems.forEach((system) => {
//         apiQuery = PrepareApiProcedure(`systems/associatedUnits/${system.systemId}`, 'GET', 'association', '');
//         const unitIds = await fetchDataFromAPI(apiQuery);
//     })

// }

export const createNewSystem = async (systemInfo:CcsSystem) => {
    try {
        
        let currentDate = new Date();
        const systemInfoUpdate = {
            dateCreated:currentDate,
            createdBy: systemInfo.createdBy,
            description:systemInfo.description,
        }
            const apiQuery = PrepareApiProcedure('systems/new', 'POST', 'system', systemInfoUpdate);
            const resp = await fetchDataFromAPI(apiQuery);
            const newSystemInfo = {...systemInfo, systemId:resp[0].systemId !== undefined ? resp[0].systemId : ''}
            /* update the systems in the store */

            resp === "jwt expired" ? null :
            newSystemInfo ? notificationService.sendNotification('success', `System Added`) :
            notificationService.sendNotification('error', `System is not added`);
            getAllSystems();
        if (resp === "jwt expired") {
            console.log("Testinggggg:",resp)
            return resp;
        }
        else {
            console.log("TestingggggElse")
            return newSystemInfo;   
        }
        } catch (e) {
            console.log(e);
        }
}

export const updateNewSystem = async (updateInfo:CcsSystem) => {
    try {
        const apiQuery = PrepareApiProcedure('systems/update', 'PUT', 'system', updateInfo);
        const response = await fetchDataFromAPI(apiQuery);
        
        response === "jwt expired" ? null : response.message === "System Updated" ? notificationService.sendNotification('success', `Updated successfully`) :
            notificationService.sendNotification('error', `Please check its systemId`);
        
        getAllSystems();
        return response;
        } catch (e) {
            console.log(e);
        }
}


export const associateUnitsToSystem = async (systemInfo:CcsSystem) => {
        let apiQuery = '';
        let resp;
        await systemInfo.ccsUnitId.forEach((unitId) => {
            try {
                apiQuery = PrepareApiProcedure(
                    `systems/associatedUnits/${systemInfo.systemId}`, 
                    'POST', 
                    'system', 
                    {unitId : unitId});
                resp = fetchDataFromAPI(apiQuery);
                console.log(`successfully updated system ${systemInfo.systemId}`, resp);
            } catch (e) {
                console.log(e);
            }
        })
    
}

export const getAllSystems = () => {
    return async (dispatch: (arg0: {payload: any; type: string;}) => void) => {
        try {
            console.log("Get All Systems");
            let apiQuery = PrepareApiProcedure('systems', 'GET', 'system', '');
            /* Now the apiQuery is an object */
            const systemList = await fetchDataFromAPI(apiQuery);
            console.log('successfully fetched systems:', systemList);
            if (systemList.fatal === true){
                notificationService.sendNotification('error', `Unable to fetch existing systems\n ${JSON.stringify(systemList)}`)
            }
            /* Now get the unit associations */
            /* TODO: make this a separate function */
            apiQuery = PrepareApiProcedure(`systems/associatedUnits`, 'GET', 'unitAssociation', '');
            const associatedUnits = await fetchDataFromAPI(apiQuery);
            /* add the unit Ids to the systems object */
            const systems = systemList.map((system:CcsSystem) => {
                return({
                    ...system,
                    ccsUnitId: associatedUnits.filter((u:any) => u.systemAssociationId === system.systemId).map((m:any) => m.unitAssociationId)
                })});
            
            console.log('final systems object is', systems);

            dispatch(systemActions.getAllSystems(
                {
                    systems: systems
                }
            ));

        } catch(e) {
            console.log(e);
        }
    }
}

export const populateSystemFields = (description:string) => {
    /* get the system data by description */
    //return async (dispatch: (arg0: { payload: any; type: string; }) => void) => {
        return async (dispatch: (arg0: { payload: any; type: string; }) => void) => {
        try {
            const apiQuery = PrepareApiProcedure(`systems/pupulate/${description}`, 'GET', 'system', '');
            let systemData = await fetchDataFromAPI(apiQuery);
            console.log('Successfully fetched system data', systemData);

            dispatch(systemActions.getPopulatedSystems(
                {
                    systemData: systemData
                }
            ));
            //return systemData;
        } catch (e) {
            console.log(e);
        }
    }
}

export const deleteSystem = async (systemId:object) => {
    /* get the system data by description */
    //return async (dispatch: (arg0: { payload: any; type: string; }) => void) => {
        try {
            const apiQuery = PrepareApiProcedure(`systems/delete`, 'DELETE', 'system', systemId);
            let systemData = await fetchDataFromAPI(apiQuery);
            console.log('Delete successfully', systemData);
            const deletedMsg = systemData.message;

            systemData === "jwt expired" ? null :
            deletedMsg === "Deleted successfully" ? notificationService.sendNotification('success', `Deleted successfully`)
            : deletedMsg === "SystemId is not valid" ? notificationService.sendNotification('error', `SystemId is not valid`) :
                    notificationService.sendNotification('error', `Some error occurs please check SystemmId`);

            if (systemData === "jwt expired") {
                return systemData;
            }

        } catch (e) {
            console.log(e);
        }
    //}
}


export const resetPopulatedState = () => {
        return async (dispatch: (arg0: { payload: any; type: string; }) => void) => {
        try {
            dispatch(systemActions.getPopulatedSystems(
                {
                    systemData: []
                }
            ));
        } catch (e) {
            console.log(e);
        }
    }
}