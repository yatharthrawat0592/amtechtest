import * as React from 'react';
import { TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';

const InputTextFields = (props: {
    unitFields:any[]
    }):JSX.Element => {

    const textFields = props.unitFields.map((u) => {
        return(
            <TextField
                margin="dense"
                id={u.name}
                label={u.label}
                type={u.type}
                sx={{ m:1, width: '25ch'}}
                variant="filled"
                key={u.name}
                select={u.select ?? false}
                defaultValue=""
            >
                {
                    u.selectFields.map((field:any) => (
                    <MenuItem key={field} value={field || ''}>
                        {field}
                    </MenuItem>
                    ))
                }
            </TextField>
        )
    })

    return (<div>
            {textFields}
            </div>);

}

export default InputTextFields;