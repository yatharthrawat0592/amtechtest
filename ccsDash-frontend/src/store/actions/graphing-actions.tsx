import { graphingActions } from '../slices/graphing-slice';
import { GraphingInputs } from '../../models/graphing-model';

export const updateSelectUnitId = (unit: string[]) => {
    return async (dispatch: (arg0: { payload: any; type: string; }) => void) => {
        try {
            console.log("Update selected unit ID: ", unit);
            const tmpInputs:GraphingInputs = {
                limit: "300",
                selectUnitId: unit,
                refresh: "5s",
                from: "now-15m",
                to: "now"
            }

            dispatch(graphingActions.getSelectedUnits(
                {
                    graphInputs: tmpInputs
                }
            ))
        } catch(e) {
            console.log(e);
        }
    }
}