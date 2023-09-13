import * as React from 'react';
import { useSelector } from 'react-redux';
import { CcsSystem } from '../../models/system-model';
import { RootState } from '../../store';

import { MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import FormControlLabel from '@mui/material/FormControlLabel';
import { useDispatch } from 'react-redux';

import { getAllSystems } from '../../store/actions/system-actions';


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

const SystemDropdownRadioList = (props: {
    unitNameString: string,
    handleSelectChange: (returnData: SelectChangeEvent<string[]>) => void,
}): JSX.Element => {

    const systems: CcsSystem[] = useSelector((state: RootState) => state.systems.systems);

    const populatedSystemData: CcsSystem[] = useSelector((state: RootState) => state.systems.populatedSystemData);

    const [radioSelect, setRadioSelect] = React.useState();
    
    const dispatch = useDispatch();

    React.useEffect(() => {
        /* load the units used for this system */
        dispatch(getAllSystems());
      },[])

    
    const handleChangeRadio = (e) => {
        props.handleSelectChange(e.target.value)
        setRadioSelect(e.target.value)
    }

    const systemList = systems?.map((u,index) => (
        <MenuItem key={u.systemId} value={u.description}>
            <FormControlLabel value={u.description}
                control={<Radio />} label={u.description} onChange={(e)=>handleChangeRadio(e)} />
        </MenuItem>
            ))
    
    
    return (
        <Select
            labelId="select-area-label"
            id="select-area"
            /* multiple */
            value={props.unitNameString}
            onChange={props.handleSelectChange}
            input={<OutlinedInput label="Select Unit" value={props.unitNameString}/>}
            //renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
            size="small"
            //value={radioSelect}
            //disabled={systems.length === 0}
            className="opacity-rm"
        >
            <RadioGroup defaultValue={radioSelect} >
                {systemList}              
            </RadioGroup>   
        </Select>
    )

}

export default SystemDropdownRadioList;