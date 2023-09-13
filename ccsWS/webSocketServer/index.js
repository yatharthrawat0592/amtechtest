const http = require('http');
const ws = require('ws');
const crypto = require('crypto');
const chalk = require('chalk');
const { PACKET_STATUS, ACK_STATUS, RETRIES } = require('./utils/constants');
const { data_pkts, pkt_ack } = require('./utils/objectDefinitions');
const { 
  pktHdrUnwrap, 
  pktData, 
  generateHeaderPkt, 
  pktUnwrap, 
  getDataPkt,
  getPktAck,
  getDataPktOriginal,
  isDoneSendingPacket
} = require('./protocolSim');
const { getDataArrBuffer } = require('./utils/helper');
const { generateBearerToken, logUnitIPAddress, updateCCSUnitInfo } = require('./http/webService');

const PORT = 4888;
let PKT_RCV = 0;
let flipServerRequest = false;
let isAckReceived = false;
let isDoneSending = false;
let isFirmwareBinSend = false;
let dataPacket = null;
let isRegisterInfoSend = false;
let clients = [];

const wss = new ws.Server({ noServer: true, });

const pkt_status_values = Object.values(PACKET_STATUS);

const accept = (req, res) => {  
  // all incoming requests must be websockets
  if (!req.headers.upgrade || req.headers.upgrade.toLowerCase() != 'websocket') {
    res.end();
    return;
  }

  // can be Connection: keep-alive, Upgrade
  if (!req.headers.connection.match(/\bupgrade\b/i)) {
    res.end();
    return;
  }
  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onConnect);
}

const onConnect = async (ws, req) => {
  console.log(chalk.yellow("CCS Connection Received\n"));

  clients.push({
    id: crypto.randomUUID(),
    ws_id: req.headers['sec-websocket-key'],
    client: ws
  });

  try {
    const token = await generateBearerToken(req.socket);
    if (token.status === 200) {
      //#region global Variables
      global.jwt = token.data.access_token;
      global.remoteAddress = req.socket.remoteAddress; 
      setInitialGlobalVariables(ws);
      //#endregion

      PKT_RCV = 0;
      console.log('Generated Authentication token : ', global.jwt + '\n');
      // log the ip address of the unit connected with ws sever
      // const unitData = await logUnitIPAddress(req.socket.remoteAddress);
      
      // if (unitData.data) {
      //   global.unitId = unitData.data.unitId;
      // }

     // console.log(chalk.green(`Logged the Unit IP Address ${global.remoteAddress} to Server \n`));
    }

    ws.on('message', async (response) => {
      console.log(chalk.greenBright('Binary Packet : '), response);

      const isDonePacket = isDoneSendingPacket(getDataArrBuffer(response));
      console.log('Done Packet Received : ', isDonePacket);
      isDonePacket && (global.isDonePacketReceived = true, PKT_RCV = PACKET_STATUS.PKT_DONE_SENDING_CCS);
      //response = response.toString();

      if (!flipServerRequest) {
        console.log('PKT_RCV : ' + PKT_RCV);
        if (PKT_RCV === 0) {
          //console.log(`Header Packet Received : ${chalk.yellowBright(response.match(/.{1,2}/g))}`);
          const ack = pktHdrUnwrap(getDataArrBuffer(response));
          PKT_RCV = global.isPktResend ? 0 : 1;
          console.log(chalk.cyan('Header ACK : '), ack);
          ws.send(ack);
          const isRetriesExceeded = global.retries >= RETRIES;
          const message = !global.isPktResend ? 'ACK Sent to CCS' : !isRetriesExceeded ? 'Resend ACK Sent' : 'Abort ACK Sent\n';
          
          if (isRetriesExceeded) {
            console.log(chalk.red('Multiple bad packets received, disconnecting the connection with CCS'));
            ws.terminate();
          }
          console.log(chalk.bgBlueBright(message));
          global.isPktResend = false;
          return;
        }

        if (pkt_status_values.includes(PKT_RCV) && PKT_RCV !== PACKET_STATUS.PKT_DONE_SENDING_CCS) {
         // console.log(`Data Packet Received : `, chalk.yellowBright(response));
          const { identifier } = global.current_hdr_pkt;
          const buffer = getDataArrBuffer(response);
          const def_data_pkt = data_pkts[+identifier.val];
          const ack = await pktData(buffer, def_data_pkt);

          console.log(chalk.cyan('Data Packet ACK : '), ack);
          ws.send(ack);
          
          if (global.isPktResend) {
            const isRetriesExceeded = global.retries >= RETRIES;
            if (isRetriesExceeded) {
              console.log(chalk.red('Multiple data bad packets received, disconnecting the connection with CCS'));
              ws.terminate();
            }
            console.log(chalk.bgBlueBright('Resend ACK Sent'));
            global.isPktResend = false;
            return;
          }

          if (!global.isEndingConn) {
            console.log(chalk.bgBlueBright('Data Packet ACk Sent to CCS'));
            PKT_RCV = 0;
          }

          // if (global.isNewPktAckSent && global.isDonePacketReceived) {
          //   console.log(chalk.yellowBright('Server New Packet Ack Sent to CCS'));
          //   console.log(chalk.cyan(`Reveived Done Packet Sending`));
          //   console.log(chalk.cyan('Server will sent the info packets.\n'));
          //   PKT_RCV = 0; 
          //   flipServerRequest = true;
          // }

         if (global.isEndingConn) {
            console.log(chalk.red('Disconnecting the connection with CCS'));
            ws.terminate();
          }

          if (global.isStateMachineEnds) {
            console.log(chalk.redBright('State Machine Ends. Waiting for Next Send...'));
            PKT_RCV = 0;
            global.isStateMachineEnds = false;
          }
        }

        if (PKT_RCV === PACKET_STATUS.PKT_DONE_SENDING_CCS) {
          const ack = getPktAck(0);
          console.log(chalk.cyan('Done Packet Sending ACK : '), ack);
          ws.send(ack);
          PKT_RCV = 0;
          if (global.isNewPktAckSent && global.isDonePacketReceived) {
            console.log(chalk.cyan(`Reveived Done Packet Sending`));
            console.log(chalk.cyan('Server will sent the info packets.\n'));
            PKT_RCV = 0;
            flipServerRequest = true;
            global.isNewPktAckSent = false;
            global.isDonePacketReceived = false;
            global.hasNewPacket = false;
            sendHeaderPacket(ws);
          }
        }
      } else {
        
        sendHeaderPacket(ws);
        // if (PKT_RCV === 0) {
        //   const hdr = generateHeaderPkt();
        //   console.log(chalk.greenBright(`Header Packet Ready to Send with data ${hdr}`));
        //   ws.send(hdr);
        //   PKT_RCV = +global.dataPacketId;
        //   console.log(chalk.greenBright('Header Packet Sent'));
        //   isAckReceived = true;
        //   return;
        // }
        if (isAckReceived) {
          console.log(chalk.greenBright(`Ack Received from unit: `), response);

          if (isDoneSending) {
            flipServerRequest = false;
            PKT_RCV = 0;
            console.log(chalk.magenta('WS server ready to receive the packets'));
          } else {
            sendHeaderPacket(ws);
          }
          isAckReceived = false;
          isDoneSending = false;
        }

        // if (isDoneSending) {
        //   const buffer = getPktAck(PACKET_STATUS.PKT_INITIAL_CONN);
        //   console.log(chalk.blue('PKT_DONE_SENDING_CCS Sent to CCS\n'));
        //   ws.send(buffer);
        //   isDoneSending = false;
        //   flipServerRequest = false;
        //   PKT_RCV = 0;
        //   console.log(chalk.magenta('WS server ready to receive the packets'));
        // }

        if (PKT_RCV === PACKET_STATUS.PKT_REGISTER_INFO) {
          const buffer = getDataArrBuffer(response);
          const { size, pkt } = pkt_ack;
          const [pktId, status] = pktUnwrap(buffer, pkt, size);
          if (+status === ACK_STATUS.ACK_STATUS_VALID) {
            ws.send(getDataPkt());
            console.log(chalk.blue(`Data Packet Sent to CCS`));
            isDoneSending = true;
            PKT_RCV = PACKET_STATUS.PKT_DONE_SENDING_CCS;
            await updateCCSUnitInfo();
          }
        }

        if (PKT_RCV === PACKET_STATUS.PKT_FIRMWARE) {
          const buffer = getDataArrBuffer(response);
          const [pktId, status] = pktUnwrap(buffer, pkt_ack.pkt, pkt_ack.size);
          if (+status === ACK_STATUS.ACK_STATUS_VALID) {
            const fPkt = getDataPktOriginal();
            const startIndex = (fPkt.pkt_seq.val - 1) * 1000;
            let endIndex = fPkt.pkt_seq.val * 1000;
            endIndex = fPkt.pkt_total_size.val < endIndex ? fPkt.pkt_total_size.val : endIndex;

            if (isFirmwareBinSend && fPkt.pkt_segments.val >= global.firmwareSequence) {
              const chunk = global.firmwareBinary.subarray(startIndex, endIndex);
              console.log(chalk.bgCyan(`Send 1000 bytes of sequence ${fPkt.pkt_seq.val} firmware binary`));
              ws.send(chunk);

              if (fPkt.pkt_segments.val <= fPkt.pkt_seq.val) {
                isDoneSending = true;
                PKT_RCV = PACKET_STATUS.PKT_DONE_SENDING_CCS;
              } else {
                isFirmwareBinSend = false;
                PKT_RCV = 0;
              }
              fPkt.pkt_seq.val += 1;
              fPkt.pkt_chunk_size.val = chunk.byteLength;
              return;
            }

            if (!isFirmwareBinSend) {
              console.log(chalk.blue(`Firmware Packet Sent to CCS for seq ${fPkt.pkt_seq.val}`));
              console.log(fPkt);
              ws.send(getDataPkt());
              isFirmwareBinSend = true;
            }
          }
        }

        if (PKT_RCV === PACKET_STATUS.PKT_ADMIN_INFO) {
          const buffer = getDataArrBuffer(response);
          console.log('PKT_ADMIN_INFO ack received : ', response);
          const [pktId, status] = pktUnwrap(buffer, pkt_ack.pkt, pkt_ack.size);
          const pkt = getDataPktOriginal();
          console.log(pkt);
          if (+status === ACK_STATUS.ACK_STATUS_VALID) {
            ws.send(getDataPkt());
            console.log(chalk.blue(`Data Packet PKT_ADMIN_INFO Sent to CCS`));
            // isDoneSending = true;
            global.dataPacketId = PACKET_STATUS.PKT_DONE_SENDING_CCS;
            dataPacket = { ...data_pkts[PACKET_STATUS.PKT_DONE_SENDING_CCS].pkt };
            dataPacket.status.val = 1;
            PKT_RCV = 0;
            isAckReceived = true;
            isRegisterInfoSend = true;
            // await updateCCSUnitInfo();
            // sendHeaderPacket(ws);
          }
        }

        if (PKT_RCV === PACKET_STATUS.PKT_DONE_SENDING_CCS) {
          const buffer = getDataArrBuffer(response);
          const [pktId, status] = pktUnwrap(buffer, pkt_ack.pkt, pkt_ack.size);
          const pkt = getDataPktOriginal();
          console.log(pkt);
          if (+status === ACK_STATUS.ACK_STATUS_VALID) {
            ws.send(getDataPkt());
            console.log(chalk.blue(`Done Packet Sending Sent to CCS`));
            // flipServerRequest = false;
            PKT_RCV = -1;
            isAckReceived = true;
            isDoneSending = true;
            isRegisterInfoSend && (await updateCCSUnitInfo());
            isRegisterInfoSend = false;
            // console.log(chalk.magenta('WS server ready to receive the packets'));
          }
        }
      }
    });

    ws.on('close', function(code, reason) {
      console.log('Connection closed');
      console.log(req.headers['sec-websocket-key']);
      console.log(code);
      console.log(reason);
      setInitialGlobalVariables();
    });

    ws.on('error', function(e) {
      console.log('WebSocket Error: ');
      console.log(e);
      /// ws.terminate();
    });

    console.log(chalk.cyan('Connection Valid ACK Packet : '), getPktAck(0, ACK_STATUS.ACK_STATUS_CONN_VALID));
    ws.send(getPktAck(0, ACK_STATUS.ACK_STATUS_CONN_VALID));
  } catch(err) {
    console.log(chalk.cyan('ACK Status Abort : '), getPktAck(0, ACK_STATUS.ACK_STATUS_CONN_VALID));
    console.log(chalk.red(`Web API Error : ${err.message}`));
    ws.send(getPktAck(0, ACK_STATUS.ACK_STATUS_ABORT));
    console.log(chalk.red(`Send Abort ACK and terminate connection\n`));
    console.log('server')
    ws.terminate();
  }
}

function setInitialGlobalVariables(ws) {
  global.isEndingConn = false; //global variable to store the flag to know connection is ending or not
  global.isPktResend = false; // global variable to store the current packet have to resend or not
  global.isNewPktAckSent = false; // global variable to know the status of new packet ack sent to unit 
  global.dataPacketId = 0; 
  global.firmwareSequence = 0; 
  global.firmwareBinary = null; //store firmware binary to get the original firmware binary in chunks
  global.isStateMachineEnds = false; // Flag to maintain state machine receives the last packet and go back to receive the initial con packet again
  global.retries = 0; // Store count of retires 3 times and disconnect the connection if it exceeds 3 times
  global.unitId = '' // store unitId while available data inside info stage sent to ccs to update the data_available flag
  global.ws = ws; // store the websocket instance
  global.isDonePacketReceived = false // global variable to manage done packet received
  global.pktAdminInfo = null // store packet admin info data into this variableew
  global.hasNewPacket = false;
  PKT_RCV = 0;
  flipServerRequest = false;
  isAckReceived = false;
  isDoneSending = false;
  isRegisterInfoSend = false;
  dataPacket = null;
}

function sendHeaderPacket(ws) {
  if (PKT_RCV === 0) {
    const hdr = generateHeaderPkt(dataPacket);
    console.log(chalk.greenBright(`Header Packet Ready to Send with data: `), hdr);
    ws.send(hdr, {binary: true});
    PKT_RCV = +global.dataPacketId;
    console.log(chalk.greenBright('Header Packet Sent'));
    isAckReceived = true;
    return;
  }
}

if (module.children) {
  var server = http.createServer(accept);
  server.listen(PORT, "0.0.0.0", () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log('running at http://' + host + ':' + port)
  });
} else {
  exports.accept = accept;
}