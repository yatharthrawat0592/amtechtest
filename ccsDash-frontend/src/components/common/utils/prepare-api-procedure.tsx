export const PrepareApiProcedure = (
    apiname: string,
    action: string,
    entity: string,
    data: any,
):any => {
    //const fieldArray:any [] = convertFieldObjectToArray(data);
    const apiQuery = {
        api: apiname,
        request: {
            action: action,
            entity: entity,
            data: data
        }
    }
    return apiQuery;
}

// const convertFieldObjectToArray = (fieldObject:any): any[] => {
//     let fieldArray: any[] = [];
//     const jsonObj = JSON.parse(JSON.stringify(fieldObject));
//     for(let key in jsonObj) {
//         let fieldValue = jsonObj[key];
//         if(fieldValue === 'True') {
//             fieldArray.push({"FieldName": key, "FieldValue": true})
//         } else if (fieldValue === 'False') {
//             fieldArray.push({"FieldName": key, "FieldValue": false})
//         } else {
//             fieldArray.push({"FieldName": key, "FieldValue": fieldValue})
//         }
//     }
// }

/* API calls:
 * /unit
 * get /unit
 *  get all units
 * post /unit/create
 *  create a new unit (serial, firmwareVersion, hardwareVersion, wifiVersion, cfmSetPoint, elevation, description)
 * /system
 * get  /system
 *  get all systems
 * get  /system/associatedUnits/<systemId>
 *  get associated units to a specific system Id
 * post /system/associatedUnits/<systemId>
 *  associate a specific unit to a systemId (unitId)
 * post /system/new
 *  create new system (user, description)
 * /data
 */