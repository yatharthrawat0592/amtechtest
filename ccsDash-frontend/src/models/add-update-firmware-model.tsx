export interface AddUpdateFirmware {
    firmwareId: string,
    firmwareVersion: number;
    firmwareActive: boolean;
    firmwareName: string;
}

export const addUpdateFirmwareEmptyObj = {
    firmwareId:"",
    firmwareVersion: 0,
    firmwareActive: false,
    firmwareName:""
}