import * as React from 'react';

import { Button, Menu, MenuItem } from '@mui/material';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';


const ConfigButtonDropdown = (props: {
    onSubmit: (returnData: string) => void,
    options: any[]
}): JSX.Element => {

    /* Anchors and click handlers for drop-down menus */
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClickUnitSettings = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseUnitSettings = () => {
        setAnchorEl(null);
    };
    const handleOnClick = (name: string) => {
        props.onSubmit(name);
        handleCloseUnitSettings();
    }

    return (
        <div>
            <Button variant="outlined" 
                size="small"
                endIcon={<PlaylistAddIcon />} 
                aria-controls={open ? `long-menu` : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClickUnitSettings}
                >
                Config
            </Button>
            <Menu
                id={`long-menu`}
                MenuListProps={{
                    'aria-labelledby': `Settings`
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseUnitSettings}
                PaperProps={{
                    style: {
                        maxHeight: 48*4.5,
                        width: '20ch'
                    }
                }}
            >
                {props.options.map((option) => (
                    <MenuItem key={option.name}
                        onClick={() => handleOnClick(option.name)}>
                            {option.label}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    )
}

export default ConfigButtonDropdown;