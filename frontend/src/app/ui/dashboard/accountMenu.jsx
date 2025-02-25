"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";

import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase/config";

import { useRouter } from "next/navigation";

export default function AccountMenu() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      sessionStorage.removeItem("user"); // Clear session
      router.push("/"); // Redirect to home page
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };
  
  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={handleClose}
          sx={{
            fontFamily: "JetBrains Mono",
            fontWeight: 800,
            color: "primary.main",
          }}
        >
          <Avatar /> Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose} sx={{ fontFamily: "JetBrains Mono" }}>
          <ListItemIcon>
            <PersonAdd fontSize="small" sx={{ color: "primary.main" }} />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose} sx={{ fontFamily: "JetBrains Mono" }}>
          <ListItemIcon>
            <Settings fontSize="small" sx={{ color: "primary.main" }} />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ fontFamily: "JetBrains Mono" }}>
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: "primary.main" }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
