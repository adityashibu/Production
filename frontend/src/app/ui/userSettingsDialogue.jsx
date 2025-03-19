import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  Typography,
  Chip,
  Stack,
  CircularProgress,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

const UserSettingsDialog = ({ open, onClose }) => {
  const [userData, setUserData] = useState(null);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    if (open) {
      fetchUserData();
      fetchDevices();
    }
  }, [open]);

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:8000/selected_user");
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchDevices = async () => {
    try {
      const response = await fetch("http://localhost:8000/device_info");
      const data = await response.json();
      setDevices(data.smart_home_devices || []);
    } catch (error) {
      console.error("Error fetching devices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editedName.trim()) return;

    try {
      const response = await fetch(
        `http://localhost:8000/rename_user/${editedName}`,
        {
          method: "PUT",
        }
      );

      const result = await response.json();

      if (result.success) {
        setUserData((prev) => ({ ...prev, selected_user: editedName }));
        setIsEditing(false);
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "Jetbrains Mono",
          color: "primary.main",
          fontWeight: 600,
        }}
      >
        User Settings
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => setIsEditing(true)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center", p: 3 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: "auto",
                mb: 2,
                fontFamily: "Jetbrains Mono",
                fontSize: 32,
              }}
            >
              {userData?.selected_user?.charAt(0)}
            </Avatar>
            {/* Editable User Name */}
            {isEditing ? (
              <Stack spacing={1} sx={{ alignItems: "center" }}>
                <TextField
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ fontFamily: "Jetbrains Mono", width: "80%" }}
                />
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={handleSave}
                  sx={{ fontFamily: "Jetbrains Mono" }}
                >
                  Save
                </Button>
              </Stack>
            ) : (
              <Typography variant="h6" sx={{ fontFamily: "Jetbrains Mono" }}>
                {userData?.selected_user}
              </Typography>
            )}
            <Typography
              color="primary.main"
              sx={{ fontFamily: "Jetbrains Mono" }}
            >
              Role:{" "}
              {userData?.user_role === "sub_user"
                ? "Sub User"
                : userData?.user_role === "super_user"
                ? "Super User"
                : "Unknown Role"}
            </Typography>

            <Typography
              variant="subtitle1"
              sx={{ mt: 3, fontFamily: "Jetbrains Mono" }}
            >
              Allocated Devices:
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              justifyContent="center"
              flexWrap="wrap"
              sx={{
                mt: 2,
                "& .MuiChip-root": {
                  marginBottom: 2,
                },
              }}
            >
              {devices.map((device) => (
                <Chip
                  key={device.id}
                  label={device.name}
                  sx={{ fontFamily: "Jetbrains Mono" }}
                />
              ))}
            </Stack>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserSettingsDialog;
