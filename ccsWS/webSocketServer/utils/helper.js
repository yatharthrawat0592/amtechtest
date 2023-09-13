module.exports = {
    merge(arr) {
        return arr.reduce((p, c) => {
            for (let [k, v] of Object.entries(c)) {
                p[k] = v;
            }
            return p;
        }, {});
    },
    // get data array buffer
    getDataArrBuffer(pkt) {
        const rawBuffer = new ArrayBuffer(pkt.length);
        const arrayedBinary = new Uint8Array(rawBuffer);
        var i = 0;
        while ( i < (pkt.length)) {
            arrayedBinary[i] = pkt[i];
            i = i+1;
        }
        console.log("Arrayed binary: ");
        console.log(arrayedBinary);

        return arrayedBinary;
    }
}