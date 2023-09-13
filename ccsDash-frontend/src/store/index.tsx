import { configureStore } from '@reduxjs/toolkit';
import graphingSlice from './slices/graphing-slice';
import systemSlice from './slices/system-slice';
import unitSlice from './slices/unit-slice';

const store = configureStore({
    reducer: {
        graphing: graphingSlice.reducer,
        systems: systemSlice.reducer,
        units: unitSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck:false,
        })
}); 

export type RootState = ReturnType<typeof store.getState>
export default store;