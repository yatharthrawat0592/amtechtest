const SIZE_SERIAL_NUM = 16;

const pkt_ack = {
    "identifier": {val : 240, len: 1, type: 'uint8'},
    "status": {val: 0, len: 1, type: 'uint8'},
    "cksum": {val: 0, len: 4, type: 'uint32'}
}

const pkt_hdr = {
    "identifier": {val: 0, len: 1, type: 'uint8'},
    "pkt_data_size": {val: 0, len: 4, type: 'uint32'},
    "pkt_data_cksum": {val: 0, len: 4, type: 'uint32'},
    "pkt_hdr_cksum": {val: 0, len: 4, type: 'uint32'},
}

const pkt_initial_con =  {
    "ccs_serial": { val: '', len: SIZE_SERIAL_NUM, type: 'string' }, // ccs info column
    //"connection_type": { val: 0, len: 4, type: 'int32' },
    "firmware_version": { val: 0, len: 4, type: 'int32' }, // ccs info column
    "wifi_version": { val: 0, len: 4, type: 'int32' },
    "hardware_version": { val: 0, len: 4, type: 'int32' },
    "reboot_time": { val: 0, len: 4, type: 'uint32' },
    "reboot_date": { val: 0, len: 4, type: 'uint32' }
}

const pkt_firmware_hdr = {
    "identifier": {val: 8, len: 1, type: 'uint8'},
    "pkt_data_size": {val: 0, len: 4, type: 'uint32'},
    "pkt_data_cksum": {val: 0, len: 4, type: 'uint32'},
    "pkt_hdr_cksum": {val: 0, len: 4, type: 'uint32'},
}

const pkt_firmware = {
    "pkt_segments": { val: 0, len: 4, type: 'uint32' },
    "pkt_seq": { val: 0, len: 4, type: 'uint32' },
    "pkt_total_size": { val: 0, len: 4, type: 'uint32' },
    "pkt_chunk_size": { val: 0, len: 4, type: 'uint32' },
    "pkt_firmware_version": {val: 0, len: 4, type: 'uint32'},
}

const pkt_firmware_binary = {
    "pkt_firmware_binary": {val: 0, len: 1000, type: 'buffer'}
}

const pkt_register_info = {
   // "pkt_id": { val: '9', len: 1, type: 'string' },
    "ccs_serial": { val: '', len: 16, type: 'string' },
    "cfm_set_point": { val: 0, len: 4, type: "uint32" }
}

const pkt_update_ccs = {
    'status': { val: 0, len: 4, type: 'uint32' },
    'temperature': { val: 0, len: 4, type: 'float32' },
    'CFM': { val: 0.0, len: 4, type: 'float32' },
    'filter_life': { val: 0.0, len: 4, type: 'float32' },
    'time': { val: 0, len: 4, type: 'uint32' },
    'date': { val: 0, len: 4, type: 'uint32' },
}

const pkt_advanced_ccs = {
    'ps1': { val: 0, len: 4, type: 'float32' },
    'ps2': { val: 0, len: 4, type: 'float32' },
    'p_ambient': { val: 0, len: 4, type: 'float32' },
    'pwm': { val: 0, len: 4, type: 'uint32' },
    'cfm_set_pt': { val: 0, len: 4, type: 'uint32' }, // ccs info column
    'elevation_set_pt': { val: 0, len: 4, type: 'uint32' }, // ccs info column
    'model_type': { val: 0, len: 4, type: 'uint32' }, // ccs info column
}

const pkt_done_sending = {
    'status': { val: 0, len: 4, type: 'uint32' }
}

const pkt_end_con = {
    'status': { val: 1, len: 4, type: 'uint32' }
}

const pkt_admin_info = {
    'set_cfm': { val: 0, len: 4, type: 'uint32' },
    'set_idle_cfm': { val: 0, len: 4, type: 'uint32' },
    'set_elevation': { val: 0, len: 4, type: 'uint32' },
    'set_model_type': { val: 0, len: 4, type: 'uint32' },
    'prefilter_alarm_time': { val: 0, len: 4, type: 'int32' },
    'reset_prefilter': { val: 0, len: 4, type: 'int32' },
    'reset_filter': { val: 1, len: 4, type: 'int32' },
    //'pkt_request': { val: 0, len: 4, type: 'int32' }
}

function getPktObjDefinition(pkt) {
    const data = Object.values(pkt);
    const size = data.reduce((p, c, i) => p + c.len, 0);
    return {
        size,
        data,
        pkt
    }
}

module.exports = {
    pkt_ack: getPktObjDefinition(pkt_ack),
    pkt_hdr: getPktObjDefinition(pkt_hdr),
    pkt_firmware_hdr: getPktObjDefinition(pkt_firmware_hdr),
    pkt_firmware_binary: getPktObjDefinition(pkt_firmware_binary),
    data_pkts: {
        4: getPktObjDefinition(pkt_initial_con),
        5: getPktObjDefinition(pkt_update_ccs),
        6: getPktObjDefinition(pkt_advanced_ccs),
        7: getPktObjDefinition(pkt_admin_info),
        8: getPktObjDefinition(pkt_firmware),
        9: getPktObjDefinition(pkt_done_sending),
        10: getPktObjDefinition(pkt_end_con),
        11: getPktObjDefinition(pkt_register_info)
    }
}