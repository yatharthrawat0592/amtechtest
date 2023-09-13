export interface CcsUnitInfo {
    deleted: number;
    unitId: string;
    serial: string;
    model: string;
    firmwareVersion: number;
    hardwareVersion: number;
    wifiVersion: number;
    cfmSetPoint: number;
    elevation: number;
    pAmbient: number;
    lastUpdateSent?: string;
    lastUpdateReceived?: string;
    rebootDateTime?: string;
    errLog?: number;
    description: string;
}

export const ccsUnitInfoEmptyObj:CcsUnitInfo = {
    unitId: '',
    serial: '',
    model: '',
    firmwareVersion: 2.25,
    hardwareVersion: 1.13,
    wifiVersion: 1.08,
    cfmSetPoint: 0,
    elevation: 0,
    pAmbient: 0,
    lastUpdateSent: '',
    lastUpdateReceived: '',
    rebootDateTime: '',
    errLog: 0,
    description: '',
}

export interface CcsUnitData {
    unitIdRef: string;
    status: number;
    temperature: number;
    cfm: number;
    filterLife: number;
    pwm: number;
    ps1: number;
    ps2: number;
    updateReceived: string;
    power_vdc : number
}

export const ccsUnitDataEmptyObj:CcsUnitData = {
    unitIdRef: '',
    status: 0,
    temperature: 0,
    cfm: 0,
    filterLife: 0,
    pwm: 0,
    ps1: 0,
    ps2: 0,
    updateReceived: '',
    power_vdc: 0
}