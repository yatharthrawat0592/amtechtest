import { createSlice } from '@reduxjs/toolkit';
import { GraphingInputs, GraphEmptyObj } from '../../models/graphing-model';

interface GraphViewData {
    graphInputs: GraphingInputs;
}

const initialState:GraphViewData = {
    graphInputs: GraphEmptyObj
}

const graphingSlice = createSlice ({
    name: 'graphing',
    initialState,
    reducers: {
        getSelectedUnits(state, action){
            state.graphInputs = action.payload.graphInputs;
        }
    }
})

export const graphingActions = graphingSlice.actions;
export default graphingSlice;