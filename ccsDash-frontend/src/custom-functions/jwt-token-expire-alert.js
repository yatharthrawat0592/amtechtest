import React from "react";

import Alert from "@mui/material/Alert";

import Button from "@mui/material/Button";

import { Dialog, DialogActions } from "@mui/material";

const jwtTokenExpireAlert = (props) => {
  return (
    <Dialog open={props.show}>
      <DialogActions>
        <Alert
          severity="error"
          sx={{ width: "100%" }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => props.handleAlert(true)}>
              OK
            </Button>
          }>
          Session has been expired please login again!
        </Alert>
      </DialogActions>
    </Dialog>
  );
};

export default jwtTokenExpireAlert;
