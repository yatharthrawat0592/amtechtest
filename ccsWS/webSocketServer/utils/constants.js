module.exports = {
    PACKET_STATUS: {
        'PKT_HDR': 0,
        'PKT_ACK': 1,
        'PKT_FIRMWARE_HDR': 2,
        'PKT_FIRMWARE_BINARY': 3,
        'PKT_INITIAL_CONN': 4,
        'PKT_UPDATE_CCS': 5,
        'PKT_ADVANCED_CCS': 6,
        'PKT_ADMIN_INFO': 7,
        'PKT_FIRMWARE': 8,
        'PKT_DONE_SENDING_CCS': 9,
        'PKT_END_CONN': 10,
        'PKT_REGISTER_INFO': 11,

    },
    ACK_STATUS: {
        'ACK_STATUS_VALID': 0,
        'ACK_STATUS_RESEND': 1, // TODO: Resend the data packet only
        'ACK_STATUS_RETRY': 2, // TODO: Resend the header packet and then data packet
        'ACK_STATUS_ABORT': 3, // TODO: Ends the websocket connnection and reconnect it again
        'ACK_STATUS_INVALID_HUB': 4, // TODO: Unit is not registered in the server
        'ACK_STATUS_SERVER_NEW_PKT': 5, // TODO: Tell CCS that server has data to send,
        'ACK_STATUS_CONN_VALID': 6 
    },
    DONE_SENDING_STATUS: {
        STATUS_ERROR: 0,
        STATUS_OK: 1
    },
    ENDPOINTS: {
        GENERATE_JWT_TOKEN: '/login/websockets',
        CREATE_UNITS: '/units/create',
        UNIT_DATA: '/data/:unitId',
        GET_UNITS: '/',
        VALID_UNIT: '/isValidUnit',
        GET_UNIT_INFO: '/getInfoStage',
        DELETE_INFO_STAGE: '/deleteInfoStage',
        CREATE_INFO_STAGE: '/createInfoStage',
        FIRMWARE_BINARY: '/getLatestFirmwareActive',
        FIRMWARE_VERSION: '/getCcsFirmware',
        UNIT_UPDATE: '/units/ws/update',
        UPDATE_INFO_STAGE: '/updateInfoStage',
        GET_ALL_UNITS: '/units'
    },
    RETRIES: 3
}