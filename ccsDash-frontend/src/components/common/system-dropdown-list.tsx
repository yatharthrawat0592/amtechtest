import * as React from 'react';
import { useSelector } from 'react-redux';
import { CcsSystem } from '../../models/system-model';
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

const SystemDropdownList = (props: {
    unitName: string[],
    onChange: (returnData: SelectChangeEvent<string[]>) => void,
}): JSX.Element => {

    const systems: CcsSystem[] = useSelector((state: RootState) => state.systems.systems);

    const systemList = systems?.map(system => (
        <MenuItem key={system.systemId} value={system.description}>
            <Checkbox checked={props.unitName.indexOf(system.description) > -1} />
            <ListItemText primary={system.description} />
        </MenuItem>
    ));
    
    return (
        <Select
            labelId="select-area-label"
            id="select-area"
            multiple
            value={props.unitName}
            onChange={props.onChange}
            input={<OutlinedInput label="Select Unit" />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
            size="small"
            disabled={systems?.length === 0}
        >
            {systemList}
        </Select>
    )

}

export default SystemDropdownList;