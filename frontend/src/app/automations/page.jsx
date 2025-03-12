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
  Switch,
  FormControlLabel,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import IOSSwitch from "../ui/iosButton";

const Automations = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState(dayjs());
  const [condition, setCondition] = useState("");
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [deviceStatus, setDeviceStatus] = useState(false);

  const conditions = ["At time"];

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch("http://localhost:8000/device_info");
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (!data || !data.smart_home_devices) {
          throw new Error("Invalid JSON structure received");
        }

        const connectedDevices = data.smart_home_devices.filter(
          (device) => device.connection_status === "connected"
        );

        setDevices(connectedDevices);
      } catch (error) {
        console.error("Error fetching device data:", error);
      }
    };

    fetchDevices();
  }, []);

  useEffect(() => {
    if (selectedDevice) {
      const device = devices.find((d) => d.name === selectedDevice);
      if (device) {
        setDeviceStatus(device.status === "on");
      }
    }
  }, [selectedDevice, devices]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setName("");
    setTrigger(dayjs());
    setCondition("");
    setSelectedDevice("");
    setDeviceStatus(false);
  };

  const handleSave = () => {
    console.log("Saving Automation:", { name, trigger, condition, selectedDevice, deviceStatus });
    handleCloseDialog();
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
            onClick={handleOpenDialog}
            sx={{
              fontFamily: "JetBrains Mono",
              fontWeight: 600,
              textTransform: "none",
              color: "white",
            }}
          >
            Add Automation Schedule
          </Button>
        </Box>
      </Box>

      {/* Dialog for Adding Automation */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontFamily: "JetBrains Mono" }}>Add Schedule</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {/* Name Input */}
          <TextField
            label="Automation Name"
            variant="outlined"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ fontFamily: "JetBrains Mono" }}
          />

          {/* Condition Dropdown */}
          <TextField
            select
            label="Condition"
            variant="outlined"
            fullWidth
            required
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            {conditions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          {/* Show time and device options only when "At time" is selected */}
          {condition === "At time" && (
            <>
              {/* Trigger Time Picker */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label="Trigger Time"
                  value={trigger}
                  onChange={(newValue) => setTrigger(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>

              {/* Device Selection */}
              <TextField
                select
                label="Select Device"
                variant="outlined"
                fullWidth
                required
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
              >
                {devices.map((device) => (
                  <MenuItem key={device.id} value={device.name}>
                    {device.name}
                  </MenuItem>
                ))}
              </TextField>

              {/* Device On/Off Toggle (Using IOSSwitch) */}
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <span>Device Status:</span>
                <IOSSwitch checked={deviceStatus} onChange={(e) => setDeviceStatus(e.target.checked)} />
              </Box>
            </>
          )}
        </DialogContent>

        {/* Dialog Actions */}
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" sx={{ fontFamily: "JetBrains Mono" }}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary" sx={{ fontFamily: "JetBrains Mono" }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Automations;
