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

const UserDropdownRadioList = (props: {
    userRoleNameString: string,
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

    return (
        <Select
            labelId="select-area-label"
            id="select-area"
            value={props.userRoleNameString}
            onChange={props.handleSelectChange}
            input={<OutlinedInput label="Select Unit" value={props.userRoleNameString}/>}
            MenuProps={MenuProps}
            size="small"
            className="opacity-rm"
        >
            <RadioGroup defaultValue={radioSelect} >
                <MenuItem key={1} value={"Admin"}>
                <FormControlLabel value={"Admin"}
                    control={<Radio />} label={"Admin"} onChange={(e)=>handleChangeRadio(e)} />
                </MenuItem>  
                
                <MenuItem key={2} value={"Manager"}>
                <FormControlLabel value={"Manager"}
                    control={<Radio />} label={"Manager"} onChange={(e)=>handleChangeRadio(e)} />
                </MenuItem>
            </RadioGroup>   
        </Select>
    )

}

export default UserDropdownRadioList;