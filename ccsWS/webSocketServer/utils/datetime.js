function pktTimePack(hr, min, sec) {
    let _time = 0;
    _time |= (hr | (min << 5) | (sec << 11))
    return _time;
}

function pktTimeUnPack(time) {
    const hr = (time & 0x1f);
    const min = ((time >> 5) & 0x3f);
    const sec = ((time >> 11) & 0x3f);
    return { hr, min, sec }
}

function pktDatePack(yr, month, day, utc) {
    let _date = 0;
    _date |= ((utc) | ((yr - 2000) << 7) | (month << 15) | (day << 19));
    return _date;
}

function pktDateUnPack(date) {
    const utc = (date & 0x0000007f);
    const yr = (((date >> 7) & 0x000000ff) + 2000);
    const month = ((date >> 15) & 0x0000000f);
    const day = ((date >> 19) & 0x0000001f);
    return { utc, yr, month, day };
}

module.exports = {
    pktDateTimeSrc(date, time) {
        const { yr, month, day } = pktDateUnPack(date);
        const { hr, min, sec } = pktTimeUnPack(time);
        const _date = new Date(Date.UTC(yr, month, day, hr, min, sec));     
        return _date
    }
}