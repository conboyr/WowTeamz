import React, { Fragment, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import {
  presentationComponents,
  containerComponents,
} from "./MenuPresentationComponents";
import Button from "@mui/material/Button";

//const drawerWidth = 240;

const Main = styled("main")(
  ({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    marginLeft: 0, // Keep margin left constant at 0
  })
);


const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme}) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  })
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

// Component used to hold the navigation bar
const TopBar = ({ open, selectedItem, handleSelectedItem, logoutAction }) => {
  // This component is responsible for rendering the Toolbar that is drawn
  // at the top of the drawer.

  return (
    <Fragment>
      <AppBar position="fixed" open={false}>
        <Toolbar>
          <List>
            <PresentationListItems
              selectedItem={selectedItem}
              onClick={handleSelectedItem}
              menuItemTitles={presentationComponents().map(
                (comp) => comp.title
              )}
            />
          </List>
          <Box width="100%" justifyContent="right" flex={1}>
            <Typography
              variant="h7"
              noWrap
              component="div"
              align="right"
              onClick={() => logoutAction()}
            >
              Logout
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </Fragment>
  );
};

const PresentationListItems = (props) => {
  return (
    <div style={{ display: "flex" }}>
      {props.menuItemTitles.map((title) => (
        <ListItem
          button
          style={{
            color: props.selectedItem === title ? "blue" : "inherit",
            width: "fit-content",
          }}
          onClick={() => props.onClick(title)}
          key={title}
        >
          <ListItemText primary={title} key={title} />
        </ListItem>
      ))}
    </div>
  );
};

const findSelectedComponent = (selectedItem, user) => {
  const component = [...presentationComponents()].filter(
    (comp) => comp.title === selectedItem
  );
  if (component.length === 1) return component[0];

  console.log(
    "In findSelectedComponent of MakeEligible. Didn't find the component that corresponds to the menu item."
  );
  return {
    title: null,
    component: null,
  };
};

export default function MainDraswer({ title, user, logoutAction, account_id}) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [selectedItem, setSelectedItem] = useState("Home");

  console.log("in MainDrawer");

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSelectedItem = (title) => {
    setSelectedItem(title);
  };
  console.log("user in main drawer");
  console.log(account_id);
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <TopBar
        selectedItem={selectedItem}
        handleSelectedItem={handleSelectedItem}
        open={open}
        logoutAction={logoutAction}
      />
      {
      // Allow each link to display components
      }
      <Main user={user} account_id={account_id} open={open}>
        <DrawerHeader />
        {findSelectedComponent(selectedItem, user).component}
      </Main>
    </Box>
  );
}
