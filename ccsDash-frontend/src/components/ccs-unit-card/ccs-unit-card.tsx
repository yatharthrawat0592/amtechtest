import * as React from 'react';
import { useDispatch } from 'react-redux';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import '../common/css/ccs-unit-card.css'

import { updateSelectUnitId } from '../../store/actions/graphing-actions';
import { CcsUnitData, ccsUnitDataEmptyObj, CcsUnitInfo } from '../../models/unit-model';
import { CcsSystem } from '../../models/system-model';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getAllSystems } from '../../store/actions/system-actions';
import { getAllUnitInfo, getLatestUnitData , updateUnits} from '../../store/actions/unit-actions';
import { useInterval } from '../../hooks/use-interval';
import CardPrimaryItems from './card-primary-items';
import CcsCardActions from './ccs-card-actions';
import CcsCardSecondaryItems from './card-secondary-items';
import UpdateUnitModal from "../modals/update-unit-modal";
import sessionexpirelogout from "../../custom-functions/sessionexpirelogout";
import { useNavigate } from "react-router-dom";
import JwtTokenExpireAlert from "../../custom-functions/jwt-token-expire-alert";
import { getInfoStage, deleteInfoStage } from "../../store/actions/getInfo-action";
import Tooltip from '@mui/material/Tooltip';

const ACTIVE_SHADOW = {boxShadow: '0px 5px 10px 0px #3f3ae7'};
const NO_SHADOW = {
    boxShadow: '0px 0px 0px 0px',
  };

const CcsUnitCard = (props: {
  selectedUnits: string[]
}):JSX.Element => {
  const unitIdRef = React.useRef<string | undefined>('');
  const [expanded, setExpanded] = React.useState<string[]>([]);
  const [enabled, setEnabled] = React.useState<string[]>([]);
  const [unitData, setUnitData] = React.useState<CcsUnitData[]>([ccsUnitDataEmptyObj])
  const [showUpdateUnit, setShowUpdateUnit] = React.useState<boolean>(false);
  const [showUpdateSubmit, setShowUpdateSubmit] = React.useState<boolean>(false);
  const [unitIdInfo, setUnitId] = React.useState<String>();
  const [show, setShow] = React.useState<boolean>(false);
  const [activeUseEffect, setActiveUseEffect] = React.useState<boolean>(false);



  //const [systems, setSystems] = React.useState<CcsSystem[]>([ccsSystemEmptyObj])

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* all systems and units */
  const systems:CcsSystem[] = useSelector((state: RootState) => state.systems.systems);
  const unitInfo:CcsUnitInfo[] = useSelector((state: RootState) => state.units.unitInfo);

  /* Anchors and click handlers for drop-down menus */
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClickUnitSettings = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.currentTarget;
    const { unitId } = target.dataset;
    unitIdRef.current = unitId;
    setAnchorEl(event.currentTarget);
  };
  const handleShowUnitSettings = (e: any, unitId: String) => {
    setUnitId(unitIdRef.current);
    setShowUpdateUnit(true);
    setAnchorEl(null);
  };

  const handleCloseUpdateUnit = () => {
    setShowUpdateUnit(false);
    setTimeout(() => {
      dispatch(getAllUnitInfo())
    }, 1000);
  }

  const setClearIntervalFunc = async () => {
    setActiveUseEffect(true);
  };

  const onUpdateUnitSubmit = async (data: any) => {
    // Call updateUnitAPI
    const unitUpdateResp = await updateUnits(data);

    if (unitUpdateResp === "jwt expired") {
      setShow(true);
      setShowUpdateSubmit(true);
    }
      setTimeout(() => {
        dispatch(getAllUnitInfo())
      }, 1000)
    setShowUpdateUnit(false);
    setClearIntervalFunc();
  }

  const handleAlert = async (data:any) => {
    if (data === true && showUpdateSubmit === true) {
      const resp = await sessionexpirelogout();
      if (resp.message === "Logout Successfully!") {
        localStorage.clear();
        navigate("/", { state: { status: "Logout" } });
      }
    }
  }

  /* Add/remove the unit from the enabled unit ID list */
  const handleEnableClick = (idx: string) => {
    if(enabled.includes(idx)) {
      const enCopy = enabled.filter((e) => {
        return e !== idx;
      });
      setEnabled(enCopy);
    } else {
      const enCopy = [...enabled];
      enCopy.push(idx);
      setEnabled(enCopy);
    }
  }

  const handleSetExpanded = (isExpanded: string[]) => {
    setExpanded(isExpanded);
  }

  /* TODO: monitor selectedUnits and disable units
   * that are not part of the new array
  */

  React.useEffect( () => {
    /* when 'enabled' changes, update the selected units in the store*/
    dispatch(updateSelectUnitId(enabled));
  }, [enabled])

  React.useEffect(() => {
    /* load the units used for this system */
    /* first load the system areas */
    dispatch(getAllSystems());
    /* now get all of the units */
    dispatch(getAllUnitInfo());
    console.log(systems)
  }, [])
  
  React.useEffect(() => {
    var timerId = setInterval(async () => {
      const getAllResp = await getInfoStage(); //update unit
       if (getAllResp.length > 0) {
        getAllResp?.forEach((info, index) => {
          if (info.data_available === 0) {
            const unitIdObj = {
              unitId: info.unitId,
            };
            //deleteInfoStage(unitIdObj);
          }
        });
      }
      if (getAllResp.length === 0) {
        setActiveUseEffect(false);
        clearInterval(timerId);
      }
    }, 10000);
    if (window.timerId) {
      window.timerId?.push(timerId);
    }
    else {
      window.timerId = [timerId];
    }
  }, [activeUseEffect]);

  useInterval(async () => {
    /* we need to get a series of promises
     * and resolve all of them
     * from this list before we can render the data
     * Otherwise, we will lose the state of the object
     */
    
    const promises = props.selectedUnits?.map((selectedUnit) => {
      const selectedUnitData = getLatestUnitData(selectedUnit);
      return selectedUnitData;
    });

    //now wait to resolve all of the promises
    const resolvedUnitData = await Promise.all(promises);
    console.log(resolvedUnitData);
    const resolvedArray = resolvedUnitData?.map(e => {
      //need to round any non-integer values

      for(const key in e){
        if (typeof(e[key]) === 'number'){
          if (e[key]%1 !== 0){
            e[key] = e[key].toFixed(2);
          }
        }
      }

      return e;
    });
    console.log(resolvedArray);

    //add the empty object to the beginning of the array,
    // this is to prevent empty units from being indexed
    // on the page
    resolvedUnitData.unshift(ccsUnitDataEmptyObj)
    setUnitData(resolvedUnitData);
  }, 5000);

  const getDataIdx = (idx:string):number => {
      /* get the array index from the unit data for this unit */
      const unitIdx = unitData?.findIndex((u) => u?.unitIdRef === idx)
      if(unitIdx === -1){
          return 0;
      } else {
          return unitIdx;
      }
  }

  const renderUnitCard = () => { 
    const { selectedUnits } = props;
    if (selectedUnits.length) {
      const cards = selectedUnits?.map((unit) => {
        const selectedUnit: any = unitInfo?.find((u) => u?.unitId === unit);
        if (selectedUnit.deleted === 0) {
        return (
          <div key={selectedUnit.serial} className='unit-cardx'>
            <Card sx={{ minHeight: 215, maxWidth: 300}}
              key={selectedUnit.unitId}
              data-unit={unit}
              className="unit-card"
              style={enabled.includes(selectedUnit?.unitId) ? ACTIVE_SHADOW : NO_SHADOW}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: blue[900] }} aria-label={selectedUnit?.model}>
                    BB
                  </Avatar>
                }
                action={
                  <div>
                    <IconButton
                      aria-label="settings"
                      id={`Settings${selectedUnit?.unitId}`}
                      aria-controls={open ? `long-menu${selectedUnit.unitId}` : undefined}
                      aria-expanded={open ? 'true' : undefined}
                      aria-haspopup="true"
                      data-unit-id={selectedUnit?.unitId}
                      onClick={handleClickUnitSettings}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id={`long-menu${selectedUnit?.unitId}`}
                      MenuListProps={{
                        'aria-labelledby': `Settings${selectedUnit?.unitId}`
                      }}
                      anchorEl={anchorEl}
                      open={open}
                      onClose={() => setAnchorEl(null)}
                      PaperProps={{
                        style: {
                          maxHeight: 48 * 4.5,
                          width: '20ch'
                        }
                      }}
                    >
               
                      <MenuItem key={selectedUnit?.unitId} data-unit-id={selectedUnit?.unitId} value={selectedUnit?.unitId} onClick={(e) => handleShowUnitSettings(e, unit)}>
                        Edit Settings
                      </MenuItem>
             
                    </ Menu>
                  </div>
                }
                title={<>
                 <Tooltip title={`CCS Unit ${selectedUnit?.description}`} placement='top'>
                      <Typography>{`CCS Unit ${selectedUnit?.description}`}</Typography>
                    </Tooltip>
                </>
                }
                subheader={<>
                  <Tooltip title={`SN: ${selectedUnit?.serial}`} placement='top'>
                       <Typography>{`SN: ${selectedUnit?.serial}`}</Typography>
                     </Tooltip>
                 </>
                }
                className='custom-word-wrap'
                
              />
              <CardContent>
                <CardPrimaryItems
                  unitData={unitData[getDataIdx(selectedUnit?.unitId)]}
                  selectedUnit={selectedUnit}
                />
              </CardContent>
              <CcsCardActions
                onEnableClick={handleEnableClick}
                selectedUnit={selectedUnit}
                enabled={enabled}
                expanded={expanded}
                setExpanded={handleSetExpanded}
              />
            
              <CcsCardSecondaryItems
                expanded={expanded}
                selectedUnit={selectedUnit && (selectedUnit)}
                unitData={unitData[getDataIdx(selectedUnit?.unitId)]}
              />
            </Card>
            <UpdateUnitModal
              show={showUpdateUnit}
              unitId={unitIdInfo}
              handleClose={handleCloseUpdateUnit}
              onSubmit={onUpdateUnitSubmit}
            />
            <JwtTokenExpireAlert show={show} handleAlert={handleAlert} />
          </div>
        )
      }
      })
      return cards
    }
    return null;
  }

  return (
  <div className="cards-align">
      {renderUnitCard()}
  </div>
  )

}

// CcsUnitCard.defaultProps = {
//   text9: 'Sub-menu Item',
//   text6: 'Sub-menu Item',
//   text4: 'Sub-menu Item',
//   rootClassName: '',
//   text7: 'Sub-menu Item',
//   text1: 'Temp.',
//   text: 'Status',
//   text2: 'CFM',
//   heading: 'CCS Unit 1',
//   text8: 'Sub-menu Item',
//   text5: 'Sub-menu Item',
// }

// CcsUnitCard.propTypes = {
//   text9: PropTypes.string,
//   text6: PropTypes.string,
//   text4: PropTypes.string,
//   rootClassName: PropTypes.string,
//   text7: PropTypes.string,
//   text1: PropTypes.string,
//   text: PropTypes.string,
//   text2: PropTypes.string,
//   heading: PropTypes.string,
//   text8: PropTypes.string,
//   text5: PropTypes.string,
// }

export default CcsUnitCard
