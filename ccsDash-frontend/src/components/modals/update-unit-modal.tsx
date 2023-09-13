import * as React from 'react';
import { InputAdornment, TextField } from '@mui/material';
import { Dialog,
        DialogActions,
        DialogContent,
        DialogContentText,
        DialogTitle } from '@mui/material';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import { CcsUnitInfo, ccsUnitInfoEmptyObj } from '../../models/unit-model';
import { unitTypes } from '../../models/unitTypes-model';
import { useSelector } from 'react-redux';
import { deleteUnit,getAllUnitInfo } from "../../store/actions/unit-actions";
import { useDispatch } from 'react-redux';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

const style = {
    width: "100%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 1
}

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const UpdateUnitModal = (props: {
    show: boolean,
    unitId: any,
    handleClose: () => void,
    onSubmit: (returnData: any) => void
    }):JSX.Element => {

    const [data, setData] = React.useState<CcsUnitInfo>(ccsUnitInfoEmptyObj);
    const [modelPrefix, setModelPrefix] = React.useState<string>('');

    const [unitData, setUnitData] = React.useState();

    const unitInfo: CcsUnitInfo[] = useSelector((state: RootState) => state.units.unitInfo);
    const [isDisable, setDisable] = React.useState<boolean>(true);
    const [softPowerOff, setSoftPowerOff] = React.useState<boolean>(false);

    const dispatch = useDispatch();

    React.useEffect(() => {
        const respUnitFilter = unitInfo?.filter((e) => {
            return e.unitId === props.unitId;
        });
        setData(respUnitFilter[0]);
        setUnitData(respUnitFilter);    
        const softPowerOffRes = respUnitFilter[0]?.soft_power_off === 1 ? true : false;
        setSoftPowerOff(softPowerOffRes);
    },[props.unitId,unitInfo])

    const unitFields = [
        {
            name:'cfmSetPoint',
            label:'CFM Set Point',
            type:'number',
            select: false,
            selectFields:[],
            prefix: '',
            value:data?.cfmSetPoint
        },
        {
            name:'description',
            label:'Unit Name',
            type:'text',
            select: false,
            selectFields:[],
            prefix: '',
            value:data?.description
        },
        {
            name:'model',
            label:'Model',
            type:'text',
            select: true,
            selectFields: unitTypes,
            prefix: '',
            value: unitTypes.find((e) => e.num === Number(data?.model))?.label
        },
        {
            name:'serial',
            label:'Serial Number',
            type:'text',
            select: false,
            selectFields:[],
            prefix: modelPrefix,
            value: modelPrefix ? data?.serial.split("-")[2]: data?.serial
        },
        {
            name:'minimum_cfm_set_pt',
            label:'Minimum CFM Set Point',
            type:'number',
            select: false,
            selectFields:[],
            prefix: '',
            value:data?.minimum_cfm_set_pt
        },
        {
            name:'maximum_cfm_set_pt',
            label:'Maximum CFM Set Point',
            type:'number',
            select: false,
            selectFields:[],
            prefix: '',
            value:data?.maximum_cfm_set_pt
        },
    ];

    const handleSoftPowerOff = (event:any) => {
        setSoftPowerOff(event.target.checked)
    }

    const updateTextField = (event: any) => {
        if (event.target.name === 'model') {
            //need to map the model to its corresponding number
            setData({
                ...data,
                [event.target.name]:unitTypes.find((e) => e.label === event.target.value)?.num});
            const p = unitTypes.filter((u) => u.label === event.target.value);
            setModelPrefix(p[0].prefix);
        } else {
            setData({...data, [event.target.name]:event.target.value});
        }
        setDisable(false);
    };

    const handleAdd = (unitData: any) => {
        const filterSerial = data?.serial.includes("-") ? true : false;
        let result;
        if(modelPrefix && filterSerial === true){
            result = ({...data,
                        unitId:unitData.unitId,
                        serial: modelPrefix + "-" + data?.serial.split("-")[2],
                        elevation: 0,
                        elevationSetPoint: 0,
                        model: data?.model,
                        minimum_cfm_set_pt: data?.minimum_cfm_set_pt,
                        maximum_cfm_set_pt: data?.maximum_cfm_set_pt,
                        soft_power_off: softPowerOff === true ? 1 : 0
            })
            console.log("Data.model =");
            console.log(data?.model);

        }
        else if (modelPrefix && filterSerial === false) {
            result = ({...data,
                        unitId:unitData.unitId,
                        serial: modelPrefix + "-" + data?.serial,
                        elevation: 0,
                        elevationSetPoint: 0,
                        model: data?.model,
                        minimum_cfm_set_pt: data?.minimum_cfm_set_pt,
                        maximum_cfm_set_pt: data?.maximum_cfm_set_pt,
                        soft_power_off: softPowerOff === true ? 1 : 0
            })
        }
        else{
            result = ({...data,
                        unitId:unitData.unitId,
                        serial:data.serial,
                        elevation: 0,
                        elevationSetPoint: 0,
                        model: data?.model,
                        minimum_cfm_set_pt: data?.minimum_cfm_set_pt,
                        maximum_cfm_set_pt: data?.maximum_cfm_set_pt,
                        soft_power_off: softPowerOff === true ? 1 : 0
            })
        }
        setModelPrefix('');
        props.onSubmit(result);
    }

    const handleRemove = async () => {
        props.handleClose();
        setDisable(true);
        const deleteparam = {
            "unitId":props.unitId,
            "deleted":1
        }
        await deleteUnit(deleteparam);
        setTimeout(() => {
            dispatch(getAllUnitInfo());
          }, 1000)
    }

    const handleClose = () => {
        setModelPrefix('');
        props.handleClose();
    }

    return(
        <div>
            <Dialog 
                open={props.show} 
                /* onClose={props.handleClose} */>
                <DialogTitle>Edit Unit Settings</DialogTitle>
                <DialogContent>
                    <Box
                        component="form"
                        sx={style}
                        noValidate
                        autoComplete="off"
                    >
                    <Grid
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        >
                    {unitFields.map((u) => {
                        return(
                            <TextField
                                className='editUnitAlign'
                                key={u.name}
                                name={u.name}
                                margin="dense"
                                id={u.name}
                                label={u.label}
                                type={u.type}
                                sx={{ m:1, width: '25ch'}}
                                variant="filled"
                                select={u.select ?? false}
                                size="small"
                                onChange={updateTextField}
                                value={u.value}
                                InputProps={u.prefix !== '' ? {
                                    startAdornment: <InputAdornment position="start">
                                                        {modelPrefix}
                                                    </InputAdornment>
                                }: undefined}
                            >
                                {
                                    u.selectFields.map((field) => (
                                    <MenuItem key={field.label} value={field.label}>
                                        {field.label}
                                    </MenuItem>
                                    ))
                                }
                            </TextField>
                        )
                    })}
                    </Grid>

                <div className="softPowerOff">
                    <FormControlLabel
                        value="start"
                        control={<Switch color="primary" checked={softPowerOff} onChange={handleSoftPowerOff}/>}
                        label="Soft Power Off"
                        labelPlacement="start"
                    />
                </div>
                    </Box>
                    
                </DialogContent>
                <DialogActions>
                    <Button
                        className={"changeRemoveColor"}
                        onClick={handleRemove}>
                        Remove
                    </Button>
                    <Button onClick={() => handleAdd(unitData[0])}>Save</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    )

}


export default UpdateUnitModal;
