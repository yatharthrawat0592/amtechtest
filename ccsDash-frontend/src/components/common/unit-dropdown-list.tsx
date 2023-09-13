import * as React from 'react';
import { useSelector } from 'react-redux';
import { CcsUnitInfo } from '../../models/unit-model';
import { RootState } from '../../store';

import { MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: "auto",
        }
    }
};

const UnitDropdownList = (props: {
    unitName: string[],
    onChange: (returnData: SelectChangeEvent<string[]>) => void,
}): JSX.Element => {

    /* get all units from the store */
    const unitInfo:CcsUnitInfo[] = useSelector((state: RootState) => state.units.unitInfo);
    const filteredData = unitInfo.filter((u) => u.deleted === 0);
    return (
        <Select
            className='addSystemAlignField alignUnitDropDown'
            labelId="select-area-label"
            id="select-units"
            multiple
            value={props.unitName}
            onChange={props.onChange}
            input={<OutlinedInput label="Associate Units" />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
            sx={{m:1, width:'25ch'}}
            size="small"
            disabled={unitInfo?.length === 0}
        >
            {filteredData?.map(u => (
                <MenuItem key={u.unitId} value={u.description}>
                    <Checkbox checked={props.unitName?.indexOf(u.description) > -1} />
                    <ListItemText primary={u.description} />
                </MenuItem>
            ))}
        </Select>
    )

}

export default UnitDropdownList;