"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../ui/dashboard/breadcrumbs";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Checkbox,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import IOSSwitch from "../ui/iosButton";

// Groups component with fetch from API
const Groups = () => {
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupStatus, setGroupStatus] = useState(true); // "on" or "off"
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [deviceList, setDeviceList] = useState([]);

  // Fetch devices from API on component mount
  useEffect(() => {
    fetch("http://localhost:8000/device_info")
      .then((res) => res.json())
      .then((data) => {
        if (data.smart_home_devices && Array.isArray(data.smart_home_devices)) {
          // Filter available devices if needed (optional for groups page)
          setDeviceList(data.smart_home_devices);
        } else {
          console.error("Unexpected API response:", data);
          setDeviceList([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching device data:", err);
        setDeviceList([]);
      });
  }, []); // No dependency array here if you want to run this once when the component mounts

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setGroupName("");
    setGroupStatus(true);
    setSelectedDevices([]);
  };

  const handleDeviceChange = (event) => {
    const value = event.target.value;
    setSelectedDevices(typeof value === "string" ? value.split(",") : value);
  };

  const handleRemoveChip = (deviceId) => {
    setSelectedDevices((prev) => prev.filter((id) => id !== deviceId));
  };

  const handleSubmit = () => {
    const newGroup = {
      id: Date.now(),
      name: groupName,
      status: groupStatus ? "on" : "off",
      devices: selectedDevices,
    };

    console.log("New Group Created:", newGroup);
    handleClose();
  };

  return (
    <div>
      <Breadcrumb />
      <Box sx={{ paddingTop: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginBottom: 3,
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              fontFamily: "JetBrains Mono",
              fontWeight: 600,
              textTransform: "none",
              color: "white",
            }}
            onClick={handleOpen}
          >
            Add Group
          </Button>
        </Box>
      </Box>

      {/* Dialog for Adding New Group */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{ fontFamily: "JetBrains Mono", color: "primary.main" }}
        >
          Add New Group
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 1,
          }}
        >
          {/* Group Name Field */}
          <TextField
            variant="outlined"
            label="Group Name"
            fullWidth
            required
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            sx={{ fontFamily: "JetBrains Mono" }}
            InputLabelProps={{
              sx: { fontFamily: "JetBrains Mono" },
            }}
          />

          {/* iOS Switch for Status */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ marginTop: 2 }}
          >
            <Typography sx={{ fontFamily: "Jetbrains Mono" }}>
              Group Status:
            </Typography>
            <IOSSwitch
              checked={groupStatus}
              onChange={() => setGroupStatus((prev) => !prev)}
            />
          </Box>

          {/* Multiple Device Selection */}
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel sx={{ fontFamily: "JetBrains Mono" }}>
              Select Devices
            </InputLabel>
            <Select
              multiple
              value={selectedDevices}
              onChange={handleDeviceChange}
              renderValue={(selected) =>
                selected
                  .map(
                    (id) => deviceList.find((device) => device.id === id)?.name
                  )
                  .join(", ")
              }
            >
              {deviceList.map((device) => (
                <MenuItem key={device.id} value={device.id}>
                  <Checkbox checked={selectedDevices.includes(device.id)} />
                  <ListItemText primary={device.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Selected Devices as Chips */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              marginTop: 2,
            }}
          >
            {selectedDevices.map((deviceId) => {
              const device = deviceList.find((d) => d.id === deviceId);
              return (
                <Chip
                  key={deviceId}
                  label={device?.name}
                  onDelete={() => handleRemoveChip(deviceId)}
                  deleteIcon={<CloseIcon />}
                  sx={{
                    fontSize: 14,
                  }}
                />
              );
            })}
          </Box>
        </DialogContent>

        {/* Dialog Actions */}
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{ fontFamily: "JetBrains Mono", color: "primary.main" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            sx={{ fontFamily: "JetBrains Mono", color: "white" }}
          >
            Add Group
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Groups;
