const JSZip = require('jszip');
const fs = require('fs/promises');
const path = require('path');
const { getDataArrBuffer } = require('../utils/helper');
const bin = path.resolve(__dirname, '..', 'bb_firmware_v2.013.bin');

async function zippedBinary() {
    const zip = new JSZip();
    const content = await fs.readFile(bin);
    zip.file(bin, content, { binary: !0 });
    const zipped = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
    const view = new Uint8Array(zipped);
    const mappedBin = [...view].map((v) => v.toString(16).padStart(2, "0")).join('');
    return mappedBin
}

async function unzipBinary(zipBin) {
    const unzip = new JSZip();
    const buffer = getDataArrBuffer(zipBin);
    const zip = await unzip.loadAsync(buffer);
    const unzipBuffer = await zip.file(bin).async("uint8array");
    return unzipBuffer;
}

// zippedBinary().then(console.log)

module.exports =  { unzipBinary };
