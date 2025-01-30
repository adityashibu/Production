import * as React from "react";
import { styled } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import DevicesIcon from "@mui/icons-material/Devices";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import GroupIcon from "@mui/icons-material/Group";

const menuItems = [
  {
    name: () => (
      <span
        style={{ fontFamily: "JetBrains Mono", fontWeight: 700 }}
        className="text-main-light-blue-dark"
      >
        Home
      </span>
    ),
    icon: () => <HomeIcon className="text-main-light-blue-dark" />,
  },
  {
    name: () => (
      <span
        style={{ fontFamily: "JetBrains Mono", fontWeight: 700 }}
        className="text-main-light-blue-dark"
      >
        Devices
      </span>
    ),
    icon: () => <DevicesIcon className="text-main-light-blue-dark" />,
  },
  {
    name: () => (
      <span
        style={{ fontFamily: "JetBrains Mono", fontWeight: 700 }}
        className="text-main-light-blue-dark"
      >
        Automation
      </span>
    ),
    icon: () => <SmartToyIcon className="text-main-light-blue-dark" />,
  },
  {
    name: () => (
      <span
        style={{ fontFamily: "JetBrains Mono", fontWeight: 700 }}
        className="text-main-light-blue-dark"
      >
        Energy Usage
      </span>
    ),
    icon: () => (
      <BatteryChargingFullIcon className="text-main-light-blue-dark" />
    ),
  },
  {
    name: () => (
      <span
        style={{ fontFamily: "JetBrains Mono", fontWeight: 700 }}
        className="text-main-light-blue-dark"
      >
        Groups
      </span>
    ),
    icon: () => <GroupIcon className="text-main-light-blue-dark" />,
  },
];

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function Sidebar({ open, handleDrawerClose }) {
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon className="text-main-light-blue-dark" />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {menuItems.map(({ name: Name, icon: Icon }) => (
          <ListItem key={Name} disablePadding>
            <ListItemButton>
              <ListItemIcon>{<Icon />}</ListItemIcon>
              <ListItemText primary={<Name />} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
