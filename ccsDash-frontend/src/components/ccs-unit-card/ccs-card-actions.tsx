import IconButton, { IconButtonProps } from "@mui/material/IconButton"
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CcsUnitInfo } from "../../models/unit-model";
import CardActions from '@mui/material/CardActions';
import { styled } from '@mui/material/styles';


/* The "Card Actions" is the part of the MUI card
 * that allow for functions and other card features
 * to be called.
 * In this case, we have the "Show in Graph" selector
 * and the ability to expand the card
 */

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
  }

/* Theme definition for expanded card property */ 
const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })
  (({ theme, expand }) => ({
        transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
        marginLeft: 'auto',
        transition: theme.transitions
          .create('transform', {
            duration: theme.transitions.duration.shortest,
          }),
  }));

const CcsCardActions = (props: {
    onEnableClick: (returnData: any) => void,
    selectedUnit: CcsUnitInfo,
    enabled: string[],
    expanded: string[],
    setExpanded: (returnData: any) => void
}):JSX.Element => {
    console.log("Selected_Units:",props.selectedUnit)
    const handleExpandClick = (idx: string) => {
        if(props.expanded.includes(idx)) {
          const expCopy = props.expanded.filter((e) => {
            return e !== idx;
          });
          props.setExpanded(expCopy);
        } else {
          const expCopy = [...props.expanded];
          expCopy.push(idx);
          props.setExpanded(expCopy);
        }
    }

    return(
        <CardActions disableSpacing>
            <IconButton 
                aria-label="show in graph"
                onClick={() => props.onEnableClick(props.selectedUnit.unitId)}>
                { props.enabled.includes(props.selectedUnit.unitId) ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon /> }
            </IconButton>
            Show in graph
            <ExpandMore
                expand={props.expanded.includes(props.selectedUnit.unitId)} 
                onClick={() => handleExpandClick(props.selectedUnit.unitId)}
                aria-expanded={props.expanded.includes(props.selectedUnit.unitId)}
                aria-label="show more"
            >
                <ExpandMoreIcon />
            </ExpandMore>
        </CardActions>
)}

export default CcsCardActions