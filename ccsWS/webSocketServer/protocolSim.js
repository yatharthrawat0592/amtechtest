const { ACK_STATUS, PACKET_STATUS } = require('./utils/constants');
const { unzipBinary } = require('./utils/firmware');
const { pkt_hdr, pkt_ack, data_pkts, pkt_firmware_hdr } = require('./utils/objectDefinitions');
const { savePacketstoDB, isValidUnit, getUnitInfo, updateCCSUnitInfo, getFirmware, getCCSUnit } = require('./http/webService');

//const CRC32 = require('crc-32');
const { CRC32 } = require('./utils/crc32');
const chalk = require('chalk');
// const { binaryPacketWrap } = require('../webSocket_client/packets');

let packets = [];
let dataPacket = null;

const littleEndian = true;

const numToArrByType = (num, type) => {
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

    // type === 'float32' ? 
    // view.setFloat32(0, num, true) :
    // view.setUint32(0, num, true);

    const viewArr = new Uint8Array(arr);
    return viewArr;
}

//Deconstruct a data structure and turn it into a binary packet
const pktWrap = (pkt) => {
    const strArray = Object.values(pkt);
    const strMap = strArray.map((obj) => {
        var i = 0;  
        var output = '';
        var test = '';
        var tmpObj = '';
        var x;
        if(typeof(obj.val) === 'number') {
            output = numToArrByType(obj.val, obj.type);
            return output;
            // const mappedBinary = [...x].map((n) => `[0x${n.toString(16).padStart(2,"0")}]`).join('');
            // const mappedBinary=[...x].map((n) => `${n.toString(16).padStart(2,"0")}`).join('');
            // output = mappedBinary;
        } else {
            tmpObj = obj.val;
            //add leading zeros before continuing, we need to make sure that our packet lengths match the object
            // otherwise, the packet will contain too few bytes
            // TODO: Parse header, find pkt type
            // TODO: check for memory overload
            // TODO: CRC checksum
            // TODO: encrypt/decrypt
            // while((obj.len - i) > (tmpObj.length)) {
            //     output += '00';
            //     i = i+1;
            // }
            const encoder =  new TextEncoder();
            const encoded = encoder.encode(tmpObj);
            const buf = new Uint8Array(16);
            buf.set(encoded);
            return buf;
            // for(i = 0; i< tmpObj.length; i++) {
            //     //the commented out version is just to make it readable, but not what gets transmitted
            //     // the transmission is just raw binary data
            //     //test += `[0x${tmpObj[i].charCodeAt(0).toString(16)}]`;
            //     output += `${tmpObj[i].charCodeAt(0).toString(16).padStart(2,"0")}`;
            // }
         //   console.log('Test : ', test)
         return output;
        }
        //TODO: add date, datetime types
      //  console.log('Output : ', output);
    })
    //place everything into a single, transferrable wrapped packet
    // var bin = '';
    // strMap.forEach((e) => {
    //     bin += e;
    // })

    const binary = strMap.map((u) => Array.from(u)).flat(1);
    return Buffer.from(binary);
}

//Unwrap an encoded binary packet
const pktUnwrap = (arrayedBinary, pkt, size) => {
    let unwrapUnitData = {};
    //first, we need to know what data structure we are trying to decode
    //taking our example, exampleUnitData, we know what to expect from this packet
    //parse the incoming object

    if (size !== arrayedBinary.byteLength) {
        console.log('The packet missing some data');
    }
    
    // Now we have everything in a nice array, take the appropriate
    // data structure lengths and reconstruct the data packet
    var idx = 0;
    
    const strArray = Object.values(pkt);
    //convert arrayedBinary to an arrayBuffer from Uint8Array
    var view = new DataView(arrayedBinary.buffer, 0);
    unwrapUnitData = strArray.map((u) => {
        var ret;
        if(u.type === 'string'){
            const subLen = idx !== 0 && u.len === 1 ? u.len + 1 : u.len;
            ret = new TextDecoder().decode(arrayedBinary.subarray(0+idx,u.len > 1 ? (u.len + 1) : subLen));
            ret = ret.substring(0, ret.search("\x00")); //only return until the string termination
        } else if(u.type === 'uint8'){
            ret = view.getUint8(idx);
        } else if(u.type === 'uint32'){
            //return the uin32 interpretation of this part of the buffer
            ret = view.getUint32(idx, littleEndian);
        } else if(u.type === 'float32'){
            //return the float interpretation of this part of the buffer
            ret = view.getFloat32(idx, littleEndian);
        } else if(u.type === 'int32') {
            ret = view.getInt32(idx, littleEndian);
        }
        idx += u.len; // advance the index on the buffer
        return ret;
    });
    console.log(`Resulting structure: ${unwrapUnitData}`);
    return unwrapUnitData;
}

// Data Packet
const pktData = async (buffer, data_pkt) => {
    let ack = null;
    const { pkt, size } = data_pkt;
    const { pkt_data_cksum, identifier } = global.current_hdr_pkt;

    console.log(chalk.yellow('Data Packet ByteLength : ', buffer.byteLength));
    console.log(chalk.yellow('Data Packet Header Size : ', size));

    if (buffer.byteLength !== size) {
        console.log(chalk.redBright(` Data packet size doesn't match. Retry and send data packet again`));
        return handleBadPacket(+pkt.identifier, !0);
    }

    const unwrapPacket = pktUnwrap(buffer, pkt, size);
    const { dataStruct, data } = reconstructPacket(pkt, unwrapPacket);
    //You don't need to unwrap and then re-wrap the packet.
    // the verify checksum should be performed on the raw packet received
    const isDataCKSumVerify = verifyChecksum(buffer, pkt_data_cksum);
    
    if (!isDataCKSumVerify) {
        const { identifier } = global.current_hdr_pkt;
        console.log(chalk.redBright(`The Data packet checksum doesn't match. Please resend the packet`));
        global.isPktResend = true;unitId: global.unitId, 
        global.retries += 1;
        global.retries >= 3 && (ack = pktWrap(getAckPacket(0, ACK_STATUS.ACK_STATUS_ABORT)));
        global.retries < 3 && pktWrap(getAckPacket(identifier.val, ACK_STATUS.ACK_STATUS_RESEND));
        return ack;
    }
    
    if (PACKET_STATUS.PKT_INITIAL_CONN === identifier.val) {
        const validUnit = await isValidUnit(dataStruct.ccs_serial.val);
        //what does it mean for a unit to be registered?
        if (validUnit && validUnit.registered) {
        //if (validUnit && validUnit.registered) {
            console.log(chalk.greenBright('CCS Serial is registered'));
            global.isNewPktAckSent = false;
            global.isPktResend = false;

            // Get All Units from ccs unit table and store the unitId
            const units = await getCCSUnit();
            if (units && units.length) {
                const ccsUnit = units.find((u) => u.serial === dataStruct.ccs_serial.val);
                global.unitId = ccsUnit.unitId;
            }
            // checking the firmware version in db
            //disabling for the moment...
            // const firmware = await getFirmware(dataStruct.firmware_version);
            const firmware = false
            if (typeof firmware !== 'boolean') {    
                const pkt = { ...data_pkts[PACKET_STATUS.PKT_FIRMWARE].pkt };
                const startIndex = 0;
                const endIndex = 1000;
                global.dataPacketId = identifier.val;
                pkt.pkt_firmware_version.val = firmware.firmwareVersion;
                pkt.pkt_seq.val = 1;
                dataPacket = pkt;
                global.firmwareSequence = 1;
                global.firmwareBinary = await unzipBinary(firmware.firmwareBinary);
                pkt.pkt_total_size.val = global.firmwareBinary.byteLength;
                pkt.pkt_chunk_size.val = global.firmwareBinary.subarray(startIndex, endIndex).byteLength;
                pkt.pkt_segments.val = Math.ceil(pkt.pkt_total_size.val / 1000);
                console.log(chalk.green('Found Firmware to send'));
                ack = pktWrap(getAckPacket(PACKET_STATUS.PKT_DONE_SENDING_CCS, ACK_STATUS.ACK_STATUS_SERVER_NEW_PKT));
                global.isNewPktAckSent = true;
                global.hasNewPacket = true
            }
        }

        if (validUnit && !validUnit.unitExists) {
            ack = pktWrap(data_pkts[PACKET_STATUS.PKT_END_CONN].pkt);
            global.isEndingConn = true;
        }

        if (validUnit && !validUnit.registered) {
            console.log(chalk.blue('CCS Serial is not registered'));
            console.log(chalk.blue('Checking the info is available to send to CCS...'));
            const ccsInfo = await getUnitInfo();
            console.log(chalk.blue(`${!ccsInfo ? 'No CCS info found to send' : 'Found CCS Info'}`));
            if (ccsInfo) {
                const [info] = ccsInfo; 
                const pkt = { ...data_pkts[PACKET_STATUS.PKT_REGISTER_INFO].pkt };
                global.dataPacketId = 9;
                pkt.ccs_serial.val = info.ccs_serial;
                pkt.cfm_set_point.val = info.cfmSetPoint;
                dataPacket = pkt;
                global.unitId = info.unitId;
                ack = pktWrap(getAckPacket(PACKET_STATUS.PKT_DONE_SENDING_CCS, ACK_STATUS.ACK_STATUS_SERVER_NEW_PKT));
                global.isNewPktAckSent = true;
                // await updateCCSUnitInfo();
            } else {
                ack = handleBadPacket(identifier.val);
               // ack = pktWrap(getAckPacket(identifier.val, ACK_STATUS.ACK_STATUS_RESEND));
               // global.isPktResend = true;
            }
        }
    }
    
    if (!global.isEndingConn && !global.isPktResend && !global.isNewPktAckSent) {
        packets.push(dataStruct);
        ack = pktWrap(getAckPacket(identifier.val, global.hasNewPacket ? ACK_STATUS.ACK_STATUS_SERVER_NEW_PKT : ACK_STATUS.ACK_STATUS_VALID));
        console.log('Packets : ', packets);

        if (+identifier.val === PACKET_STATUS.PKT_ADVANCED_CCS) {
            const isSaved = await savePacketstoDB(packets);
            
            if (isSaved && typeof isSaved === "boolean") {
               let info = await getUnitInfo();
               console.log(chalk.magentaBright(`${info.length ? 'Found Admin Info to send' : 'No Admin Info found to send'}`));
               info.length && (info = info.filter((i) => i.unitId === global.unitId && i.data_available));
               console.log(info);
               info && info.length && (
                (dataPacket = { ...data_pkts[PACKET_STATUS.PKT_ADMIN_INFO].pkt }),
                (global.dataPacketId = PACKET_STATUS.PKT_ADMIN_INFO),
                (info = info[0]),
                (dataPacket.set_cfm.val = +info.cfmSetPoint || 0),
                (dataPacket.set_elevation.val = +info.elevationSetPoint || 0),
                (dataPacket.set_model_type.val = +info.model_type || 1),
                (console.log(chalk.cyanBright('Register Info Data Packet: '), dataPacket)),
                (ack = pktWrap(getAckPacket(PACKET_STATUS.PKT_DONE_SENDING_CCS, ACK_STATUS.ACK_STATUS_SERVER_NEW_PKT))),
                (global.isNewPktAckSent = true, global.hasNewPacket = true)
               );
               packets = [];
            } else {  
                if (isSaved instanceof Object && global.ws) {
                    console.log(chalk.cyan('ACK Status Abort : '), getPktAck(0, ACK_STATUS.ACK_STATUS_CONN_VALID));
                    console.log(chalk.red(`Web API Error : ${isSaved.message}`));
                    ws.send(getPktAck(0, ACK_STATUS.ACK_STATUS_ABORT));
                    console.log(chalk.red(`Send Abort ACK and terminate connection\n`));
                    ws.terminate();
                }
                isSaved instanceof Boolean && (global.isStateMachineEnds = true)
            }
        }
    }
    return ack;
}

// Header Packet Unwrap 
const pktHdrUnwrap = (buffer) => {
    let ack = null;

    console.log(chalk.yellow('Packet ByteLength : ', buffer.byteLength));
    console.log(chalk.yellow('Packet Header Size : ', pkt_hdr.size));

    if (buffer.byteLength !== pkt_hdr.size) {
        console.log(chalk.redBright(`Header data size doesn't match. Retry and send header packet again`));
        return handleBadPacket(0, !0);
    }

    const unwrapPacket = pktUnwrap(buffer, pkt_hdr.pkt, pkt_hdr.size);
    const { dataStruct, data } = reconstructPacket(pkt_hdr.pkt, unwrapPacket, true);
    //const isCksumVerify = verifyChecksum(data, unwrapPacket[unwrapPacket.length - 1]);
    //strip off the pkt hdr cksum value to get the full cksum
    isCksumVerify = verifyChecksum(data, unwrapPacket[unwrapPacket.length - 1]);

    if (!isCksumVerify) {
        console.log(chalk.redBright(`Header Checksum doesn't match. Please resend the header packet`));
        ack = handleBadPacket(dataStruct.identifier);
    } else {
        global.current_hdr_pkt = dataStruct;
        console.log('current_hdr_pkt : ', global.current_hdr_pkt);
        ack = pktWrap(getAckPacket(0, ACK_STATUS.ACK_STATUS_VALID));
    }
    return ack;
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

    let data = pktWrap(dataStruct);
    if (isHeaderPacket) {
        data = data.subarray(0, data.byteLength - values[values.length - 1].len);
        console.log('Data: ', data);
    }
    console.log(dataStruct);
    return { dataStruct, data };
}

// verify checksum
const verifyChecksum = (data, cksum) => {
    //7-4-23 switched to custom CRC32 (from board)
    //return (CRC32.buf(data, crcSeed) >>> 0) === (typeof cksum === 'number' ? cksum : cksum.val);
    return (CRC32(data, 0, 'bin') >>> 0) === (typeof cksum === 'number' ? cksum : cksum.val);
}

// done sending packet ack
const getPktAck = (identifier, status = 0) => {
    return pktWrap(getAckPacket(identifier, status));
}

// get ack packet
const getAckPacket = (identifier, status) => {
    const cp_pkt_ack = { ...pkt_ack.pkt };
    cp_pkt_ack.identifier.val = 240; //240 is the ACK pkt identifier
    cp_pkt_ack.status.val = status;
    const data = pktWrap(cp_pkt_ack);
    cp_pkt_ack.cksum.val = (CRC32(data, 0, 'bin') >>> 0);
    // console.log('ACK Packet : ', cp_pkt_ack);
    return cp_pkt_ack;
}

// generate checksum
function generateChecksum(pkt) {
    const values = Object.values(pkt);
    const data = pktWrap(pkt);
    console.log('-------------------------------------------\n');
    console.log(data);
    console.log('-------------------------------------------\n');
    const pktSize = values.reduce((prev, initial) => prev + initial.len ,0);
    return {
        pkt_data_size: pktSize,
        pkt_data_cksum: (CRC32(data, 0, 'bin') >>> 0)
    }
}

// get Data Packet
function getDataPkt(packetId = null) {
    if (packetId) {
        const pkt = { ...data_pkts[PACKET_STATUS.PKT_DONE_SENDING_CCS].pkt };
        dataPacket = pkt;
    }
    return pktWrap(dataPacket);
}

// get Data Packet Original
function getDataPktOriginal() {
    return dataPacket;
}

// create Header Packet
function generateHeaderPkt(pkt = null) {
    let hdrPkt = { ...pkt_hdr.pkt };

    if (global.dataPacketId === PACKET_STATUS.PKT_FIRMWARE) {
        hdrPkt = { ...pkt_firmware_hdr.pkt };
    }

    if (pkt) {
        dataPacket = pkt;
    }

    const { pkt_data_cksum, pkt_data_size } = generateChecksum(pkt || dataPacket);
    hdrPkt.identifier.val = global.dataPacketId;
    hdrPkt.pkt_data_size.val = pkt_data_size;
    hdrPkt.pkt_data_cksum.val = pkt_data_cksum;

    const hdrData = pktWrap(hdrPkt);
    const slicedData = hdrData.subarray(0, hdrData.byteLength - hdrPkt.pkt_hdr_cksum.len);

    hdrPkt.pkt_hdr_cksum.val = CRC32(slicedData, 0, 'bin') >>> 0;
    console.log(chalk.greenBright(`Header Packet for Packet Id ${global.dataPacketId}: `));
    console.log(hdrPkt);
    return pktWrap(hdrPkt);
}

function handleBadPacket(identifier, retry = !1) {
    ack = pktWrap(getAckPacket(+identifier.val, !retry  ? ACK_STATUS.ACK_STATUS_RESEND : ACK_STATUS.ACK_STATUS_RETRY));
    global.isPktResend = true;
    global.retries += 1;
    global.retries >= 3 && (ack = pktWrap(getAckPacket(0, ACK_STATUS.ACK_STATUS_ABORT)));
    console.log(chalk.cyanBright(`Bad header packet received ${global.retries} times`));
    return ack;
}

function isDoneSendingPacket(binary) {
    let isDonePacket = false;
    try {
        const { size, pkt } = data_pkts[9];
        if (size === binary.byteLength) {
            const unwrappedPkt = pktUnwrap(binary, pkt, size);
            unwrappedPkt.length === 1 && unwrappedPkt.includes(1) && (isDonePacket = !0);
        }
    } catch(err) {
        console.log(err);
    }
    return isDonePacket
}

module.exports = {
    pktHdrUnwrap,
    pktUnwrap,
    pktData,
    getPktAck,
    generateHeaderPkt,
    getDataPkt,
    getAckPacket,
    getDataPktOriginal,
    isDoneSendingPacket
};


// cfm_set_point