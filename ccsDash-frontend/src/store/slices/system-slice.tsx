import { createSlice } from '@reduxjs/toolkit';
import { CcsSystem, ccsSystemEmptyObj } from '../../models/system-model';

interface SystemData {
    systemInputs: CcsSystem;
    systems: CcsSystem[];
    systemData: CcsSystem[];
}

const initialState:SystemData = {
    systemInputs: ccsSystemEmptyObj,
    systems: [],
    systemData:[]
}

const systemSlice = createSlice ({
    name: 'system',
    initialState,
    reducers: {
        createNewSystem(state, action){
            state.systemInputs = action.payload.systemInputs;
        },
        getAllSystems(state, action){
            state.systems = action.payload.systems;
        },
        getPopulatedSystems(state, action){
            state.systemData = action.payload.systemData;
        }
    }
})

export const systemActions = systemSlice.actions;
export default systemSlice;