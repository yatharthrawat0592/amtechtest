const axiosInstance = require('../config/axiosConfig');
const config = require("../config/wsConfig");
const crypto = require('crypto');
const { merge } = require('../utils/helper');
const { ENDPOINTS } = require('../utils/constants');
const { pktDateTimeSrc } = require('../utils/datetime');

let unitId = null;
// Services to communicate with the API
async function generateBearerToken(socket) {
    const token = await axiosInstance.post(
        ENDPOINTS.GENERATE_JWT_TOKEN, 
        { email: config.username, password: config.password, IpAddress: socket.remoteAddress }
    );
    return token
}

function addHours(date, hours) {
    date.setHours(date.getHours() + hours);
  
    return date;
  }

async function saveInitialConPacket(pkt1) {
    unitId = global.unitId
    const d = new Date();
    //const nd = addHours(d, 4); //hack to update time
    //console.log("date is: ");
    //console.log(nd);
    const conPacketRes = await axiosInstance.put(
        ENDPOINTS.UNIT_UPDATE,
        {
            unitId,
            serial: pkt1.ccs_serial.val,
            firmwareVersion: pkt1.firmware_version.val,
            wifiVersion: pkt1.wifi_version.val,
            model: pkt1.model_type.val,
            elevation: pkt1.elevation_set_pt.val,
            cfmSetPoint: pkt1.cfm_set_pt.val,
            rebootDateTime: pktDateTimeSrc(pkt1.reboot_date.val, pkt1.reboot_time.val),
            pAmbient: pkt1.p_ambient.val,
            lastUpdateSent: d.toISOString(),
            IpAddress: global.remoteAddress,
        }
    );
    return conPacketRes;
}

async function saveUpdateAndAdvancedCCS(pkt2) {
    ENDPOINTS.UNIT_DATA = ENDPOINTS.UNIT_DATA.replace(':unitId', unitId);
    const d = new Date();
    //const nd = addHours(d, 4); //hack to update time
    // console.log("date is: ");
    // console.log(nd);
    const updatePacketRes = await axiosInstance.post(
        ENDPOINTS.UNIT_DATA,
        {
            unitIdRef: unitId,
            status: pkt2.status.val,
            temperature: pkt2.temperature.val,
            cfm: pkt2.CFM.val,
            filterLife: pkt2.filter_life.val,
            pwm: pkt2.pwm.val,
            ps1: pkt2.ps1.val,
            ps2: pkt2.ps2.val,
            updateReceived: d.toISOString()
        }
    );
    return updatePacketRes;
}

async function isValidUnit(serial) {
    const validUnit = await axiosInstance.get(ENDPOINTS.VALID_UNIT + '?ccsSerial='+serial)
    if (validUnit.status === 200) {
        return validUnit.data
    }
    return false;
}

async function logUnitIPAddress(ipAddress) {
    unitId = crypto.randomUUID();
    const logIP = await axiosInstance.post(ENDPOINTS.CREATE_UNITS, {
        unitId,
        IpAddress: ipAddress
    });
    return logIP;
}

async function getUnitInfo() {
    const info = await axiosInstance.get(ENDPOINTS.GET_UNIT_INFO+'?flag=1');
    const data = info.data;
    return data;
}

async function getCCSUnit() {
    const unit = await axiosInstance.get(ENDPOINTS.GET_ALL_UNITS);
    const units = unit.data;
    return units
}

async function getFirmwareBinary() {
    return (await axiosInstance.get(ENDPOINTS.FIRMWARE_BINARY));
}

async function getFirmware(firmwareVersion) {
    const { status, data } = await axiosInstance.get(
        ENDPOINTS.FIRMWARE_VERSION + '/' + firmwareVersion
    );
    let firmwareRes = false;
    
    if (status === 200 && typeof data === 'string') {
        const { data: binaryData } = await getFirmwareBinary();
        firmwareRes = binaryData ? binaryData : false;
    }
    return firmwareRes;
}

async function savePacketstoDB(packets) {
  try {
        const packet = merge(packets);
        const [pkt1, pkt2] = await Promise.all([
        saveInitialConPacket(packet),
        saveUpdateAndAdvancedCCS(packet),
    ])
        if (pkt1.status === 200 && pkt2.status === 200) {
            console.log('Packet Saved in DB');
            return true;
        }
   } catch (err) {
        return {
            isError: true,
            message: err.message
        }
   }
    return false;
}

async function getCCSUnitInfoToCCS() {
    return await axiosInstance.get(ENDPOINTS.GET_UNITS);
}

async function updateCCSUnitInfo() {
    const updateCCSInfo = await axiosInstance.put(
        ENDPOINTS.UPDATE_INFO_STAGE,
        { data_available: 0, unitId: global.unitId }
    )
    return updateCCSInfo;
}

module.exports = {
    generateBearerToken,
    savePacketstoDB,
    getCCSUnitInfoToCCS,
    isValidUnit,
    logUnitIPAddress,
    getUnitInfo,
    updateCCSUnitInfo,
    getFirmware,
    getCCSUnit
}