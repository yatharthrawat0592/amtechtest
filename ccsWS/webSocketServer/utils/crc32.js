const crcSeed = parseInt("04C11DB7", 16);

const CRC32 = (buf, seed, bufType) => {
    const len = buf.length;
    const polynomial = crcSeed;
    var crc = seed;
    var i;
    var j;
    for (i = 0; i < len; i++) {
        /* move byte into MSB of 32-bit CRC */
        //console.log(`Buf[${i}] = ${buf[i].charCodeAt(0).toString(10)}`);
        if(bufType === 'string'){
            //convert string to binary val
            crc ^= buf[i].charCodeAt(0).toString(10) << 24;
        } else if(bufType === 'bin') {
            crc ^= buf[i] << 24;
        } else {
            //default
            crc ^= buf[i] << 24;
        }

        for (j = 0; j < 8; j++){
            /* test for MSB = bit 31 */
            if((crc & parseInt("80000000", 16)) !== 0) {
                crc = ((crc << 1) ^ polynomial);
            } else {
                crc <<= 1;
            }
        }
    }
    return (crc);
}

module.exports = {CRC32};