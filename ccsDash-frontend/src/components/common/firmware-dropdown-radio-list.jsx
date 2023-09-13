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
import { getALLFirmware } from "../../store/actions/firmware-action";


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

const FirmwareDropdownRadioList = (props: {
    firmwareNameString: string,
    handleSelectChange: (returnData: SelectChangeEvent<string[]>) => void,
}): JSX.Element => {

    const systems: CcsSystem[] = useSelector((state: RootState) => state.systems.systems);

    const [radioSelect, setRadioSelect] = React.useState();
    const [allFirmware, setAllfirmware] = React.useState();
    
    const dispatch = useDispatch();

    React.useEffect(() => {
        const getFirmware = async () => {
            const response = await getALLFirmware();
            if (response !== "jwt expired") {
                setAllfirmware(response);   
            }
          };
        
        getFirmware();
        
        dispatch(getAllSystems());
      },[])

    
    const handleChangeRadio = (e) => {
        props.handleSelectChange(e.target.value)
        setRadioSelect(e.target.value)
    }

    const systemList = allFirmware?.map((u,index) => (
        <MenuItem key={u.firmwareId} value={u.firmwareName}>
            <FormControlLabel value={u.firmwareName}
                control={<Radio />} label={u.firmwareName} onChange={(e)=>handleChangeRadio(e)} />
        </MenuItem>
            ))
    
    
    return (
        <Select
            labelId="select-area-label"
            id="select-area"
            value={props.firmwareNameString}
            onChange={props.handleSelectChange}
            input={<OutlinedInput label="Select Firmware" value={props.firmwareNameString}/>}
            MenuProps={MenuProps}
            size="small"
            className="opacity-rm"
        >
            <RadioGroup defaultValue={radioSelect} >
                {systemList}              
            </RadioGroup>   
        </Select>
    )

}

export default FirmwareDropdownRadioList;