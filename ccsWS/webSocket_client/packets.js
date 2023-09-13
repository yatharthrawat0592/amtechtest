var { CRC32 } = require('./utils/crc32');

const littleEndian = true;

const pkt_types = {
    4: 'PKT_INITIAL_CONN',
    5: 'PKT_UPDATE_CCS',
    6: 'PKT_ADVANCED_CCS',
    7: 'PKT_ADMIN_INFO',
    9: 'PKT_DONE_SENDING_CCS',
    10: 'PKT_END_CONN',
   // 7: 'PKT_FIRMWARE_HDR',
    7: 'PKT_FIRMWARE',
    11: 'PKT_REGISTER_INFO'
}

const pkt_hdr = {
    "identifier": {val: 4, len: 1, type: 'uint8'},
    "pkt_data_size": {val: 0, len: 4, type: 'uint32'},
    "pkt_data_cksum": {val: 0, len: 4, type: 'uint32'},
    "pkt_hdr_cksum": {val: 0, len: 4, type: 'uint32'}
}

const pkt_ack = {
    "identifier": {val : 0, len: 1, type: 'uint8'},
    "status": {val: 0, len: 1, type: 'uint8'},
    "cksum": {val: 0, len: 4, type: 'uint32'}
}

const pkts = {
    4: {
       //  'pkt_id': { val: '1', len: 1, type: 'char' },
        "ccs_serial": { val: 'PU-1818-453', len: 16, type: 'char' },
     //   "connection_type": { val: 1, len: 4, type: 'int32' },
        "firmware_version": { val: 28, len: 4, type: 'int32' },
        "wifi_version": { val: 12, len: 4, type: 'int32' },
        "hardware_version": { val: 2, len: 4, type: 'int32' },
        "reboot_time": { val: 112265566, len: 4, type: 'uint32' },
        "reboot_date": { val: 113345644, len: 4, type: 'uint32' }
    },
    5: {
      //  'pkt_id': { val: '2', len: 1, type: 'string' },
        "status": { val: 1, len: 4, type: 'uint32' },
        "temperature": { val: 22, len: 4, type: 'int32' },
        "CFM": { val: 43.2, len: 4, type: 'float32' },
        "filter_life": { val: 1.0, len: 4, type: 'float32' },
        "date": { val: 16789495, len: 4, type: 'uint32' },
        "time": { val: 16789495, len: 4, type: 'uint32' }
    }, 
    6: {
      //  'pkt_id': { val: '3', len: 1, type: 'string' },
        'ps1': { val: 9.010000228881836, len: 4, type: 'float32' },
        'ps2': { val: 10.199999809265137, len: 4, type: 'float32' },
        'p_ambient': { val: 0, len: 4, type: 'float32' },
        'pwm': { val: 90, len: 4, type: 'uint32' },
        'cfm_set_pt': { val: 350, len: 4, type: 'uint32' },
        'elevation_set_pt': { val: 5280, len: 4, type: 'uint32' },
        'model_type': { val: 5, len: 4, type: 'uint32' },
    },
    7: {
      //  'pkt_id': { val: '4', len: 1, type: 'string' },
        'set_cfm': { val: 0.0, len: 4, type: 'float32' },
        'set_idle_cfm': { val: 0.0, len: 4, type: 'float32' },
        'set_elevation': { val: 0, len: 4, type: 'uint32' },
        'set_model_type': { val: 0, len: 4, type: 'uint32' },
        'prefilter_alarm_time': { val: 0, len: 4, type: 'int32' },
        'reset_prefilter': { val: 0, len: 4, type: 'int32' },
        'reset_filter': { val: 0, len: 4, type: 'int32' },
        'pkt_request': { val: 0, len: 4, type: 'int32' }
    },
    9: {
    //    'pkt_id': { val: '5', len: 1, type: 'string' },
        'status': { val: 1, len: 1, type: 'uint8' },
    },
    10: {
       // 'pkt_id': { val: '6', len: 1, type: 'string' },
        'status': { val: 0, len: 4, type: 'uint32' }
    },
    11 : {
      //  "pkt_id": { val: '9', len: 1, type: 'string' },
        "ccs_serial": { val: '', len: 16, type: 'string' },
        "cfm_set_point": { val: 0, len: 4, type: "uint32" }
    },
    8: {
      //  "pkt_id": { val: '8', len: 1, type: 'string' },
        "pkt_segments": { val: 0, len: 4, type: 'uint32' },
        "pkt_seq": { val: 0, len: 4, type: 'uint32' },
        "pkt_total_size": { val: 0, len: 4, type: 'uint32' },
        "pkt_chunk_size": { val: 0, len: 4, type: 'uint32' },
        "pkt_firmware_version": {val: 0, len: 4, type: 'uint32'},
    }
}


const numToArrByType = (type, num) => {
    //var arr = new ArrayBuffer(4); //4 byte int
    var arr;
    if ((type === 'uint8') || (type === 'char')){
        arr = new ArrayBuffer(1);
    } else {
        arr = new ArrayBuffer(4);
    }
    var view = new DataView(arr);

    switch(type) {
        case 'float32':
            view.setFloat32(0, num, littleEndian)
            break;
        case 'uint32':
            view.setUint32(0, num, littleEndian);
            break;
        case 'uint8':
            view.setUint8(0, num);
            break;
        case 'char':
            view.setUint8(0, num);
            break;
        case 'string':
            view.setUint32(0, num, littleEndian);
            break;
        default:
            //default uint32
            view.setUint32(0, num, littleEndian);
            break;
    }

    const viewArr = new Uint8Array(arr);
    return viewArr;
}

const binaryPacketWrap = (data, pkt_type) => {
    let numToArr = '';
    let output = [];
    let tmpVal = '';
    pkt_type === 0 && (data = updateHeaderPacket(data));
    let values = Object.values(data);
    const binaryMap = values.map((pkt, i) => {
        if (typeof pkt.val === 'number') {
            numToArr = numToArrByType(pkt.type, pkt.val);
            return numToArr;
           // output.push(numToArr);
          //  output = [...numToArr].map((n) => `${n.toString(16).padStart(2, '0')}`).join('');
        } else {
            tmpVal = pkt.val;
            // while((pkt.len - i) > (tmpVal.length)) {
            //     output += "00";
            //     i += 1;
            // }
            output = stringToBinary(tmpVal);
            return output;
        }
     //   return output;
    });
    console.log(binaryMap);
    const binary = binaryMap.map((u) => Array.from(u)).flat(1);
    return Buffer.from(binary);
}

function stringToBinary(data) {
    let output = [];
    const encoder =  new TextEncoder();

    const encoded = encoder.encode(data);
    const buf = new Uint8Array(16);
    buf.set(encoded);
    return buf;
}

function generateChecksum(pkt_num) {
    const pkt = pkts[pkt_num];
    const values = Object.values(pkt);
    const data = binaryPacketWrap(pkt);
    // const data = values.reduce((prev, initial) => {
    //     prev += initial.val.toString();
    //     return prev;
    // }, '');
    console.log('\n');
    console.log(data);
    console.log('\n');
    const pktSize = values.reduce((prev, initial) => prev + initial.len ,0);
    return {
        pkt_data_size: pktSize,
        pkt_data_cksum: (CRC32(data, 0, 'bin') >>> 0)
    }
}

function updateHeaderPacket(pkt) {
    const pkt_id = pkt.identifier;
    const { pkt_data_size, pkt_data_cksum } = generateChecksum(pkt_id.val);
    pkt.pkt_data_size.val = pkt_data_size;
    pkt.pkt_data_cksum.val = pkt_data_cksum;
    const data = binaryPacketWrap(pkt);
    const slicedData = data.subarray(0, data.byteLength - pkt.pkt_hdr_cksum.len);
    
    pkt.pkt_hdr_cksum.val = (CRC32(slicedData, 0, 'bin') >>> 0);
    console.log('Header Packet : ', pkt);
    return pkt;
}

//Unwrap an encoded binary packet
const pktUnwrap = (pkt, pktObj) => {
    //first, we need to know what data structure we are trying to decode
    //taking our example, exampleUnitData, we know what to expect from this packet
    //parse the incoming object
    console.log(`unwrapping pkt: ${pkt}`);
    // TODO: Parse header, find pkt type
    
    const rawBuffer = new ArrayBuffer(pkt.length);
    const arrayedBinary = new Uint8Array(rawBuffer);
    var i = 0;
    while ( i < (pkt.length)) {
        arrayedBinary[i] = pkt[i];
        i = i+1;
    }
    console.log("Arrayed binary: ", arrayedBinary);

    // Now we have everything in a nice array, take the appropriate
    // data structure lengths and reconstruct the data packet
    var idx = 0;

    const strArray = Object.values(pktObj);
    //convert arrayedBinary to an arrayBuffer from Uint8Array
    var view = new DataView(arrayedBinary.buffer, 0);

    const unwrapUnitData = strArray.map((u) => {
        var ret;
        if(u.type === 'string') {
            const subLen = idx !== 0 && u.len === 1 ? u.len + 1 : u.len;
            ret = new TextDecoder().decode(arrayedBinary.subarray(0+idx,u.len > 1 ? (u.len + 1) : subLen));
            ret = ret.substring(0, ret.search("\x00")); //only return until the string termination
        } else if(u.type === 'uint32') {
            //return the uin32 interpretation of this part of the buffer
            ret = view.getUint32(idx, true);
        } else if(u.type === 'float') {
            //return the float interpretation of this part of the buffer
            ret = view.getFloat32(idx, true);
        } else if(u.type === 'int32') {
            ret = view.getInt32(idx, true);
        } else if (u.type === 'uint8') {
            ret = view.getUint8(idx, littleEndian);
        }
        idx += u.len; //advance the index on the buffer
        return ret;
    })

    console.log(`Resulting structure: ${unwrapUnitData}`);
    //TODO: re-insert the resulting structure into to the specified object
    //TODO: final object looks like:
    // exampleUnitData = {    {val: unwrapUnitData[0], len, type},
    //                        {val: unwrapUnitData[1], len, type},
    //                        {val: unwrapUnitData[2], len, type} }
    // TODO send to the API
    return unwrapUnitData;
}

// get ack packet
const getAckPacket = (identifier, status) => {
    const cp_pkt_ack = { ...pkt_ack };
    const ackValues = Object.values(cp_pkt_ack);

    cp_pkt_ack.identifier.val = 240;
    cp_pkt_ack.status.val = status;

    // const data = ackValues.reduce((p, initial, idx) => {
    //     p += ackValues.length - 1 !== idx ? initial.val : ''
    //     return p;
    // }, '');
    const data = binaryPacketWrap(cp_pkt_ack);
    cp_pkt_ack.cksum.val = (CRC32(data, 0, 'bin') >>> 0);
    return cp_pkt_ack;
}

// Reconstruct the data packet in apprioriate data structure
const reconstructPacket = (pkt, unwrappedPkt, isHeaderPacket = false) => {
    const dataStruct = {};
    const keys = Object.keys(pkt);
    const values = Object.values(pkt);

    keys.forEach((k, i) => {
      //  if (isHeaderPacket && keys.length - 1 !== i) data += String(unwrappedPkt[i]);
      //  if (!isHeaderPacket) data += String(unwrappedPkt[i]);
        dataStruct[k] = { ...values[i], val: unwrappedPkt[i] }
    });

    let data = binaryPacketWrap(dataStruct);
    if (isHeaderPacket) {
        data = data.subarray(0, data.byteLength - values[values.length - 1].len);
        console.log('Data: ', data);
    }
    console.log(dataStruct);
    return { dataStruct, data };
}

// verify checksum
const verifyChecksum = (data, cksum) => {
    return (CRC32(data, 0, 'bin') >>> 0) === cksum;
}

module.exports = {
    pkt_hdr,
    pkts,
    pkt_types,
    pkt_ack,
    binaryPacketWrap,
    stringToBinary,
    pktUnwrap,
    getAckPacket,
    reconstructPacket,
    verifyChecksum
}