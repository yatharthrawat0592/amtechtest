/* eslint-disable @typescript-eslint/no-unused-expressions */
import Collapse from '@mui/material/Collapse';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Stack, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { unitTypes } from '../../models/unitTypes-model';

import { CcsUnitData, CcsUnitInfo } from "../../models/unit-model";
import { byString } from '../common/utils/object-bystring';

/* Theme definition for item list */
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    alignItems: 'center',
    display: 'flex',
    color: theme.palette.text.secondary,
  }));

const listOptions = [
    {
        label: "CFM Set Point: ",
        dataSet: 'selectedUnit',
        key: 'cfmSetPoint'
    },
    {
        label: "Serial Number: ",
        dataSet: 'selectedUnit',
        key: 'serial'
    },
    {
        label: "Model: ",
        dataSet: 'selectedUnit',
        key: 'model'
    },
    {
        label: "PWM: ",
        dataSet: "unitData",
        key: 'pwm'
    },
    {
        label: "Filter pressure (psi): ",
        dataSet: "unitData",
        key: 'ps1'
    },
    {
        label: "Fan outlet pressure (psi): ",
        dataSet: "unitData",
        key: 'ps2'
    },
    {
        label: "Power (power_vdc) VDC: ",
        dataSet: "unitData",
        key: 'power_vdc'
    },
    {
        label: "Minimum CFM Set Point: ",
        dataSet: "selectedUnit",
        key: 'minimum_cfm_set_pt'
    },
    {
        label: "Maximum CFM Set Point: ",
        dataSet: "selectedUnit",
        key: 'maximum_cfm_set_pt'
    }
]

const CcsCardSecondaryItems = (props: {
    expanded: string[],
    selectedUnit: CcsUnitInfo,
    unitData: CcsUnitData
}): JSX.Element => {
    /* This returns the "Collapsed" portion of the
     * card
     */

    //this feels a little hacky to me, but
    // I am trying to make the list generation dynamic,
    // but I am having potentially multiple datasources
    // so i first join the objects and then dereference them
    // when building the stackItemList
    
    const unitTypeResp = unitTypes.find((e) => e.num === Number(props.selectedUnit?.model))?.label;

    const replicaUnitObj = { ...props.selectedUnit };
    replicaUnitObj.model = unitTypeResp;

    replicaUnitObj.minimum_cfm_set_pt = props.selectedUnit?.minimum_cfm_set_pt === null ? 0 : props.selectedUnit?.minimum_cfm_set_pt;
    replicaUnitObj.maximum_cfm_set_pt = props.selectedUnit?.maximum_cfm_set_pt === null ? 0 : props.selectedUnit?.maximum_cfm_set_pt;
    

    const replicaUnitData = { ...props.unitData };
   
    replicaUnitData.power_vdc = props.unitData?.power_vdc === null ? 0 : props.unitData?.power_vdc;
    
    const agg = { selectedUnit: replicaUnitObj, unitData: replicaUnitData }
    
    const stackItemList = listOptions.map((option) => {
        return(
            <Item key={option.key}>
                <b>{option.label}&nbsp;</b> {byString(agg, `${option.dataSet}.${option.key}`)}
            </Item>
        )
    })

    return(
        <Collapse in={props.expanded.includes(props.selectedUnit.unitId)} 
                  timeout="auto"
                  unmountOnExit>
          <CardContent>
            <Typography variant="h5" align="center" gutterBottom>
                <u>Extended info:</u>
            </Typography>
            <Stack spacing={0.5}>
                {stackItemList}
            </Stack>
          </CardContent>
        </Collapse>
    )
}

export default CcsCardSecondaryItems;