import React from "react";
import MainDrawer from "./menu/MainDrawer";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#fefefe",
    },
  },
});

const makeUserName = ({ email, userName }) => {
  return `${email} ${userName}`;
};

export default function App({ user, logoutAction }) {
  const mainPageTitle = "WoW-Teamz";

  return (
    <ThemeProvider theme={theme}>
      <MainDrawer
        title={mainPageTitle}
        user={makeUserName(user)}
        logoutAction={logoutAction}
      />
    </ThemeProvider>
  );
}
