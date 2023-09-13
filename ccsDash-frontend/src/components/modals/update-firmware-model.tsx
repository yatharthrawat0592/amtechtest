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
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { RootState } from "../../store";
import { CcsSystem, ccsSystemEmptyObj } from "../../models/system-model";

import FirmwareDropdownRadioList from "../common/firmware-dropdown-radio-list";

import Checkbox from "@mui/material/Checkbox";
import { useDispatch } from "react-redux";
import { getAllSystems } from "../../store/actions/system-actions";
import {
  getFirmwarePopulated,
  deleteFirmware,
} from "../../store/actions/firmware-action";
import sessionexpirelogout from "../../custom-functions/sessionexpirelogout";
import {
  useNavigate,
} from "react-router-dom";
import JwtTokenExpireAlert from "../../custom-functions/jwt-token-expire-alert";

const style = {
  width: "100%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 1,
};

const UpdateFirmwareModal = (props: {
  show: boolean;
  handleClose: () => void;
  onUpdateFirmwareSubmit: (returnData: any) => void;
}): JSX.Element => {
  const [firmwareNameString, setFirmwareNameString] =
    React.useState<string>("");
  const [isDisable, setDisable] = React.useState<boolean>(true);
  const [firmActive, setFirmwareActive] = React.useState<boolean>(false);
  const [firmwareVersion, setFirmwareVersion] = React.useState<number>();
  const [firmwareName, setFirmwareName] = React.useState<string>("");
  const [firmwareId, setFirmwareId] = React.useState<string>("");
  const [show, setShow] = React.useState<boolean>(false);
  const [showUpdateSubmit, setShowUpdateSubmit] = React.useState<boolean>(false);

  const systems: CcsSystem[] = useSelector(
    (state: RootState) => state.systems.systems
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const updateFirmwareVersion = (event: any) => {
    setFirmwareVersion(event.target.value);
  };

  const handleUpdate = () => {
    const updateFirmwareActive = firmActive === true ? 1 : 0;

    const updateObj = {
      firmwareId: firmwareId,
      firmwareVersion: firmwareVersion,
      firmwareActive: updateFirmwareActive,
      firmwareName: firmwareName,
    };

    props.onUpdateFirmwareSubmit(updateObj);
    props.handleClose();

    setFirmwareActive(false);
    setFirmwareVersion();
    setFirmwareName("");
    setFirmwareNameString("");

    setDisable(true);
  };

  const handleRemove = async () => {
    props.handleClose();
    setDisable(true);

    const deleteparam = {
      firmwareId: firmwareId,
    };

    setFirmwareActive(false);
    setFirmwareVersion();
    setFirmwareName("");
    setFirmwareNameString("");

    const respDeleteFirm = await deleteFirmware(deleteparam);

    if (respDeleteFirm === "jwt expired") {
      setShow(true);
      setShowUpdateSubmit(true);
    };

    dispatch(getAllSystems());
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

    setFirmwareActive(false);
    setFirmwareVersion();
    setFirmwareName("");
    setFirmwareNameString("");
    setDisable(true);
    dispatch(getAllSystems());
  };

  const handleSelectChange = async (event: any) => {
    if (typeof event == "string") {
      const response = await getFirmwarePopulated(event);

      const firmActive = response.firmwareActive === 1 ? true : false;

      setFirmwareVersion(response.firmwareVersion);
      setFirmwareActive(firmActive);
      setFirmwareName(response.firmwareName);
      setFirmwareId(response.firmwareId);
      setDisable(false);
      setFirmwareNameString(event);
    }
  };

  const handleChangeFirmActive = (event: any) => {
    setFirmwareActive(event.target.checked);
  };

  const handleChangeFirmName = (event: any) => {
    setFirmwareName(event.target.value);
  };

  React.useEffect(() => {
    firmwareVersion && firmwareName && firmwareNameString
      ? setDisable(false)
      : setDisable(true);
  }, [firmwareVersion, firmwareName, firmwareNameString]);

  return (
    <div>
      <Dialog open={props.show}>
        <DialogTitle>Update Firmware</DialogTitle>
        <DialogContent>
          <Box component="form" sx={style} noValidate autoComplete="off">
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center">
             
                <FormControl sx={{ m: 1, width: 220, marginBottom: "0px" }}
                  className="updateFirmAlign alignSysName">
                  <InputLabel id="select-area-label">
                    {systems?.length === 0
                      ? `Please add a FirmwareName`
                      : `Firmware`}
                  </InputLabel>
                  <FirmwareDropdownRadioList
                    firmwareNameString={firmwareNameString}
                    handleSelectChange={handleSelectChange}
                  />
                </FormControl>

              <TextField
                className="updateFirmAlign alignSysName"
                key={"firmwareVersion"}
                name={"firmwareVersion"}
                margin="dense"
                id={"firmwareVersion"}
                label={"Firmware Version"}
                sx={{ m: 1, width: "25ch" }}
                variant="filled"
                value={firmwareVersion}
                type="number"
                InputLabelProps={{
                  shrink: firmwareVersion ? true : false,
                }}
                onChange={(e) => {
                  updateFirmwareVersion(e);
                }}
              />

              <FormGroup className="firm-active-update updateFirmAlign alignFirmName">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={firmActive}
                      onChange={handleChangeFirmActive}
                    />
                  }
                  id="firm-check"
                  label="Firmware Active"
                />
              </FormGroup>

              <TextField
                className="updateFirmAlign alignSysName"
                key={"firmwareName"}
                name={"firmwareName"}
                margin="dense"
                id={"firmwareName"}
                label={"Firmware Name"}
                sx={{ m: 1, width: "25ch" }}
                variant="filled"
                type={"text"}
                select={false ?? false}
                value={firmwareName}
                onChange={(e) => {
                  handleChangeFirmName(e);
                }}
              />
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
  );
};

export default UpdateFirmwareModal;
