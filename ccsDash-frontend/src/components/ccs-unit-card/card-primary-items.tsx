import { Stack, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import CircleIcon from '@mui/icons-material/Circle';

import { CcsUnitData, CcsUnitInfo } from "../../models/unit-model"
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
        label: "Air Speed: ",
        dataSet: '',
        key: 'cfm',
        unit: 'cfm',
        transform: 1
    },
    {
        label: "Filter Life: ",
        dataSet: '',
        key: 'filterLife',
        unit: '%',
        transform: 100
    },
    {
        label: "Temperature: ",
        dataSet: '',
        key: 'temperature',
        unit: '\u00B0C',
        transform: 1
    },
  ]
  /* The primary card items is the list of items
   * That appears with every unit card as a stack
   * these are also updated with the unit data
   */
const CardPrimaryItems = (props: {
    unitData: CcsUnitData,
    selectedUnit: CcsUnitInfo
}):any => {

    const stackItemList = listOptions.map((option) => {
        return(
            <Item key={option.key}>
                <b>{option.label}&nbsp;</b> {Math.round(byString(props.unitData, `${option.key}`) * option.transform)} {option.unit}
            </Item>
        )
    })

//return the items inside a stack
// documentation here:
// https://mui.com/material-ui/react-stack/
    return(
        <Stack spacing={0.5}>
            <Item>
              <b>Status: </b> <CircleIcon color={props.unitData.status === 0 ? "success" : "disabled"}/>
            </Item>
            {stackItemList}
            {/* <Item>
              <b>Air Speed: </b> {props.unitData.cfm} cfm
            </Item>
            <Item>
              <b>Temperature: </b> {props.unitData.temperature} {'\u00B0C'}
            </Item> */}
        </Stack>
    )
}

export default CardPrimaryItems;