/* eslint-disable @typescript-eslint/no-unused-expressions */
import { unitActions } from '../slices/unit-slice';
import { PrepareApiProcedure } from '../../components/common/utils/prepare-api-procedure';
import { fetchDataFromAPI } from '../../services/api-requests';
import { CcsUnitInfo } from '../../models/unit-model';
import { notificationService } from '../../services/notification-service';

export const getInfoStage = async () => {
    try {
        const apiQuery = PrepareApiProcedure(`getInfoStage`, 'GET', 'infoStage', '');
        let infoStageResp = await fetchDataFromAPI(apiQuery);
        return infoStageResp;
    } catch (e) {
        console.log(e);
    }
}

export const deleteInfoStage = async (unitId: object) => {
    console.log("Check_Id:",unitId)
        try {
            const apiQuery = PrepareApiProcedure(`deleteInfoStage`, 'DELETE', 'infoStage', unitId);
            let infoStageData = await fetchDataFromAPI(apiQuery);
            console.log('Delete successfully', infoStageData);
            const deletedMsg = infoStageData.message;

            infoStageData === "jwt expired" ? null :
            deletedMsg === "Deleted successfully" ? notificationService.sendNotification('success', `Unit Received Data`)
            : deletedMsg === "UnitId is not valid" ? notificationService.sendNotification('error', `UnitId is not valid`) :
                    notificationService.sendNotification('error', `An error occured, please check SystemId`);

            if (infoStageData === "jwt expired") {
                return infoStageData;
            }

        } catch (e) {
            console.log(e);
        }
}