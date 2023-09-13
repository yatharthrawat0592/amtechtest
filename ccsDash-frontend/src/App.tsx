import * as React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  HashRouter,
  useNavigate,
} from "react-router-dom";

import "./style.css";
import Home from "./views/home";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import PrivateRoutes from "./components/common/utils/privateRoutes";
import PageNotFound from "../src/views/pageNotFound";

import { Provider } from "react-redux";
import store from "./store/index";

import {
  SnackbarKey,
  SnackbarProvider,
  useSnackbar,
  VariantType,
} from "notistack";
import { notificationService } from "./services/notification-service";

import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import Login from "./views/login";
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = (): JSX.Element => {
  const [notification, setNotification] = React.useState<{
    type: VariantType;
    message: string;
  }>({ type: "default", message: "" });
  const { enqueueSnackbar } = useSnackbar();

  const [token, setToken] = React.useState<string>("");

  const navigate = useNavigate();
  const pathName = window.location.pathname;

  notificationService.getNotification().subscribe((notification) => {
    if (notification) {
      setNotification(notification);
    }
  });

  React.useEffect(() => {
    if (notification && notification.message && notification.message !== "") {
      enqueueSnackbar(notification.message, {
        preventDuplicate: true,
        variant: notification.type,
        autoHideDuration: notification.type === "error" ? null : 3000,
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
    }
  }, [notification]);

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, [pathName]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<Home />} />
        </Route>

        {localStorage.getItem("token") && window.location.pathname === "/" ? (
          navigate("/dashboard")
        ) : (
          <Route>
            <Route path="/" element={<Login />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        )}
      </Routes>
    </ThemeProvider>
  );
};

export default function AppWrapper(): JSX.Element {
  const notistackRef: any = React.createRef<any>();
  const onClickDismiss = (key: SnackbarKey): void => {
    if (notistackRef && notistackRef !== null) {
      notistackRef.current?.closeSnackbar(key);
    }
  };

  return (
    <SnackbarProvider
      ref={notistackRef}
      maxSnack={3}
      hideIconVariant={true}
      style={{ whiteSpace: "pre-wrap" }}
      action={(key) => (
        <Button
          onClick={() => onClickDismiss(key)}
          style={{
            color: "white",
            fontWeight: "bold",
            margin: "0px",
            padding: "0px",
          }}>
          <CloseIcon />
        </Button>
      )}>
      <App />
    </SnackbarProvider>
  );
}
