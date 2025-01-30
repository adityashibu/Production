"use client";
import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Link from "next/link";

import HomeIcon from "@mui/icons-material/Home";
import DevicesIcon from "@mui/icons-material/Devices";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import GroupIcon from "@mui/icons-material/Group";

const menuItems = [
  {
    name: "Home",
    icon: HomeIcon,
    link: "/dashboard", // Add leading slash
  },
  {
    name: "Devices",
    icon: DevicesIcon,
    link: "/dashboard/devices", // Add leading slash
  },
  {
    name: "Automations",
    icon: SmartToyIcon,
    link: "/automations", // Add leading slash
  },
  {
    name: "Energy Usage",
    icon: BatteryChargingFullIcon,
    link: "/energy", // Add leading slash
  },
  {
    name: "Groups",
    icon: GroupIcon,
    link: "/groups", // Add leading slash
  },
];

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

export default function Sidebar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={() => setOpen(!open)}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map(({ name: Name, icon: Icon, link }) => (
            <Link key={link} href={link} passHref legacyBehavior>
              <ListItem
                disablePadding
                className="hover:bg-main-light-blue-dark/20 ease-linear transition-all duration-300 group"
              >
                <ListItemButton>
                  <ListItemIcon className="text-main-dark-blue-inactive group-hover:text-main-light-blue-dark transition-all duration-300">
                    <Icon className="group-hover:text-main-light-blue-dark transition-all duration-300" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span
                        style={{
                          fontFamily: "JetBrains Mono",
                          fontWeight: 700,
                          fontSize: 14,
                        }}
                        className="group-hover:text-main-light-blue-dark transition-all duration-300"
                      >
                        {Name}
                      </span>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
