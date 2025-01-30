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
        style={{ fontFamily: "JetBrains Mono", fontWeight: 700, fontSize: 14 }}
        className="text-main-dark-blue-inactive"
      >
        Home
      </span>
    ),
    icon: HomeIcon,
    link: "dashboard",
  },
  {
    name: () => (
      <span
        style={{ fontFamily: "JetBrains Mono", fontWeight: 700, fontSize: 14 }}
        className="text-main-dark-blue-inactive"
      >
        Devices
      </span>
    ),
    icon: DevicesIcon,
    link: "devices",
  },
  {
    name: () => (
      <span
        style={{ fontFamily: "JetBrains Mono", fontWeight: 700, fontSize: 14 }}
        className="text-main-dark-blue-inactive"
      >
        Automation
      </span>
    ),
    icon: SmartToyIcon,
    link: "automations",
  },
  {
    name: () => (
      <span
        style={{ fontFamily: "JetBrains Mono", fontWeight: 700, fontSize: 14 }}
        className="text-main-dark-blue-inactive"
      >
        Energy Usage
      </span>
    ),
    icon: BatteryChargingFullIcon,
    link: "energy",
  },
  {
    name: () => (
      <span
        style={{ fontFamily: "JetBrains Mono", fontWeight: 700, fontSize: 14 }}
        className="text-main-dark-blue-inactive"
      >
        Groups
      </span>
    ),
    icon: GroupIcon,
    link: "groups",
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
        {menuItems.map(({ name: Name, icon: Icon, link: Link }) => (
          <ListItem
            key={Link}
            disablePadding
            className="hover:bg-main-light-blue-dark/20 ease-linear transition-all duration-300 group"
          >
            <ListItemButton>
              <ListItemIcon className="text-main-dark-blue-inactive group-hover:text-main-light-blue-dark transition-all duration-300">
                <Icon className="text-main-dark-blue-inactive group-hover:text-main-light-blue-dark transition-all duration-300" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <span
                    style={{
                      fontFamily: "JetBrains Mono",
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                    className="text-main-dark-blue-inactive group-hover:text-main-light-blue-dark transition-all duration-300"
                  >
                    {Link.charAt(0).toUpperCase() + Link.slice(1)}
                  </span>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
