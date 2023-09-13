import * as React from "react";
import { useSelector } from "react-redux";
import { CcsSystem } from "../models/system-model";
import { LoginRegister } from "../models/login-register-model";
import { AddUpdateFirmware } from "../models/add-update-firmware-model";
import { RootState } from "../store";

//import OutlinedInput from '@mui/material/OutlinedInput';
import { InputLabel, FormControl, Grid } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

import "../components/common/css/ccs-unit-card.css";
//import { getUnitAssociation } from '../store/actions/unit-actions';
import CcsUnitCard from "./ccs-unit-card/ccs-unit-card";
import AddNewUnitModal from "./modals/add-new-unit-modal";
import UpdateSystemModal from "./modals/update-new-system-model";
import UpdateFirmwareModal from "./modals/update-firmware-model";
import AddNewUserModal from "./modals/add-new-user-model";
import AddNewFirmwareModal from "./modals/add-new-firmware-model";
import AddNewSystemModal from "./modals/add-new-system-modal";
import { CcsUnitInfo } from "../models/unit-model";
import { createNewUnit, getAllUnitInfo } from "../store/actions/unit-actions";
import { notificationService } from "../services/notification-service";
import SystemDropdownList from "./common/system-dropdown-list";
import ConfigButtonDropdown from "./common/config-button-dropdown";
import {
  associateUnitsToSystem,
  createNewSystem,
  getAllSystems,
  updateNewSystem,
} from "../store/actions/system-actions";
import { updateNewFirmware } from "../store/actions/firmware-action";
import { useDispatch } from "react-redux";
import {
  useNavigate,
} from "react-router-dom";

import sessionexpirelogout from "../custom-functions/sessionexpirelogout";
import JwtTokenExpireAlert from "../custom-functions/jwt-token-expire-alert";
import setClearInterval from "../custom-functions/set-clear-Interval";
import {
  deleteSystem,
} from "../store/actions/system-actions";
import { getInfoStage, deleteInfoStage } from "../store/actions/getInfo-action";


// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//     PaperProps: {
//         style: {
//             maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//             width: "auto",
//         }
//     }
// };

const UnitDisplayCtrl = (props: any) => {
  const [unitName, setUnitName] = React.useState<string[]>([]);
  const [selectedUnits, setSelectedUnits] = React.useState<string[]>([]);

  /* all systems and units */
  const systems: CcsSystem[] = useSelector(
    (state: RootState) => state.systems.systems
  );

  /* Anchors and click handlers for drop-down menus */
  // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  // const open = Boolean(anchorEl);
  // const handleClickUnitSettings = (event: React.MouseEvent<HTMLElement>) => {
  //     setAnchorEl(event.currentTarget);
  // };
  // const handleCloseUnitSettings = () => {
  //     setAnchorEl(null);
  // };

  const [openAddUnit, setOpenAddUnit] = React.useState(false);
  const [openAddSystem, setOpenAddSystem] = React.useState(false);

  const [openUpdateSystem, setOpenUpdateSystem] = React.useState(false);
  const [openAddUser, setOpenAddUser] = React.useState(false);

  const [openAddFirmware, setOpenAddFirmware] = React.useState(false);
  const [openUpdateFirmware, setOpenUpdateFirmware] = React.useState(false);

  const [role, setRole] = React.useState<string>("");

  const [reRenderOnDelete, setRerenderOnDelete] = React.useState(false);
  
  const [showUpdateSubmit, setShowUpdateSubmit] = React.useState<boolean>(false);
  const [show, setShow] = React.useState<boolean>(false);
  const [activeUseEffect, setActiveUseEffect] = React.useState<boolean>(false);

  const addOptions = [
    {
      label: "Add New Unit",
      name: "addNewUnit",
    },
    {
      label: "Add New System",
      name: "addNewSystem",
    },
    {
      label: "Edit Existing System",
      name: "editExistingSystem",
    },
    {
      label: "Add New Firmware",
      name: "addFirmware",
    },
    {
      label: "Update Firmware",
      name: "editExistingFirmware",
    },
    role === "Admin" && {
      label: "Add New User",
      name: "addNewUser",
    },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpenAddUnitSettings = (name: any) => {
    if (name === "addNewUnit") {
      /* Open add unit dialog */
      setOpenAddUnit(true);
    } else if (name === "addNewSystem") {
      /* open add new system dialog */
      dispatch(getAllUnitInfo());
      setOpenAddSystem(true);
    } else if (name === "editExistingSystem") {
      /* edit existing system dialog */
      dispatch(getAllUnitInfo());
      setOpenUpdateSystem(true);
    } else if (name === "addNewUser") {
      /* Add new user here */
      setOpenAddUser(true);
    } else if (name === "addFirmware") {
      setOpenAddFirmware(true);
    } else if (name === "editExistingFirmware") {
      setOpenUpdateFirmware(true);
    } else {
      /* TODO: Default */
    }
    //setAnchorEl(null);
  };

  // const handleCloseAddUnitSettings = (idx:any) => {
  //     if(addOptions[idx] === 'Add New Unit'){
  //         /* Open add unit dialog */
  //         setOpenAddUnit(false);
  //     } else if (addOptions[idx] === 'Add New System'){
  //         /* open add new system dialog */
  //         setOpenaddSystem(false);
  //     } else {
  //         /* TODO: Default */
  //     }
  // }

  const setClearIntervalFunc = async () => {
    setActiveUseEffect(true);
  };

  const onNewUnitSubmit = async (unitInfo: CcsUnitInfo) => {
    setOpenAddUnit(false);
    /* send data to server */
    createNewUnit(unitInfo);
    /* now update the unit list */
    const unitResp = await dispatch(getAllUnitInfo());
    if (unitResp === "jwt expired") {
      setShow(true);
      setShowUpdateSubmit(true);
    };
    setClearIntervalFunc();
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

  const onAddSystemSubmit = async (systemInfo: CcsSystem) => {
    setOpenAddSystem(false);
    /* send data to server */
    /* add the form data to the database */
    const newSystemInfo = await createNewSystem(systemInfo);
    /* make the system/unit association */
    if (newSystemInfo === "jwt expired") {
      setShow(true);
      setShowUpdateSubmit(true);
    };
    await associateUnitsToSystem(newSystemInfo);
    dispatch(getAllSystems());
  };

  const onUpdateSystemSubmit = async (systemUpdate: CcsSystem) => {
    setOpenUpdateSystem(false);
    /* update data to server */
    const systemUpdateResp = await updateNewSystem(systemUpdate);

    if (systemUpdateResp === "jwt expired") {
      setShow(true);
      setShowUpdateSubmit(true);
    };
    dispatch(getAllSystems());
  };

  const handleDelete = (delResp: any) => {
    setRerenderOnDelete(true)
    const newUnitName = unitName.filter((e) => e !== delResp.description);
    setUnitName(newUnitName);
  }

  const onSubmitAddUser = async (registerUser: LoginRegister) => {
    setOpenAddUser(false);
    /* update data to server */
    dispatch(getAllSystems());
  };

  const onSubmitAddFirmware = async (firmwareUpdate: AddUpdateFirmware) => {
    setOpenUpdateSystem(false);
    /* update firmware */
    dispatch(getAllSystems());
  };

  const onUpdateFirmwareSubmit = async (updateFirmware: AddUpdateFirmware) => {
  setOpenUpdateFirmware(false);
    /* update firmware to server */
    const respUpdateFirm = await updateNewFirmware(updateFirmware);
    if (respUpdateFirm === "jwt expired") {
      setShow(true);
      setShowUpdateSubmit(true);
    };

    dispatch(getAllSystems());
  };

  const handleCloseAddUnit = () => {
    setOpenAddUnit(false);
  };

  const handleCloseAddSystem = () => {
    setOpenAddSystem(false);
  };

  const handleCloseUpdateSystem = () => {
    setOpenUpdateSystem(false);
  };

  const handleCloseAddUser = () => {
    setOpenAddUser(false);
  };

  const handleCloseAddFirmware = () => {
    setOpenAddFirmware(false);
  };

  const handleCloseUpdateFirmware = () => {
    setOpenUpdateFirmware(false);
  };

  const handleSelectChange = (event: SelectChangeEvent<typeof unitName>) => {
    /* Update the unit names with the selected descriptions */
    const {
      target: { value },
    } = event;
    setUnitName(typeof value === "string" ? value.split(",") : value);
  };

  React.useEffect(() => {
    /* load the units used for this system */
    /* first load the system areas */
    const roleLocalStore = localStorage.getItem("role");
    setRole(roleLocalStore);
  }, [localStorage.getItem("role")]);

  React.useEffect(() => {
    /* Now update the associated units */
    setSelectedUnits(getSelectedUnits());
  }, [unitName, systems]);

  React.useEffect(() => {
    var timerId = setInterval(async () => {
      const getAllResp = await getInfoStage(); //add new_unit
       if (getAllResp.length > 0) {
        getAllResp?.forEach((info, index) => {
          if (info.data_available === 0) {
            const unitIdObj = {
              unitId: info.unitId,
            };
            deleteInfoStage(unitIdObj);
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
    setRerenderOnDelete(false);
  }, [reRenderOnDelete,activeUseEffect]);

  const getSelectedUnits = () => {
    /* Get the active units to display in the unit panel */
    var u: string[] = [];
    systems.forEach((system) => {
      if (unitName.includes(system.description)) {
        /* this sequence selects the Unit Id arrays
         * from each system and adds them to
         * a new unit array (u)
         */
        system.ccsUnitId.forEach((id) => {
          if (!u.includes(id)) {
            return u.push(id);
          }
        });
      }
    });
    //console.log("active units: ", u);
    return u;
  };

  return (
    <div>
      <div className="add-unit-button">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={6.5}>
          <Grid item xs={6}>
            <FormControl sx={{ m: 1, width: 200 }}>
              <InputLabel id="select-area-label">
                {systems?.length === 0 ? `Please add a system` : `Systems`}
              </InputLabel>
              <SystemDropdownList
                unitName={unitName}
                onChange={handleSelectChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={5}>
            <ConfigButtonDropdown
              onSubmit={handleOpenAddUnitSettings}
              options={addOptions}
            />
          </Grid>
        </Grid>
      </div>
      <div className="unit-card-barx">
        <CcsUnitCard selectedUnits={selectedUnits} />
      </div>
      <AddNewUnitModal
        show={openAddUnit}
        handleClose={handleCloseAddUnit}
        onSubmit={onNewUnitSubmit}
      />
      <AddNewSystemModal
        show={openAddSystem}
        handleClose={handleCloseAddSystem}
        onSubmit={onAddSystemSubmit}
      />

      <UpdateSystemModal
        show={openUpdateSystem}
        handleClose={handleCloseUpdateSystem}
        onSubmitUpdateSystem={onUpdateSystemSubmit}
        handleDelete={handleDelete}
      />

      <AddNewFirmwareModal
        show={openAddFirmware}
        handleClose={handleCloseAddFirmware}
        onSubmitUpdateSystem={onSubmitAddFirmware}
      />

      <UpdateFirmwareModal
        show={openUpdateFirmware}
        handleClose={handleCloseUpdateFirmware}
        onUpdateFirmwareSubmit={onUpdateFirmwareSubmit}
      />

      <JwtTokenExpireAlert show={show} handleAlert={handleAlert} />

      {role === "Admin" && (
        <AddNewUserModal
          show={openAddUser}
          handleClose={handleCloseAddUser}
          onSubmitUpdateSystem={onSubmitAddUser}
        />
      )}
    </div>
  );
};

export default UnitDisplayCtrl;
