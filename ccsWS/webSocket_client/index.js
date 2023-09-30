const http = require('http');
const https = require('https');
const WebSocket = require('ws');
const readline = require('readline');
const { ack_status, pkt_status } = require('./utils/constants');
const { 
  pkt_hdr, 
  pkts, 
  pkt_types, 
  pkt_ack,
  pktUnwrap,
  binaryPacketWrap,
  getAckPacket, 
  reconstructPacket,
  verifyChecksum
} = require('./packets');

let curr_pkt = 0;
let flipRequest = false;
let interfaceIns = null;
let headerPacket = null;
let deconstructedData = {};
let isDonePacketSend = false;
let hdr_sent = {
  4: false,
  5: false,
  6: false
}


function connect() {
  const ws = new WebSocket('ws://51.20.34.163:4888');
  const interface = createInterface();
  curr_pkt = 3;

  // global variables
  global.firmwareBinary = null; //store firmware binary to get the original firmware binary in chunks
  global.currentHeaderPacket = null;

  ws.on('open', () => {
    resetStatus();
    // sentHdrPacket(ws);
  });

  ws.on('message', (response) => {
    interface.resume();
    // flipRequest to check the either unit is sending the info or receive the info
    if (!flipRequest) {
      console.log('ACK Received : ', response);
      const [pktId, status] = pktUnwrap(response, pkt_ack);
      // checking the status of ack and take actions on ack resend and ack server new pkt
      if (status) {

        if (+status === ack_status.ACK_STATUS_CONN_VALID) {
          console.log('Connection Accepted');
          sentHdrPacket(ws);
        }

        if (+status === ack_status.ACK_STATUS_ABORT) {
          console.log('Abort Connection');
        }

        if (+status === ack_status.ACK_STATUS_RESEND) {
          const { identifier } = global.currentHeaderPacket;
          curr_pkt = +identifier.val;
          hdr_sent[curr_pkt] = true;
          curr_pkt === 0 && (hdr_sent[curr_pkt] = false);
        }

        if (+status === ack_status.ACK_STATUS_RETRY) {
          const { identifier } = global.currentHeaderPacket;
          curr_pkt = +identifier.val;
          hdr_sent[curr_pkt] = false;
        }
  
        if (+status === ack_status.ACK_STATUS_SERVER_NEW_PKT) {
         // const { identifier } = global.currentHeaderPacket;
        ///  curr_pkt =  pkt_status.PKT_DONE_SENDING_CCS;
          curr_pkt = pkt_status.PKT_INITIAL_CONN;
          console.log('CCS Ready to receive the info sent from ws');
        }
      }

      if (+status === ack_status.ACK_STATUS_VALID && isDonePacketSend) {
        isDonePacketSend = false;
        flipRequest = true;
        curr_pkt = 4;
        return;
      }

      // checking the packet id received in header 
      if (pktId) {
        if (+pktId === pkt_status.PKT_ADVANCED_CCS) {
           curr_pkt = 0;
           resetStatus();
        }
      }

      if (hdr_sent[curr_pkt] && curr_pkt !== pkt_status.PKT_DONE_SENDING_CCS) {
        const pkt = pkts[curr_pkt];
        interface.question(`Send ${pkt_types[curr_pkt]} to WS Server (Y/N)`, (args) => {
          if (args.toLowerCase() === 'y') {
            const packet = binaryPacketWrap(pkt, curr_pkt);
            ws.send(packet);
            console.log(`${pkt_types[curr_pkt]} Packet Sent with packet id: ${curr_pkt}`);
            console.log('Data Packet : ', pkt);
            
            if (curr_pkt >= 6) {
              curr_pkt = 3;
              pkt_hdr.identifier.val = 4;
              resetStatus();
            } else {
              curr_pkt += 1;
            }
            interface.pause();
          }
        });
      } else if (![7, 9].includes(curr_pkt) && +status !== ack_status.ACK_STATUS_CONN_VALID) {
        sentHdrPacket(ws);
      } else if (curr_pkt === pkt_status.PKT_DONE_SENDING_CCS) {
        const pkt = pkts[pkt_status.PKT_DONE_SENDING_CCS];
        interface.question(`Send ${pkt_types[pkt_status.PKT_DONE_SENDING_CCS]} packet to WS Server (Y/N)`, (args) => {
          if (args.toLowerCase() === 'y') {
            const packet = binaryPacketWrap(pkt, curr_pkt);
            ws.send(packet);
            console.log(`${pkt_types[curr_pkt]} Packet Sent with packet id: ${curr_pkt}\n`);
            console.log('Unit is ready to receive the packets');
            //flipRequest = true;
            isDonePacketSend = true;
            //curr_pkt = 4;
            interface.pause();
          }
        });
      }
    } else {
      const isObject = typeof response === 'object';

      // Checking the data received from ws server to handle the firmware binary. 
      // if isObject is true then we received the firmware binary in array buffer otherwise we received binary data in string
    //  if (!isObject) {
        const currentPkt = !headerPacket ? pkt_hdr : pkts[curr_pkt];
        const unwrapPkt = pktUnwrap(response, currentPkt);
        deconstructedData = reconstructPacket(currentPkt, unwrapPkt, !headerPacket);
   //   }

      const { dataStruct = {}, data } = deconstructedData;
      console.log('Packet Received : ');
      console.log(dataStruct);

      if (dataStruct.hasOwnProperty('identifier')) {
        console.log('Header Packet Received');
        let ackId = ack_status.ACK_STATUS_VALID;
        headerPacket = dataStruct;
        curr_pkt = +dataStruct.identifier.val;
        const isCheckSumVerified = verifyChecksum(data, dataStruct.pkt_hdr_cksum.val);
        
        if (!isCheckSumVerified) {
          console.log(`The Header Packet Checksum doesn't match`);
          ackId = ack_status.ACK_STATUS_RESEND;
        }

        if (pkt_status.PKT_FIRMWARE !== +dataStruct.identifier.val) {
          interface.question(`Send Header ACK ${pkt_types[curr_pkt]} to WS Server (Y/N)`, (args) => {
            if (args.toLowerCase() === 'y') {
              const ack = getAckPacket(curr_pkt, ackId);
              const packet = binaryPacketWrap(ack, curr_pkt);
              ws.send(packet);
              console.log(`${pkt_types[curr_pkt]} Header ACK Sent`);
              interface.pause();
            }
          });
        } else {
          const ack = getAckPacket(curr_pkt, ackId);
          const packet = binaryPacketWrap(ack, curr_pkt);
          ws.send(packet);
          console.log(`${pkt_types[curr_pkt]} Header ACK Sent`);
        }
      }
      
      if (!dataStruct.hasOwnProperty('identifier')) {
        console.log('Data Packet Received');
        let ackId = ack_status.ACK_STATUS_VALID;
        const isDoneSendingPkt = +dataStruct.pkt_id === pkt_status.PKT_DONE_SENDING_CCS;

        const pkt = pkts[1];
        
        if (!isDoneSendingPkt) {
          const isCheckSumVerified = verifyChecksum(data, headerPacket.pkt_data_cksum.val);
          if (!isCheckSumVerified) {
            console.log(`The Data Packet cksum doesn't match. Packet is corrupted`);
            ackId = ack_status.ACK_STATUS_RESEND;
          }

          if (pkt && curr_pkt === pkt_status.PKT_REGISTER_INFO) {
            pkt.ccs_serial.val = dataStruct.ccs_serial.val;
          }
        }
        
        switch(curr_pkt) {
          case pkt_status.PKT_REGISTER_INFO:
            interface.question(`Send Packet ACK ${pkt_types[curr_pkt]} to WS Server (Y/N)`, (args) => {
              if (args.toLowerCase() === 'y') {
                const ack = getAckPacket(curr_pkt, ackId);
                const packet = binaryPacketWrap(ack, curr_pkt);
                console.log(`${pkt_types[curr_pkt]} ACK Sent\n`);
                headerPacket = false;
                curr_pkt =  1;
                flipRequest = false;
                resetStatus();
                console.log('CCS will send packets to WS Server');
                ws.send(packet);
                interface.pause();
              }
            });
            break;
          case pkt_status.PKT_FIRMWARE:
            console.log(isObject ? response : '\n');
            if (dataStruct.pkt_segments === dataStruct.pkt_seq) {
              interface.question(`Send Packet ACK for ${isObject ? 'Firmware Binary' : pkt_types[curr_pkt]} to WS Server (Y/N)`, (args) => {
                if (args.toLowerCase() === 'y') {
                  const isAllFirmwareRceived = dataStruct.pkt_segments <= dataStruct.pkt_seq;
                  const ack = getAckPacket(curr_pkt, ackId);
                  const packet = binaryPacketWrap(ack, curr_pkt);
                  console.log(`${isObject ? 'Firmware Binary' : pkt_types[curr_pkt]} ACK Sent\n`);
                  if (isObject && !isAllFirmwareRceived) {
                    headerPacket = false;
                  } else if (isAllFirmwareRceived && isObject) {
                    curr_pkt = 1;
                    flipRequest = false;
                    headerPacket = false;
                    resetStatus();
                    pkt.firmware_version.val = dataStruct.pkt_firmware_version;
                    console.log('CCS will send packets to WS Server');
                  }
                  ws.send(packet);
                  interface.pause();
                }
              });
            } else {
              const ack = getAckPacket(curr_pkt, ackId);
              const packet = binaryPacketWrap(ack, curr_pkt);
              console.log(`${isObject ? 'Firmware Binary' : pkt_types[curr_pkt]} ACK Sent\n`);

              if (isObject) {
                headerPacket = false;
              }
              ws.send(packet);
            }
            break;
          case pkt_status.PKT_ADMIN_INFO:
            interface.question(`Send Packet ACK ${pkt_types[curr_pkt]} to WS Server (Y/N)`, (args) => {
              if (args.toLowerCase() === 'y') {
                const advancePkt = pkts.find(p => +p.pkt_id.val === pkt_status.PKT_ADVANCED_CCS);
                const ack = getAckPacket(curr_pkt, ackId);
                const packet = binaryPacketWrap(ack, curr_pkt);
                console.log(`${pkt_types[curr_pkt]} ACK Sent\n`);
                curr_pkt =  1;
                flipRequest = false;
                resetStatus();
                console.log('CCS will send packets to WS Server');
                ws.send(packet);
                advancePkt.cfm_set_pt.val = dataStruct.cfm_set_pt;
                advancePkt.elevation_set_pt.val = dataStruct.elevation_set_pt;
                advancePkt.model_type.val = d
                // ataStruct.model_type;
                interface.pause();
              }
            });
            break;
        }
      }
    }
  });

  ws.on('close', function() {
    console.log('\nSocket Closed\n');
    console.log('Reconnect in 5 sec...');
    global.currentHeaderPacket = null;
    setTimeout(() => {
      connect();
    }, 5000);
  });

  ws.on('error', function(e) {
    console.log(e);
  })
}

function sentHdrPacket(ws) {
  interfaceIns.question(`Send header packet for packet id ${curr_pkt === 3 ? curr_pkt + 1 : curr_pkt} to WS Server (Y/N)`, (args) => {
    if (args.toLowerCase() === 'y') {
      if (curr_pkt === 3) {
        curr_pkt = curr_pkt + 1;
      } else {
        pkt_hdr.identifier.val = curr_pkt;
      }
  
      global.currentHeaderPacket = pkt_hdr;
      ws.send(binaryPacketWrap(pkt_hdr, 0));
      console.log('Header Packet Sent');
      hdr_sent[curr_pkt] = true;
      interfaceIns.pause();
    }
  });
}

function resetStatus() {
  hdr_sent[4] = !1;
  hdr_sent[5] = !1;
  hdr_sent[6] = !1;
}

function createInterface() {
  if (interfaceIns) {
    interfaceIns.close();
  }

  interfaceIns = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return interfaceIns;
}

// connect to ws server
connect();
