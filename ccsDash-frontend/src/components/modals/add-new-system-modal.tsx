import * as React from "react";
import { useSelector } from "react-redux";
import { InputAdornment, TextField } from "@mui/material";
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
  InputLabel,
  FormControl,
} from "@mui/material";

import { CcsUnitInfo, ccsUnitInfoEmptyObj } from "../../models/unit-model";
import { RootState } from "../../store";
import UnitDropdownList from "../common/unit-dropdown-list";
import { unitTypes } from "../../models/unitTypes-model";
import { CcsSystem, ccsSystemEmptyObj } from "../../models/system-model";

const style = {
  width: "100%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 1,
};

const AddNewSystemModal = (props: {
  show: boolean;
  handleClose: () => void;
  onSubmit: (returnData: any) => void;
}): JSX.Element => {
  const [data, setData] = React.useState<CcsSystem>(ccsSystemEmptyObj);
  const [modelPrefix, setModelPrefix] = React.useState<string>("");
  const [unitName, setUnitName] = React.useState<string[]>([]);

  const unitInfo: CcsUnitInfo[] = useSelector(
    (state: RootState) => state.units.unitInfo
  );

  const systems: CcsSystem[] = useSelector(
    (state: RootState) => state.systems.systems
  );

  const userName = localStorage.getItem("userName");

  const systemFields = [
    {
      name: "description",
      label: "System Name",
      type: "text",
      select: false,
      selectFields: [],
      prefix: "",
    },
  ];

  const updateTextField = (event: any) => {
    setData({ ...data, [event.target.name]: event.target.value });
    //console.log(`${event.target.name}:${event.target.value}`);
    if (event.target.name === "model") {
      const p = unitTypes.filter((u) => u.label === event.target.value);
      setModelPrefix(p[0].prefix);
    }
  };

  const handleAdd = () => {
    data.createdBy = userName;
    props.onSubmit(data);
    setUnitName([]);
  };

  const handleClose = () => {
    props.handleClose();
    setUnitName([]);
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

  React.useEffect(() => {
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
  }, [unitName]);

  return (
    <div>
      <Dialog open={props.show} /* onClose={props.handleClose} */>
        <DialogTitle>Add New System</DialogTitle>
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
              {systemFields.map((u) => {
                return (
                  <TextField
                    className='addSystemAlignField alignSysName'
                    key={u.name}
                    name={u.name}
                    margin="dense"
                    id={u.name}
                    label={u.label}
                    type={u.type}
                    sx={{ m: 1, width: "25ch" }}
                    variant="filled"
                    select={u.select ?? false}
                    defaultValue=""
                    size="small"
                    onChange={updateTextField}
                    InputProps={
                      u.prefix !== ""
                        ? {
                            startAdornment: (
                              <InputAdornment position="start">
                                {modelPrefix}
                              </InputAdornment>
                            ),
                          }
                        : undefined
                    }></TextField>
                );
              })}

                  <TextField
                    className='addSystemAlignField alignSysName'
                    key={"username"}
                    name={"username"}
                    margin="dense"
                    id={"username"}
                    label={"User"}
                    sx={{ m: 1, width: "25ch" }}
                    variant="filled"
                    type="text"
                    select={false ?? false}
                    value={userName}
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

                <FormControl sx={{ m: 1, width: 240 }} className='addSystemAlignField alignSysName'>
                  <InputLabel id="changeUnit" >
                    {systems?.length === 0
                      ? `Please Select Units`
                      : `Select Units`}
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
          <Button onClick={handleAdd}>Add</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
    // </Box>
  );
};

export default AddNewSystemModal;
