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

import AddUserDialog from "../newUserDialogue";

import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase/config";

import { useRouter } from "next/navigation";

export default function AccountMenu() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedUser, setSelectedUser] = React.useState("Loading...");
  const [isSuperUser, setIsSuperUser] = React.useState(false);
  const [openUserDialog, setOpenUserDialog] = React.useState(false);

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
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  React.useEffect(() => {
    const fetchSelectedUser = async () => {
      try {
        const response = await fetch("http://localhost:8000/selected_user");
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await response.json();
        setSelectedUser(data.selected_user || "Unknown User");
        setIsSuperUser(data.user_role === "super_user");
        console.log("Fetched user role:", data.user_role);
      } catch (error) {
        console.error("Error fetching user:", error);
        setSelectedUser("Error fetching user");
      }
    };

    fetchSelectedUser();
  }, []);

  // Log just before rendering
  // console.log("isSuperUser:", isSuperUser);

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
            <Avatar sx={{ width: 32, height: 32, fontFamily: "Jetbrains Mono" }}>{selectedUser.charAt(0)}</Avatar>
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
          <Avatar sx={{ fontFamily: "Jetbrains Mono" }}>{selectedUser.charAt(0)}</Avatar> {selectedUser}
        </MenuItem>
        <Divider />
        {isSuperUser && (
          <MenuItem onClick={() => setOpenUserDialog(true)} sx={{ fontFamily: "JetBrains Mono" }}>
            <ListItemIcon>
              <PersonAdd fontSize="small" sx={{ color: "primary.main" }} />
            </ListItemIcon>
            Add another account
          </MenuItem>
        )}
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

      <AddUserDialog
        open={openUserDialog}
        onClose={() => setOpenUserDialog(false)}
        // onSave={handleSaveUser}
      />
    </React.Fragment>
  );
}
