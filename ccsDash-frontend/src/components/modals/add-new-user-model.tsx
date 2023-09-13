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

import UserDropdownRadioList from "../common/add-new-user-radio-list";

import {
  populateSystemFields,
  deleteSystem,
  resetPopulatedState,
} from "../../store/actions/system-actions";
import { every } from "rxjs";
import { notificationService } from "../../services/notification-service";
import { useDispatch } from "react-redux";
import { getAllSystems } from "../../store/actions/system-actions";
import { registerUser } from "../../store/actions/login-register-logout-action";

const style = {
  width: "100%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 1,
};

const AddNewUserModal = (props: {
  show: boolean;
  handleClose: () => void;
  onSubmitUpdateSystem: (returnData: any) => void;
}): JSX.Element => {
  const [data, setData] = React.useState<CcsSystem>(ccsSystemEmptyObj);
  const [modelPrefix, setModelPrefix] = React.useState<string>("");
  const [userRoleNameString, setUserRoleString] = React.useState<string>("");
  const [unitName, setUnitName] = React.useState<string[]>([]);
  const [associatedUnits, setAssociatedUnits] = React.useState<string[]>([]);
  const [populateData, setPupulateData] = React.useState();
  const [createdBy, setCreatedBy] = React.useState<string>("");
  const [isSystemId, setSystemId] = React.useState<string>("");
  const [isDisable, setDisable] = React.useState<boolean>(true);

  const [Userfirstname, setFirstName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [role, setRole] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [hiddenAddUser, setHiddenAddUser] = React.useState<boolean>(true);

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

  const updateTextFieldCreatedby = (event: any) => {
    setCreatedBy(event.target.value);
    if (event.target.name === "model") {
      const p = unitTypes.filter((u) => u.label === event.target.value);
      setModelPrefix(p[0].prefix);
    }
  };

  const handleFirstNameChange = (event: any) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event: any) => {
    setLastName(event.target.value);
  };

  const handleRoleChange = (event: any) => {
    setRole(event.target.value);
  };

  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
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

  const handleAddUser = async () => {
    const registerObj = {
      first_name: Userfirstname,
      last_name: lastName,
      role: role,
      email: email,
      password: password,
    };

    await registerUser(registerObj);

    setFirstName("");
    setLastName("");
    setRole("");
    setEmail("");
    setPassword("");

    props.handleClose();
  };

  const handleClose = () => {
    setFirstName("");
    setLastName("");
    setRole("");
    setEmail("");
    setPassword("");

    props.handleClose();
    setUnitName([]);
    setUserRoleString("");
    setCreatedBy("");
    dispatch(getAllSystems());
    setDisable(true);

    dispatch(resetPopulatedState());
  };

  const handleSelectChange = async (event: any) => {
    /* Update the unit names with the selected descriptions */
    if (typeof event == "string") {
      setDisable(false);
      setUserRoleString(event);
      setRole(event);
    }
  };

  // On render it will be setting the unitnames in the array if there is any associated unit ids
  React.useEffect(() => {
    const filteredArray = unitInfo
      ?.filter((obj1) =>
        associatedUnits?.some((obj2) => obj2.unitAssociationId === obj1.unitId)
      )
      .map((item) => item.description);
    setUnitName(filteredArray);

    Userfirstname && lastName && role && email && password
      ? setHiddenAddUser(false)
      : setHiddenAddUser(true);
  }, [associatedUnits, Userfirstname, lastName, role, email, password]);

  React.useEffect(() => {
    if (systemData && systemData.length != 0) {
      setSystemId(systemData?.systemId);
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
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Box component="form" sx={style} noValidate autoComplete="off">
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center">
              <TextField
                className="addNewUserAlignField alignUser"
                key={"firstName"}
                name={"firstName"}
                margin="dense"
                id={"firstName"}
                label={"First Name"}
                sx={{ m: 1, width: "25ch" }}
                variant="filled"
                type="text"
                select={false ?? false}
                //placeholder="Enter First Name"
                value={Userfirstname}
                onChange={(e) => {
                  handleFirstNameChange(e);
                }}
              />

              <TextField
                className="addNewUserAlignField alignUser"
                key={"lastName"}
                name={"lastName"}
                margin="dense"
                id={"lastName"}
                label={"Last Name"}
                type={"text"}
                sx={{ m: 1, width: "25ch" }}
                variant="filled"
                select={false ?? false}
                //defaultValue={u.default}
                value={lastName}
                size="small"
                onChange={(e) => {
                  handleLastNameChange(e);
                }}
              />

                <FormControl sx={{ m: 1, width: 220 }}
                  className="addNewUserAlignField alignUser">
                  <InputLabel id="select-area-label">
                    {systems?.length === 0 ? `Please add a role` : `Role`}
                  </InputLabel>
                  <UserDropdownRadioList
                    userRoleNameString={userRoleNameString}
                    handleSelectChange={handleSelectChange}
                  />
                </FormControl>

              <TextField
                className="addNewUserAlignField alignUser"
                key={"email"}
                name={"email"}
                margin="dense"
                id={"email"}
                label={"Email"}
                type={"text"}
                sx={{ m: 1, width: "25ch" }}
                variant="filled"
                select={false ?? false}
                //defaultValue={u.default}
                value={email}
                size="small"
                onChange={(e) => {
                  handleEmailChange(e);
                }}
              />

              <TextField
                className="addNewUserAlignField alignUser"
                key={"password"}
                name={"password"}
                margin="dense"
                id={"password"}
                label={"Password"}
                type={"password"}
                sx={{ m: 1, width: "25ch" }}
                variant="filled"
                select={false ?? false}
                //defaultValue={u.default}
                value={password}
                size="small"
                onChange={(e) => {
                  handlePasswordChange(e);
                }}
              />
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button disabled={hiddenAddUser} onClick={handleAddUser}>
            Add User
          </Button>

          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
    // </Box>
  );
};

export default AddNewUserModal;
