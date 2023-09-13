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

const style = {
    width: "100%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 1
}

const AddNewUnitModal = (props: {
    show: boolean,
    handleClose: () => void,
    onSubmit: (returnData: any) => void
    }):JSX.Element => {

    const [data, setData] = React.useState<CcsUnitInfo>(ccsUnitInfoEmptyObj);
    const [modelPrefix, setModelPrefix] = React.useState<string>('');

    const unitFields = [
        {
            name:'description',
            label:'Unit Name',
            type:'text',
            select: false,
            selectFields:[],
            prefix:''
        },
        {
            name:'model',
            label:'Model',
            type:'text',
            select: true,
            selectFields: unitTypes,
            prefix:''
        },
        {
            name:'serial',
            label:'Serial Number',
            type:'text',
            select: false,
            selectFields:[],
            prefix: modelPrefix
        },
        {
            name:'cfmSetPoint',
            label:'CFM Set Point',
            type:'number',
            select: false,
            selectFields:[],
            prefix: ''
        },
        {
            name:'minimum_cfm_set_pt',
            label:'Minimum CFM Set Point',
            type:'number',
            select: false,
            selectFields:[],
            prefix: '',
        },
        {
            name:'maximum_cfm_set_pt',
            label:'Maximum CFM Set Point',
            type:'number',
            select: false,
            selectFields:[],
            prefix: '',
        },
        /* removing installed elevation, we are not using it right now */
        // {
        //     name:'elevation',
        //     label:'Installed Elevation',
        //     type:'number',
        //     select: false,
        //     selectFields:[],
        //     prefix: ''
        // },
    ];

    const updateTextField = (event: any) => {
        setData({ ...data, [event.target.name]: event.target.value });
        //console.log(`${event.target.name}:${event.target.value}`);
        if (event.target.name === 'model') {
            const p = unitTypes.filter((u) => u.label === event.target.value);
            setModelPrefix(p[0].prefix)
        }
    };

    const handleClose = () => {
        setModelPrefix('');
        props.handleClose();
    }

    const handleAdd = () => {
        if(modelPrefix && data.serial){
            var result = ({
                ...data, 
                serial: modelPrefix + "-" + data.serial, 
                firmwareVersion: null,
                hardwareVersion:null, 
                wifiVersion: null,
                elevation: 0,
                minimum_cfm_set_pt: data?.minimum_cfm_set_pt,
                maximum_cfm_set_pt: data?.maximum_cfm_set_pt,
                model: unitTypes.find((e) => e.label === data?.model).num
            })
        }
       else{
            var result = ({
                    ...data,
                    serial:modelPrefix,
                    firmwareVersion: null,
                    hardwareVersion:null, 
                    wifiVersion: null,
                    elevation: 0,
                    minimum_cfm_set_pt: data?.minimum_cfm_set_pt,
                    maximum_cfm_set_pt: data?.maximum_cfm_set_pt,
                    model: unitTypes.find((e) => e.label === data?.model).num
            });
        }
        
        setModelPrefix('');
        props.onSubmit(result);
        setData({...data,serial:''});
    }

    return(
        <div>
            <Dialog 
                open={props.show} 
                /* onClose={props.handleClose} */>
                <DialogTitle>Add New Unit</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText>
                        Connect and add a new CCS unit
                    </DialogContentText> */}
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
                                className='addUnitAlignField'
                                key={u.name}
                                name={u.name}
                                margin="dense"
                                id={u.name}
                                label={u.label}
                                type={u.type}
                                sx={{ m:1, width: '25ch'}}
                                variant="filled"
                                select={u.select ?? false}
                                defaultValue=""
                                size="small"
                                onChange={updateTextField}
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
                    </Box>
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAdd}>Add</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
        // </Box>
    )

}


export default AddNewUnitModal;
