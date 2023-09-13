import * as React from "react";
import { useSelector } from "react-redux";
import {
  InputAdornment,
  TextField,
  InputLabel,
  FormControl,
} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
  MenuItem,
  Grid,
  SelectChangeEvent,
} from "@mui/material";
import { CcsUnitInfo, ccsUnitInfoEmptyObj } from "../../models/unit-model";
import { RootState } from "../../store";
import UnitDropdownList from "../common/unit-dropdown-list";
import { unitTypes } from "../../models/unitTypes-model";
import { CcsSystem, ccsSystemEmptyObj } from "../../models/system-model";
import SystemDropdownList from "../common/system-dropdown-list";
import SystemDropdownRadioList from "../common/system-dropdown-radio-list";
import {
  populateSystemFields,
  deleteSystem,
  resetPopulatedState,
} from "../../store/actions/system-actions";
import { every } from "rxjs";
import { notificationService } from "../../services/notification-service";
import { useDispatch } from "react-redux";
import { getAllSystems } from "../../store/actions/system-actions";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../store/actions/login-register-logout-action";
import Snackbar from '@mui/material/Snackbar';
import sessionexpirelogout from "../../custom-functions/sessionexpirelogout";
import JwtTokenExpireAlert from "../../custom-functions/jwt-token-expire-alert";


const style = {
  width: "100%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 1,
};

const UpdateSystemModal = (props: {
  show: boolean;
  handleClose: () => void;
  onSubmitUpdateSystem: (returnData: any) => void;
  handleDelete:(returnData: any) => void;
}): JSX.Element => {
  const [data, setData] = React.useState<CcsSystem>(ccsSystemEmptyObj);
  const [modelPrefix, setModelPrefix] = React.useState<string>("");
  const [unitNameString, setUnitNameString] = React.useState<string>("");
  const [unitName, setUnitName] = React.useState<string[]>([]);
  const [associatedUnits, setAssociatedUnits] = React.useState<string[]>([]);
  const [populateData, setPupulateData] = React.useState();
  const [desc, setDesc] = React.useState<string>("");
  const [createdBy, setCreatedBy] = React.useState<string>("");

  const [isSystemId, setSystemId] = React.useState<string>("");
  const [isDisable, setDisable] = React.useState<boolean>(true);

  const [isEmptyField, emptyField] = React.useState<boolean>();

  const [show, setShow] = React.useState<boolean>(false);
  const [showUpdateSubmit, setShowUpdateSubmit] = React.useState<boolean>(false);

  const unitInfo: CcsUnitInfo[] = useSelector(
    (state: RootState) => state.units.unitInfo
  );
  /* all systems and units */
  const systems: CcsSystem[] = useSelector(
    (state: RootState) => state.systems.systems
  );

  const systemData: CcsSystem[] = useSelector(
    (state: RootState) => state.systems.systemData
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const updateTextFieldCreatedby = (event: any) => {
    setCreatedBy(event.target.value);
    if (event.target.name === "model") {
      const p = unitTypes.filter((u) => u.label === event.target.value);
      setModelPrefix(p[0].prefix);
    }
  };

  const updateTextFieldDesc = (event: any) => {
    setDesc(event.target.value);
    if (event.target.name === "model") {
      const p = unitTypes.filter((u) => u.label === event.target.value);
      setModelPrefix(p[0].prefix);
    }
  };

  const handleSelectUnitChange = (
    event: SelectChangeEvent<typeof unitName>
  ) => {
    /* Update the unit names with the selected descriptions */
    const {
      target: { value },
    } = event;

    setUnitName(typeof value === "string" ? value.split(",") : value);
  };

  const handleUpdate = async () => {
    const unitWithIds: { unitId: string; description: string }[] = [];

    /* this is for getting unitids with description for payload*/
    unitInfo?.forEach((item) => {
      if (unitName.indexOf(item.description) > -1) {
        const temp = {
          unitId: item.unitId,
          description: item.description,
        };
        unitWithIds.push(temp);
      }
    });

    const updateObj = {
      systemId: isSystemId,
      createdBy: createdBy,
      description: desc,
      unitWithIds: unitWithIds,
    };
    props.onSubmitUpdateSystem(updateObj);
    props.handleClose();
    setCreatedBy("");
    setDesc("");
    setUnitName([]);
    setUnitNameString("");
    setDisable(true);
    dispatch(resetPopulatedState());
  };

  const handleRemove = async () => {
    props.handleClose();
    setDisable(true);
    const deleteparam = {
      systemId: isSystemId,
    };

    const systemDel = systems.find((e) => e.systemId === isSystemId);

    setCreatedBy("");
    setDesc("");
    setUnitName([]);
    setUnitNameString("");
    dispatch(resetPopulatedState());
    const systemDeleteResp = await deleteSystem(deleteparam);

    if (systemDeleteResp === "jwt expired") {
      setShow(true);
      setShowUpdateSubmit(true);
    };

    dispatch(getAllSystems());
    props.handleDelete(systemDel);
  };

  const handleAlert = async (data:any) => {
    if (data === true && showUpdateSubmit === true) {
      const resp = await sessionexpirelogout();
      if (resp.message === "Logout Successfully!") {
        localStorage.clear();
        navigate("/", { state: { status: "Logout" } });
      }
    }
  }

  const handleClose = () => {
    props.handleClose();
    setUnitName([]);
    setUnitNameString("");
    setCreatedBy("");
    setDesc("");
    dispatch(getAllSystems());
    setDisable(true);

    dispatch(resetPopulatedState());
  };

  const handleSelectChange = async (
    event: SelectChangeEvent<typeof unitNameString>
  ) => {
    /* Update the unit names with the selected descriptions */
    if (typeof event == "string") {
      dispatch(populateSystemFields(event));
      setDisable(false);
      setUnitNameString(event);
    }
  };

  // On render it will be setting the unitnames in the array if there is any associated unit ids
  React.useEffect(() => {
    const filteredArray = unitInfo
      ?.filter((obj1) =>
        associatedUnits?.some((obj2) => obj2.unitAssociationId === obj1.unitId) && obj1.deleted === 0
      )
      .map((item) => item.description);
    setUnitName(filteredArray);
  }, [associatedUnits]);

  React.useEffect(() => {
    if (systemData && systemData.length != 0) {
      setSystemId(systemData?.systemId);
      setDesc(systemData?.description);
      setCreatedBy(systemData?.createdBy);
      setAssociatedUnits(systemData?.associatedUnits);
      setDisable(false);
    }

    /* subscribe to unitName and update the system object */
    /* get the unit ids */

    let unitIds: string[] = [];
    /* push the unit IDs into an array */
    unitInfo?.forEach((u) => {
      if (unitName.indexOf(u.description) > -1) {
        unitIds.push(u.unitId);
      }
    });
    /* TODO: the solution to doing this more cleanly
     *  will be to associate the entire unit into
     *  the system object, rather than just the IDs
     */
    /* update the data state */
    setData({ ...data, ccsUnitId: unitIds });
  }, [unitName, populateData, systemData]);

  return (
    <div>
      <Dialog
        open={props.show}
        //</div>onClose={props.handleClose}
      >
        <DialogTitle>Update System</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
                        Connect and add a new CCS unit
                    </DialogContentText> */}
          <Box component="form" sx={style} noValidate autoComplete="off">
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center">
              
                <FormControl sx={{ m: 1, width: 220}} 
                  className="updateSystemAlignField alignSysName">
                  <InputLabel id="select-area-label">
                    {systems?.length === 0 ? `Please add a system` : `Systems`}
                  </InputLabel>
                  <SystemDropdownRadioList
                    unitNameString={unitNameString}
                    handleSelectChange={handleSelectChange}
                  />
                </FormControl>
              
              <TextField
                className="updateSystemAlignField alignSysName"
                key={"description"}
                name={"description"}
                margin="dense"
                id={"description"}
                label={"System Name"}
                sx={{ m: 1, width: "25ch" }}
                variant="filled"
                type="text"
                select={false ?? false}
                //placeholder="Enter Description"
                value={desc}
                onChange={(e) => {
                  updateTextFieldDesc(e);
                }}
                InputProps={
                  "" !== ""
                    ? {
                        startAdornment: (
                          <InputAdornment position="start">
                            {modelPrefix}
                          </InputAdornment>
                        ),
                      }
                    : undefined
                }
              />

              <TextField
                className="updateSystemAlignField alignSysName"
                key={"createdBy"}
                name={"createdBy"}
                margin="dense"
                id={"createdBy"}
                label={"Created By"}
                type={"text"}
                sx={{ m: 1, width: "25ch" }}
                variant="filled"
                select={false ?? false}
                //defaultValue={u.default}
                value={createdBy}
                size="small"
                //onChange={updateTextFieldCreatedby}
                InputProps={
                  "" !== ""
                    ? {
                        startAdornment: (
                          <InputAdornment position="start">
                            {modelPrefix}
                          </InputAdornment>
                        ),
                      }
                    : undefined
                }
              />

                <FormControl sx={{ m: 1, width: 240 }} className="updateSystemAlignField alignSysName">
                  <InputLabel id="changeUnit">
                    {systems?.length === 0 ? `Please Select Units` : `Select Units`}
                  </InputLabel>
                  <UnitDropdownList
                    unitName={unitName}
                    onChange={handleSelectUnitChange}
                  />
                </FormControl>
             
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={isDisable}
            className={isDisable === false ? "changeRemoveColor" : ""}
            onClick={handleRemove}>
            Remove
          </Button>
          <Button disabled={isDisable} onClick={handleUpdate}>
            Update
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
      
      <JwtTokenExpireAlert show={show} handleAlert={handleAlert} />
    </div>
    // </Box>
  );
};

export default UpdateSystemModal;
