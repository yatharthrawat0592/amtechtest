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
import Checkbox from "@mui/material/Checkbox";
import { useDispatch } from "react-redux";
import { addNewFirmware } from "../../store/actions/firmware-action";
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

const AddNewFirmwareModal = (props: {
  show: boolean;
  handleClose: () => void;
  onSubmitUpdateSystem: (returnData: any) => void;
}): JSX.Element => {
  const [firmwareVersion, setFirmwareVersion] = React.useState<number>();
  const [firmActive, setFirmActive] = React.useState<boolean>(true);
  const [file, setFile] = React.useState();
  const [hiddenAddFirmware, setHiddenAddFirmware] =
    React.useState<boolean>(true);
  const [fileName, setFileName] = React.useState<string>("");
  const [show, setShow] = React.useState<boolean>(false);
  const [showUpdateSubmit, setShowUpdateSubmit] = React.useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFirmwareVersionChange = (event: any) => {
    setFirmwareVersion(event.target.value);
  };

  const handleChangeFirmActive = (event: any) => {
    setFirmActive(event.target.checked);
  };

  const handleAddFirmware = async (event: any) => {
    event.preventDefault();

    var formData = new FormData();

    const updateFirmActive = firmActive === true ? 1 : 0;

    formData.append("firmwareVersion", firmwareVersion);
    formData.append("firmwareActive", updateFirmActive);
    formData.append("files", file);
    formData.append("fileName", fileName);

    const respAddNewFirm = await addNewFirmware(formData);
    if (respAddNewFirm === "jwt expired") {
      setShow(true);
      setShowUpdateSubmit(true);
    };

    setFirmActive(true);
    setFirmwareVersion();
    setFile();
    props.handleClose();
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

    setFirmActive(true);
    setFirmwareVersion();
    setFile();
  };

  const handleUploadBinary = async (event: any) => {
    if (event.target.files && event.target.files[0]) {
      let binFile = event.target.files[0];
      setFileName(binFile.name);
      setFile(binFile);
    }
  };

  React.useEffect(() => {
    firmwareVersion && file
      ? setHiddenAddFirmware(false)
      : setHiddenAddFirmware(true);
  }, [firmwareVersion, file]);

  return (
    <div>
      <Dialog open={props.show}>
        <DialogTitle>Add New Firmware</DialogTitle>
        <DialogContent>
          <Box component="form" sx={style} noValidate autoComplete="off">
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center">
              <label className="custom-file-upload addNewFirmAlignField">
                <input
                  id="upload-photo-add-firmware"
                  name="upload-binary"
                  accept=".bin"
                  type="file"
                  onChange={(e) => {
                    handleUploadBinary(e);
                  }}
                />
              </label>

              <label className="firmware-version-label addNewFirmAlignField">
                <TextField
                  key={"firmwareversion"}
                  name={"firmwareversion"}
                  margin="dense"
                  id={"firmwareversion"}
                  label={"Firmware Version"}
                  type={"number"}
                  sx={{ m: 1, width: "25ch" }}
                  variant="filled"
                  select={false ?? false}
                  //defaultValue={u.default}
                  value={firmwareVersion}
                  size="small"
                  onChange={(e) => {
                    handleFirmwareVersionChange(e);
                  }}
                  style={{
                    width: "100%",
                    margin:"10px 0px 10px 0px"
                  }}
                />
              </label>

              <FormGroup className="firm-active addNewFirmAlignField">
                <FormControlLabel
                  control={
                    <Checkbox
                      defaultChecked
                      onChange={handleChangeFirmActive}
                    />
                  }
                  id="firm-check"
                  label="Firmware Active"
                />
              </FormGroup>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button disabled={hiddenAddFirmware} onClick={handleAddFirmware}>
            Ok
          </Button>

          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <JwtTokenExpireAlert show={show} handleAlert={handleAlert} />
    </div>
    // </Box>
  );
};

export default AddNewFirmwareModal;
