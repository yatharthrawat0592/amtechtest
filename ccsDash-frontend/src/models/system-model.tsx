export interface CcsSystem {
    systemId: string;
    dateCreated: string;
    createdBy: string;
    ccsUnitId: string[];
    description: string;
    associatedUnits:object[]
}

export const ccsSystemEmptyObj = {
    systemId: '',
    dateCreated: '',
    createdBy: '',
    ccsUnitId: [],
    description: '',
    associatedUnits:[]
}