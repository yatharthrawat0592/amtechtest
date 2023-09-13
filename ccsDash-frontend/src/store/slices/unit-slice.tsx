import { createSlice } from '@reduxjs/toolkit';
import { CcsUnitData, CcsUnitInfo } from '../../models/unit-model';

 
interface Units {
    unitInfo: CcsUnitInfo[];
    unitData: CcsUnitData[];
}

const initialState:Units = {
    unitInfo: [],
    unitData: [],
}

const unitSlice = createSlice ({
    name: 'units',
    initialState,
    reducers: {
        getAllUnits(state, action) {
            state.unitInfo = action.payload.unitInfo;
        }
    }
})

export const unitActions = unitSlice.actions;
export default unitSlice;